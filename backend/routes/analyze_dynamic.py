from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List
import sys
import os

# Ensure backend directory is in path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import get_db
from models import Profile, AnalysisResult
from clients.wikidata import search_wikidata_entities, get_entity_details
from clients.wikipedia import get_wikipedia_summary
from clients.github import search_github_profile
from clients.search_engine import run_dynamic_searches
from services.identity_matcher import evaluate_candidates
from services.synthesizer import synthesize_profile

router = APIRouter(prefix="/api", tags=["Dynamic Footprint Analysis"])

class DynamicAnalyzeRequest(BaseModel):
    full_name: str
    location: Optional[str] = None
    organization: Optional[str] = None
    candidate_id: Optional[str] = None
    force_report: Optional[bool] = False

@router.post("/analyze")
def analyze_footprint(payload: DynamicAnalyzeRequest, db: Session = Depends(get_db)):
    if not payload.full_name or not payload.full_name.strip():
        raise HTTPException(status_code=400, detail="Full name is required.")

    name = payload.full_name.strip()
    location = payload.location.strip() if payload.location else None
    org = payload.organization.strip() if payload.organization else None

    # Step 1: Query Wikidata for candidate entities
    raw_candidates = search_wikidata_entities(name, limit=8)
    candidates = evaluate_candidates(raw_candidates, name, location, org)

    # Step 2: Handle Ambiguous Multi-Identity Matches (Identity Disambiguation)
    # If more than 1 candidate exists, and the user hasn't explicitly selected a candidate_id,
    # and the top 2 candidates have close scores (or no candidate has a Wikipedia title or huge score gap)
    is_ambiguous = len(candidates) > 1 and not payload.candidate_id and not payload.force_report
    
    # If the user explicitly asks or if it's very ambiguous (e.g. common name like Rahul Kumar)
    # Check if the top candidate is drastically better or if ambiguous
    top_score = candidates[0]["score"] if candidates else 0
    second_score = candidates[1]["score"] if len(candidates) > 1 else 0
    
    # If user provided location or organization, it helps disambiguate
    has_context_filter = bool(location or org)
    if is_ambiguous and not has_context_filter and (top_score - second_score < 20) and len(candidates) >= 2:
        return {
            "status": "disambiguation_needed",
            "message": f"Multiple possible individuals named '{name}' were discovered. Please choose the intended candidate below.",
            "possible_matches": candidates,
            "query": {
                "full_name": name,
                "location": location,
                "organization": org
            }
        }

    # Step 3: Select target candidate ID
    selected_entity_id = payload.candidate_id
    if not selected_entity_id and candidates:
        selected_entity_id = candidates[0]["candidate_id"]

    # Step 4: Fetch detailed claims from Wikidata
    wikidata_data = get_entity_details(selected_entity_id) if selected_entity_id else {}

    # Step 5: Fetch Wikipedia Summary
    wiki_title = wikidata_data.get("wikipedia_title") or name
    wikipedia_data = get_wikipedia_summary(wiki_title)

    # Step 6: Search GitHub Public Profile
    github_data = search_github_profile(name, location, org)

    # Step 7: Run dynamic tailored search queries
    # ("name" biography, profession, DOB, LinkedIn, GitHub, Instagram, X, website)
    search_results = run_dynamic_searches(name, location, org)

    # Step 8: Synthesize all 11 categories with provenance, confidence, and conflict detection
    report = synthesize_profile(
        name=name,
        wikidata_data=wikidata_data,
        wikipedia_data=wikipedia_data,
        github_data=github_data,
        search_results=search_results,
        location_input=location,
        org_input=org
    )

    # Attach candidate matches so the user can easily switch between candidates in the UI
    report["possible_matches"] = candidates
    report["status"] = "success"
    report["query"] = {
        "full_name": name,
        "location": location,
        "organization": org,
        "selected_candidate_id": selected_entity_id
    }

    # Log analysis in database
    try:
        ar = AnalysisResult(
            analysis_type="dynamic_web_analysis",
            query_payload=f'{{"name": "{name}", "location": "{location}", "org": "{org}"}}',
            status="completed",
            entities_detected=len(report.get("sources", [])),
            sources_scanned=len(report.get("sources", [])),
            duration_ms=450
        )
        db.add(ar)
        db.commit()
    except Exception as e:
        print(f"Db log warning: {e}")

    return report
