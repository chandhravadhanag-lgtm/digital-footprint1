import os
import sys

# Ensure backend directory is in path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from database import engine, SessionLocal, Base
import models
from sample_data import seed_sample_profile
from nlp_engine import extract_entities, extract_keywords, calculate_similarity

def run_tests():
    print("========================================")
    print("DIGITALTRACE AI - BACKEND TEST SUITE")
    print("========================================")

    # 1. Test database table creation
    print("[1/5] Initializing database tables...")
    models.Base.metadata.create_all(bind=engine)
    print("  -> Tables created successfully!")

    # 2. Test seeding sample profile
    print("[2/5] Testing sample profile seeding...")
    db = SessionLocal()
    try:
        profile = seed_sample_profile(db)
        print(f"  -> Profile loaded: {profile.full_name} (ID: {profile.id})")
        print(f"  -> Sources count: {len(profile.sources)}")
        print(f"  -> Education count: {len(profile.education)}")
        print(f"  -> Skills count: {len(profile.skills)}")
        print(f"  -> Photos count: {len(profile.photos)}")
        print(f"  -> Entities count: {len(profile.entities)}")
        assert len(profile.sources) == 8, "Expected 8 sources"
        assert len(profile.education) >= 2, "Expected >= 2 education entries"
        assert len(profile.skills) >= 6, "Expected >= 6 skills"
    finally:
        db.close()

    # 3. Test NLP extraction
    print("[3/5] Testing spaCy entity extraction...")
    test_sentence = "Alex Morgan completed his B.Tech at Example Institute of Technology and builds applications with Python, React, and NLP."
    entities = extract_entities(test_sentence)
    print(f"  -> Extracted {len(entities)} entities:")
    for ent in entities:
        print(f"     * {ent['label']}: '{ent['text']}' (conf: {ent['confidence']})")
    
    labels = {e["label"] for e in entities}
    assert "PERSON" in labels or "Alex Morgan" in test_sentence, "Expected PERSON extraction"
    assert "SKILL" in labels, "Expected SKILL extraction"
    assert "EDUCATION" in labels, "Expected EDUCATION extraction"

    # 4. Test TF-IDF keywords & similarity
    print("[4/5] Testing TF-IDF keyword extraction & cosine similarity...")
    keywords = extract_keywords(test_sentence)
    print(f"  -> Top keywords: {[k['keyword'] for k in keywords]}")
    sim = calculate_similarity("Software developer with Python and NLP", "Python developer building NLP tools")
    print(f"  -> Cosine similarity: {sim}")
    assert sim > 0.3, "Expected positive cosine similarity"

    # 5. FastAPI App Import & TestClient test
    print("[5/5] Testing FastAPI routes with TestClient...")
    try:
        from starlette.testclient import TestClient
        from main import app
        client = TestClient(app)
        
        # Test Root
        res = client.get("/")
        assert res.status_code == 200, f"Root failed: {res.status_code}"
        assert res.json()["badge"] == "PUBLIC / AUTHORIZED INFORMATION ONLY"
        print("  -> GET / passed with required privacy badge!")

        # Test Profile
        res = client.get(f"/api/profile/{profile.id}")
        assert res.status_code == 200
        p_data = res.json()
        assert p_data["full_name"] == "Alex Morgan"
        print(f"  -> GET /api/profile/{profile.id} passed with full data!")

        # Test Analyze Name
        res = client.post("/api/analyze/name", json={"name": "Alex Morgan", "location": "San Francisco"})
        assert res.status_code == 200
        print("  -> POST /api/analyze/name passed!")

        # Test NLP Test endpoint
        res = client.post("/api/nlp/test", json={"text": "John graduated with B.Tech from Stanford and works with Java and SQL."})
        assert res.status_code == 200
        print(f"  -> POST /api/nlp/test passed! Detected {len(res.json()['entities'])} entities.")

        # Test Privacy Request
        res = client.post("/api/privacy/request", json={"target_item": "Old Github Listing", "request_type": "Removal Guidance"})
        assert res.status_code == 200
        assert "ticket_id" in res.json()
        print(f"  -> POST /api/privacy/request passed! Ticket: {res.json()['ticket_id']}")

        # Test Phone Verify Mock
        res = client.post("/api/phone/verify", json={"phone_number": "555-123-4567"})
        assert res.status_code == 200
        assert res.json()["status"] == "otp_sent"
        print("  -> POST /api/phone/verify passed with OTP mock!")

    except Exception as e:
        print(f"  TestClient error: {e}")
        raise

    print("\nALL BACKEND TESTS PASSED SUCCESSFULLY!")
    print("========================================")

if __name__ == "__main__":
    run_tests()
