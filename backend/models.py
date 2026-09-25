import datetime
from sqlalchemy import Column, Integer, String, Text, Float, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    profiles = relationship("Profile", back_populates="user")
    privacy_requests = relationship("PrivacyRequest", back_populates="user")


class Profile(Base):
    __tablename__ = "profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    full_name = Column(String(255), nullable=False)
    headline = Column(String(255), nullable=True)
    location = Column(String(255), nullable=True)
    avatar_url = Column(String(500), nullable=True)
    confidence_score = Column(Float, default=0.88)
    confidence_level = Column(String(50), default="High Confidence")
    sources_count = Column(Integer, default=8)
    summary = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    user = relationship("User", back_populates="profiles")
    sources = relationship("Source", back_populates="profile", cascade="all, delete-orphan")
    education = relationship("Education", back_populates="profile", cascade="all, delete-orphan")
    employment = relationship("Employment", back_populates="profile", cascade="all, delete-orphan")
    skills = relationship("Skill", back_populates="profile", cascade="all, delete-orphan")
    photos = relationship("Photo", back_populates="profile", cascade="all, delete-orphan")
    entities = relationship("Entity", back_populates="profile", cascade="all, delete-orphan")
    analysis_results = relationship("AnalysisResult", back_populates="profile", cascade="all, delete-orphan")


class Source(Base):
    __tablename__ = "sources"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("profiles.id"), nullable=False)
    platform = Column(String(100), nullable=False) # e.g. GitHub, LinkedIn, Instagram, Facebook, University Directory
    source_type = Column(String(50), default="Public Web") # Public Web, Authorized OAuth, Directory
    url = Column(String(500), nullable=False)
    username = Column(String(100), nullable=True)
    reliability_score = Column(Float, default=0.90)
    match_confidence = Column(Float, default=0.92)
    is_verified = Column(Boolean, default=False)
    last_crawled = Column(DateTime, default=datetime.datetime.utcnow)

    profile = relationship("Profile", back_populates="sources")
    education_items = relationship("Education", back_populates="source_rel")
    employment_items = relationship("Employment", back_populates="source_rel")
    skills = relationship("Skill", back_populates="source_rel")


class Education(Base):
    __tablename__ = "education"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("profiles.id"), nullable=False)
    source_id = Column(Integer, ForeignKey("sources.id"), nullable=True)
    degree = Column(String(255), nullable=False) # e.g. B.Tech in Computer Science
    institution = Column(String(255), nullable=False) # e.g. Example Institute of Technology
    period = Column(String(100), nullable=True) # e.g. 2020 - 2024
    field_of_study = Column(String(255), nullable=True)
    confidence = Column(Float, default=0.94)
    extracted_text = Column(Text, nullable=True)
    is_verified = Column(Boolean, default=False)

    profile = relationship("Profile", back_populates="education")
    source_rel = relationship("Source", back_populates="education_items")


class Employment(Base):
    __tablename__ = "employment"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("profiles.id"), nullable=False)
    source_id = Column(Integer, ForeignKey("sources.id"), nullable=True)
    organization = Column(String(255), nullable=False)
    role = Column(String(255), nullable=False)
    period = Column(String(100), nullable=True)
    description = Column(Text, nullable=True)
    confidence = Column(Float, default=0.91)
    is_verified = Column(Boolean, default=False)

    profile = relationship("Profile", back_populates="employment")
    source_rel = relationship("Source", back_populates="employment_items")


class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("profiles.id"), nullable=False)
    source_id = Column(Integer, ForeignKey("sources.id"), nullable=True)
    name = Column(String(100), nullable=False)
    category = Column(String(100), default="Technical")
    extraction_method = Column(String(100), default="spaCy Entity Matcher")
    confidence = Column(Float, default=0.95)
    source_label = Column(String(100), default="GitHub Public Repositories")

    profile = relationship("Profile", back_populates="skills")
    source_rel = relationship("Source", back_populates="skills")


class Photo(Base):
    __tablename__ = "photos"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("profiles.id"), nullable=False)
    url = Column(String(500), nullable=False)
    source_platform = Column(String(100), nullable=False) # e.g. Sample Gallery, GitHub Public Avatar
    caption = Column(String(255), nullable=True)
    date_found = Column(String(100), nullable=True)
    is_authorized = Column(Boolean, default=True)
    is_sample = Column(Boolean, default=True)

    profile = relationship("Profile", back_populates="photos")


class Entity(Base):
    __tablename__ = "entities"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("profiles.id"), nullable=False)
    text = Column(String(255), nullable=False)
    label = Column(String(50), nullable=False) # PERSON, ORGANIZATION, EDUCATION, LOCATION, SKILL, DATE
    start_char = Column(Integer, nullable=True)
    end_char = Column(Integer, nullable=True)
    source_snippet = Column(Text, nullable=True)
    confidence = Column(Float, default=0.92)

    profile = relationship("Profile", back_populates="entities")


class AnalysisResult(Base):
    __tablename__ = "analysis_results"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("profiles.id"), nullable=True)
    analysis_type = Column(String(50), nullable=False) # name, social_profile, photo
    query_payload = Column(Text, nullable=False)
    status = Column(String(50), default="completed")
    entities_detected = Column(Integer, default=0)
    sources_scanned = Column(Integer, default=0)
    duration_ms = Column(Integer, default=240)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    profile = relationship("Profile", back_populates="analysis_results")


class PrivacyRequest(Base):
    __tablename__ = "privacy_requests"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    profile_id = Column(Integer, ForeignKey("profiles.id"), nullable=True)
    request_type = Column(String(100), nullable=False) # Removal Guidance, Cache Purge, Verification Audit
    target_item = Column(String(255), nullable=True)
    status = Column(String(50), default="pending")
    resolution_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="privacy_requests")
