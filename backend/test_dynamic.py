import os
import sys

# Ensure backend directory is in path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from database import engine, SessionLocal
import models
from starlette.testclient import TestClient
from main import app

def run_tests():
    print("====================================================")
    print("DIGITAL FOOTPRINT ANALYZER - DYNAMIC TEST SUITE")
    print("====================================================")

    client = TestClient(app)

    # 1. Test Health
    print("\n[1/3] Testing Health & Root Endpoint...")
    res = client.get("/health")
    assert res.status_code == 200
    print("  -> Health status:", res.json())

    # 2. Test Dynamic Analysis on 'Sundar Pichai'
    print("\n[2/3] Testing Dynamic Query on 'Sundar Pichai'...")
    res = client.post("/api/analyze", json={
        "full_name": "Sundar Pichai",
        "location": "California",
        "organization": "Google"
    })
    assert res.status_code == 200, f"Analysis failed: {res.text}"
    data = res.json()
    print("  -> Response status:", data.get("status"))
    print("  -> Person Name:", data.get("person", {}).get("name"))
    print("  -> Profession:", data.get("person", {}).get("profession"))
    print("  -> Organization:", data.get("person", {}).get("organization"))
    print("  -> DOB:", data.get("person", {}).get("date_of_birth"))
    print("  -> Social Profiles Found:", [s["platform"] for s in data.get("social_profiles", []) if s.get("is_verified")])
    print("  -> Total Sources in Ledger:", len(data.get("sources", [])))
    print("  -> Overall Confidence:", data.get("confidence"))

    assert data.get("person", {}).get("name") is not None
    assert len(data.get("sources", [])) > 0, "Expected sources in ledger"

    # 3. Test Identity Disambiguation on 'Rahul Kumar'
    print("\n[3/3] Testing Identity Disambiguation on 'Rahul Kumar'...")
    res = client.post("/api/analyze", json={
        "full_name": "Rahul Kumar"
    })
    assert res.status_code == 200
    data2 = res.json()
    print("  -> Response status:", data2.get("status"))
    if data2.get("status") == "disambiguation_needed":
        matches = data2.get("possible_matches", [])
        print(f"  -> Successfully detected {len(matches)} distinct candidate matches!")
        for m in matches[:3]:
            print(f"     * Candidate: {m['display_name']} - {m['description']}")
        assert len(matches) > 1, "Expected multiple candidates for Rahul Kumar"
    else:
        print("  -> Direct report returned with candidates attached:", len(data2.get("possible_matches", [])))

    print("\n====================================================")
    print("ALL DYNAMIC TESTS PASSED SUCCESSFULLY!")
    print("====================================================")

if __name__ == "__main__":
    run_tests()
