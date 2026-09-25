from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from database import get_db
from models import Profile, Source, Education, Employment, Skill, Photo, Entity
from sample_data import seed_sample_profile

router = APIRouter(prefix="/api", tags=["Profile"])

class VerifyRequest(BaseModel):
    item_type: str  # source, education, employment, skill
    item_id: int
    is_verified: bool

@router.get("/profile/{profile_id}")
def get_profile(profile_id: int, db: Session = Depends(get_db)):
    profile = db.query(Profile).filter(Profile.id == profile_id).first()
    if not profile:
        # Fallback to seeding default profile
        profile = seed_sample_profile(db)

    # Format web mentions
    web_mentions = [
        {
            "id": 1,
            "website": "TechInnovators Weekly",
            "title": "Example Institute of Technology Students Win Regional Hackathon for NLP Search Engine",
            "date": "November 2023",
            "extracted_information": "Team recognized for developing NLP entity matching microservices using spaCy.",
            "source_url": "https://techinnovators.example.com/hackathon-nlp-winners-2023",
            "relevance_score": 0.94
        },
        {
            "id": 2,
            "website": "OpenSource Digest",
            "title": f"Contributor Spotlight: {profile.full_name.lower().replace(' ', '')}-dev on FastAPI and spaCy integrations",
            "date": "February 2024",
            "extracted_information": "Demonstrated open-source entity extraction pipeline with zero external credential leakage.",
            "source_url": "https://osdigest.example.org/contributions/fastapi-spacy",
            "relevance_score": 0.91
        },
        {
            "id": 3,
            "website": "University Press Release",
            "title": "Dean's Honor List Announced for Computer Science Graduates",
            "date": "May 2024",
            "extracted_information": "Commended for academic excellence in Distributed Systems and Machine Learning coursework.",
            "source_url": "https://example-institute.edu/press/deans-list-2024",
            "relevance_score": 0.88
        }
    ]

    return {
        "id": profile.id,
        "full_name": profile.full_name,
        "headline": profile.headline,
        "location": profile.location,
        "avatar_url": profile.avatar_url,
        "confidence_score": profile.confidence_score,
        "confidence_level": profile.confidence_level,
        "sources_count": len(profile.sources),
        "summary": profile.summary,
        "badge": "PUBLIC / AUTHORIZED INFORMATION ONLY",
        "disclaimer": "This academic prototype does not access private accounts or bypass platform privacy controls.",
        "sample_notice": "SAMPLE DATA — NOT REAL PERSON INFORMATION",
        "sources": [
            {
                "id": s.id,
                "platform": s.platform,
                "source_type": s.source_type,
                "url": s.url,
                "username": s.username,
                "reliability_score": s.reliability_score,
                "match_confidence": s.match_confidence,
                "is_verified": s.is_verified,
                "last_crawled": s.last_crawled.isoformat() if s.last_crawled else None
            }
            for s in profile.sources
        ],
        "education": [
            {
                "id": e.id,
                "degree": e.degree,
                "institution": e.institution,
                "period": e.period,
                "field_of_study": e.field_of_study,
                "confidence": e.confidence,
                "extracted_text": e.extracted_text,
                "is_verified": e.is_verified,
                "source_platform": e.source_rel.platform if e.source_rel else "University Directory"
            }
            for e in profile.education
        ],
        "employment": [
            {
                "id": em.id,
                "organization": em.organization,
                "role": em.role,
                "period": em.period,
                "description": em.description,
                "confidence": em.confidence,
                "is_verified": em.is_verified,
                "source_platform": em.source_rel.platform if em.source_rel else "LinkedIn"
            }
            for em in profile.employment
        ],
        "skills": [
            {
                "id": sk.id,
                "name": sk.name,
                "category": sk.category,
                "extraction_method": sk.extraction_method,
                "confidence": sk.confidence,
                "source_label": sk.source_label
            }
            for sk in profile.skills
        ],
        "photos": [
            {
                "id": p.id,
                "url": p.url,
                "source_platform": p.source_platform,
                "caption": p.caption,
                "date_found": p.date_found,
                "is_authorized": p.is_authorized,
                "is_sample": p.is_sample
            }
            for p in profile.photos
        ],
        "entities": [
            {
                "id": ent.id,
                "text": ent.text,
                "label": ent.label,
                "start_char": ent.start_char,
                "end_char": ent.end_char,
                "source_snippet": ent.source_snippet,
                "confidence": ent.confidence
            }
            for ent in profile.entities
        ],
        "web_mentions": web_mentions
    }

@router.get("/profile/{profile_id}/sources")
def get_profile_sources(profile_id: int, db: Session = Depends(get_db)):
    profile = db.query(Profile).filter(Profile.id == profile_id).first()
    if not profile:
        profile = seed_sample_profile(db)

    return {
        "profile_id": profile.id,
        "total_sources": len(profile.sources),
        "disclaimer": "All sources represent publicly indexed URLs or mock authorized directories.",
        "sources": [
            {
                "id": s.id,
                "platform": s.platform,
                "source_type": s.source_type,
                "url": s.url,
                "reliability_score": s.reliability_score,
                "match_confidence": s.match_confidence,
                "is_verified": s.is_verified,
                "last_crawled": s.last_crawled.isoformat() if s.last_crawled else None
            }
            for s in profile.sources
        ]
    }

@router.post("/verify")
def verify_item(payload: VerifyRequest, db: Session = Depends(get_db)):
    """
    Toggles user verification on a specific item (e.g. confirming or disputing extracted education/source).
    """
    model_map = {
        "source": Source,
        "education": Education,
        "employment": Employment,
    }

    model_class = model_map.get(payload.item_type.lower())
    if not model_class:
        raise HTTPException(status_code=400, detail=f"Unsupported item type: {payload.item_type}")

    item = db.query(model_class).filter(model_class.id == payload.item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found.")

    item.is_verified = payload.is_verified
    db.commit()

    return {
        "status": "success",
        "message": f"{payload.item_type.capitalize()} verification updated.",
        "item_id": payload.item_id,
        "is_verified": item.is_verified
    }
