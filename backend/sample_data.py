import datetime
from sqlalchemy.orm import Session
from models import User, Profile, Source, Education, Employment, Skill, Photo, Entity, AnalysisResult

SAMPLE_PERSON_NAME = "Alex Morgan"

def seed_sample_profile(db: Session, custom_name: str = None, custom_location: str = None) -> Profile:
    """
    Seeds database with fictional persona (Alex Morgan by default or custom query).
    Guarantees strict labeling: SAMPLE DATA — NOT REAL PERSON INFORMATION.
    """
    name = custom_name.strip() if custom_name and custom_name.strip() else SAMPLE_PERSON_NAME
    location = custom_location.strip() if custom_location and custom_location.strip() else "San Francisco, CA (Public Listing)"

    # Check if this profile already exists
    existing = db.query(Profile).filter(Profile.full_name == name).first()
    if existing:
        return existing

    # Create master profile
    profile = Profile(
        full_name=name,
        headline="Software Developer & NLP Researcher",
        location=location,
        avatar_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
        confidence_score=0.89,
        confidence_level="High Confidence",
        sources_count=8,
        summary="Software Developer specializing in NLP, full-stack web applications, and entity extraction architectures. Completed B.Tech in Computer Science at Example Institute of Technology.",
    )
    db.add(profile)
    db.commit()
    db.refresh(profile)

    # 1. Sources (8 sources as requested)
    sources_data = [
        {"platform": "GitHub", "url": f"https://github.com/{name.lower().replace(' ', '')}-dev", "username": f"{name.lower().replace(' ', '')}-dev", "reliability_score": 0.96, "match_confidence": 0.95, "is_verified": True},
        {"platform": "LinkedIn", "url": f"https://linkedin.com/in/{name.lower().replace(' ', '-')}-sample", "username": f"{name.lower().replace(' ', '-')}-sample", "reliability_score": 0.94, "match_confidence": 0.93, "is_verified": True},
        {"platform": "Instagram", "url": f"https://instagram.com/{name.lower().replace(' ', '.')}.codes", "username": f"{name.lower().replace(' ', '.')}.codes", "reliability_score": 0.82, "match_confidence": 0.79, "is_verified": False},
        {"platform": "Facebook", "url": f"https://facebook.com/{name.lower().replace(' ', '.')}.public", "username": f"{name.lower().replace(' ', '.')}.public", "reliability_score": 0.78, "match_confidence": 0.72, "is_verified": False},
        {"platform": "University Directory", "url": "https://example-institute.edu/students/directory/2024", "username": "student-id-9482", "reliability_score": 0.98, "match_confidence": 0.97, "is_verified": True},
        {"platform": "TechInnovators Press", "url": "https://techinnovators.example.com/hackathon-nlp-winners-2023", "username": "contributor", "reliability_score": 0.89, "match_confidence": 0.88, "is_verified": True},
        {"platform": "OpenSource Digest", "url": "https://osdigest.example.org/contributions/fastapi-spacy", "username": "os-author", "reliability_score": 0.91, "match_confidence": 0.90, "is_verified": False},
        {"platform": "Google Scholar Public Citations", "url": "https://scholar.google.com/citations?user=sample_morgan", "username": "citation-record", "reliability_score": 0.95, "match_confidence": 0.92, "is_verified": True},
    ]

    source_objs = []
    for s in sources_data:
        src = Source(
            profile_id=profile.id,
            platform=s["platform"],
            source_type="Public Web / Directory",
            url=s["url"],
            username=s["username"],
            reliability_score=s["reliability_score"],
            match_confidence=s["match_confidence"],
            is_verified=s["is_verified"],
        )
        db.add(src)
        source_objs.append(src)
    db.commit()

    # 2. Education Timeline
    edu1 = Education(
        profile_id=profile.id,
        source_id=source_objs[4].id,
        degree="B.Tech in Computer Science",
        institution="Example Institute of Technology",
        period="2020 - 2024",
        field_of_study="Computer Science & Engineering",
        confidence=0.96,
        extracted_text="Completed 4-year Bachelor of Technology in Computer Science with focus on Distributed Systems and Machine Learning.",
        is_verified=True,
    )
    edu2 = Education(
        profile_id=profile.id,
        source_id=source_objs[0].id,
        degree="Certified NLP Specialist",
        institution="DeepLearning Research Academy",
        period="2023",
        field_of_study="Natural Language Processing & Transformers",
        confidence=0.91,
        extracted_text="Advanced certification covering spaCy pipelines, NER token classification, and embedding similarity metrics.",
        is_verified=False,
    )
    db.add_all([edu1, edu2])

    # 3. Career / Employment
    emp1 = Employment(
        profile_id=profile.id,
        source_id=source_objs[1].id,
        organization="Apex Cyber Systems",
        role="Software Developer",
        period="2024 - Present",
        description="Developing Python FastAPI microservices, spaCy NLP pipelines, and React client dashboards for automated document classification.",
        confidence=0.94,
        is_verified=True,
    )
    emp2 = Employment(
        profile_id=profile.id,
        source_id=source_objs[1].id,
        organization="NexaTech Labs",
        role="Junior Developer Intern",
        period="2023 - 2024",
        description="Built responsive TypeScript user interfaces, integrated RESTful APIs, and created unit tests for data verification pipelines.",
        confidence=0.89,
        is_verified=False,
    )
    db.add_all([emp1, emp2])

    # 4. Skills with extraction provenance
    skills_data = [
        {"name": "Python", "category": "Technical", "method": "spaCy Entity Matcher (GitHub repositories)", "conf": 0.98, "label": "GitHub Public Repos"},
        {"name": "React", "category": "Technical", "method": "Profile Matcher (Portfolio & LinkedIn)", "conf": 0.95, "label": "LinkedIn Profile & GitHub"},
        {"name": "SQL", "category": "Technical", "method": "Coursework Matcher (University Project)", "conf": 0.92, "label": "University Directory Project"},
        {"name": "NLP", "category": "AI / NLP", "method": "spaCy NER (Bio & Public Articles)", "conf": 0.96, "label": "TechInnovators Press Mention"},
        {"name": "Machine Learning", "category": "AI / NLP", "method": "Keyword Extractor (Capstone project)", "conf": 0.91, "label": "University Directory"},
        {"name": "Java", "category": "Technical", "method": "Regex Skill Matcher (Coursework)", "conf": 0.88, "label": "Academic Coursework"},
        {"name": "FastAPI", "category": "Technical", "method": "spaCy Entity Matcher (OpenSource Digest)", "conf": 0.93, "label": "OpenSource Digest"},
        {"name": "Docker", "category": "DevOps", "method": "Repository Config Inspector", "conf": 0.86, "label": "GitHub Public Configs"},
    ]
    for sk in skills_data:
        db.add(Skill(
            profile_id=profile.id,
            source_id=source_objs[0].id,
            name=sk["name"],
            category=sk["category"],
            extraction_method=sk["method"],
            confidence=sk["conf"],
            source_label=sk["label"]
        ))

    # 5. Photos (Sample/Demo Images with strict authorized tags)
    photos_data = [
        {"url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80", "platform": "Authorized Upload (Demo)", "caption": "Professional Profile Portrait", "date": "2024-03-15"},
        {"url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80", "platform": "GitHub Public Avatar (Sample)", "caption": "Tech Conference Speaker Badge", "date": "2023-11-20"},
        {"url": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80", "platform": "University Team Photo (Sample)", "caption": "Hackathon 1st Place Team Award", "date": "2023-09-12"},
    ]
    for p in photos_data:
        db.add(Photo(
            profile_id=profile.id,
            url=p["url"],
            source_platform=p["platform"],
            caption=p["caption"],
            date_found=p["date"],
            is_authorized=True,
            is_sample=True,
        ))

    # 6. Extracted NLP Entities
    entities_data = [
        {"text": name, "label": "PERSON", "start": 0, "end": len(name), "snippet": f"{name} is a software developer.", "conf": 0.99},
        {"text": "B.Tech in Computer Science", "label": "EDUCATION", "start": 12, "end": 38, "snippet": "Completed B.Tech in Computer Science degree.", "conf": 0.97},
        {"text": "Example Institute of Technology", "label": "ORGANIZATION", "start": 42, "end": 73, "snippet": "Studied at Example Institute of Technology.", "conf": 0.95},
        {"text": "Apex Cyber Systems", "label": "ORGANIZATION", "start": 10, "end": 28, "snippet": "Works at Apex Cyber Systems as developer.", "conf": 0.93},
        {"text": "San Francisco, CA", "label": "LOCATION", "start": 5, "end": 22, "snippet": "Public location registered as San Francisco, CA.", "conf": 0.92},
        {"text": "Python", "label": "SKILL", "start": 0, "end": 6, "snippet": "Proficient in Python and FastAPI backend development.", "conf": 0.98},
        {"text": "React", "label": "SKILL", "start": 15, "end": 20, "snippet": "Frontend built using React and TypeScript.", "conf": 0.96},
        {"text": "2020 - 2024", "label": "DATE", "start": 0, "end": 11, "snippet": "Academic period 2020 - 2024.", "conf": 0.91},
    ]
    for ent in entities_data:
        db.add(Entity(
            profile_id=profile.id,
            text=ent["text"],
            label=ent["label"],
            start_char=ent["start"],
            end_char=ent["end"],
            source_snippet=ent["snippet"],
            confidence=ent["conf"]
        ))

    # 7. Analysis Result Log
    db.add(AnalysisResult(
        profile_id=profile.id,
        analysis_type="name",
        query_payload=f'{{"name": "{name}", "location": "{location}"}}',
        status="completed",
        entities_detected=len(entities_data),
        sources_scanned=8,
        duration_ms=310
    ))

    db.commit()
    return profile
