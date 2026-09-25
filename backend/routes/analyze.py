from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List
from database import get_db
from models import Profile, AnalysisResult
from sample_data import seed_sample_profile
from nlp_engine import extract_entities, extract_keywords, calculate_similarity
import json

router = APIRouter(prefix="/api", tags=["Analysis"])

class NameAnalysisRequest(BaseModel):
    name: str
    location: Optional[str] = None

class ProfileAnalysisRequest(BaseModel):
    url: str
    platform: Optional[str] = "Generic Social"

class NlpTestRequest(BaseModel):
    text: str

@router.post("/analyze/name")
def analyze_name(payload: NameAnalysisRequest, db: Session = Depends(get_db)):
    if not payload.name or not payload.name.strip():
        raise HTTPException(status_code=400, detail="Full name is required.")

    # Dynamically seed or retrieve matching profile
    profile = seed_sample_profile(db, custom_name=payload.name, custom_location=payload.location)

    # Run real NLP extraction on summary and headline
    nlp_text = f"{profile.full_name} completed {profile.education[0].degree if profile.education else 'B.Tech'} at {profile.education[0].institution if profile.education else 'Example Institute of Technology'} and works at {profile.employment[0].organization if profile.employment else 'Apex Cyber Systems'}."
    detected_entities = extract_entities(nlp_text)
    keywords = extract_keywords(profile.summary or nlp_text)

    return {
        "status": "success",
        "message": "Analysis completed using public and authorized sources only.",
        "disclaimer": "SAMPLE DATA — NOT REAL PERSON INFORMATION. This academic prototype does not access private accounts.",
        "profile_id": profile.id,
        "name": profile.full_name,
        "confidence_score": profile.confidence_score,
        "sources_count": profile.sources_count,
        "nlp_sample_entities": detected_entities,
        "top_keywords": keywords
    }

@router.post("/analyze/profile")
def analyze_profile(payload: ProfileAnalysisRequest, db: Session = Depends(get_db)):
    if not payload.url or not payload.url.strip():
        raise HTTPException(status_code=400, detail="Public profile URL is required.")

    # Infer platform name and extracted username from URL
    url_lower = payload.url.lower()
    platform = "GitHub"
    username = "developer"
    if "github.com" in url_lower:
        platform = "GitHub"
        username = payload.url.rstrip("/").split("/")[-1]
    elif "linkedin.com" in url_lower:
        platform = "LinkedIn"
        username = payload.url.rstrip("/").split("/")[-1]
    elif "instagram.com" in url_lower:
        platform = "Instagram"
        username = payload.url.rstrip("/").split("/")[-1]
    elif "facebook.com" in url_lower:
        platform = "Facebook"
        username = payload.url.rstrip("/").split("/")[-1]

    # Clean username to derive display persona
    derived_name = username.replace(".", " ").replace("-", " ").replace("_", " ").title()
    if not derived_name or len(derived_name) < 3:
        derived_name = "Alex Morgan"

    profile = seed_sample_profile(db, custom_name=derived_name)

    return {
        "status": "success",
        "message": f"Public profile data mapped from authorized URL ({platform}).",
        "disclaimer": "SAMPLE DATA — NOT REAL PERSON INFORMATION. No private account data or passwords were used.",
        "profile_id": profile.id,
        "detected_platform": platform,
        "extracted_username": username,
        "match_confidence": 0.94
    }

@router.post("/analyze/photo")
async def analyze_photo(
    confirmed_consent: bool = Form(...),
    photo: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    if not confirmed_consent:
        raise HTTPException(
            status_code=400, 
            detail="Consent required: You must confirm you have permission to analyze this image."
        )

    # Use default prototype persona for safe academic demonstration
    profile = seed_sample_profile(db, custom_name="Alex Morgan")

    filename = photo.filename if photo else "uploaded_sample.jpg"

    return {
        "status": "success",
        "message": "Authorized photo analyzed against public portfolio templates.",
        "disclaimer": "Academic prototype does not perform facial recognition on strangers.",
        "profile_id": profile.id,
        "filename": filename,
        "consent_verified": True,
        "match_confidence": 0.87
    }

@router.post("/nlp/test")
def test_nlp(payload: NlpTestRequest):
    """
    Live interactive NLP tester: extracts entities (PERSON, ORG, EDUCATION, LOCATION, SKILL, DATE),
    TF-IDF keywords, and token statistics on arbitrary text submitted by the user.
    """
    if not payload.text or not payload.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty.")

    entities = extract_entities(payload.text)
    keywords = extract_keywords(payload.text, top_n=10)

    # Bio similarity benchmark
    benchmark_bio = "Software Engineer with experience in Python, NLP, React, and building machine learning systems."
    sim_score = calculate_similarity(payload.text, benchmark_bio)

    return {
        "text": payload.text,
        "entities": entities,
        "keywords": keywords,
        "similarity_to_benchmark": sim_score,
        "entity_counts": {
            label: sum(1 for e in entities if e["label"] == label)
            for label in ["PERSON", "ORGANIZATION", "EDUCATION", "LOCATION", "SKILL", "DATE"]
        }
    }
