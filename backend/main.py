from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base, SessionLocal
import models
from sample_data import seed_sample_profile
from routes.analyze import router as analyze_router
from routes.analyze_dynamic import router as dynamic_analyze_router
from routes.profile import router as profile_router
from routes.privacy import router as privacy_router

# Initialize all database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Digital Footprint Analyzer Backend",
    description="Dynamic Multi-Source Digital Footprint Analyzer with Identity Disambiguation & Provenance",
    version="2.0.0"
)

# Enable CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(dynamic_analyze_router) # POST /api/analyze (Dynamic real-time search & disambiguation)
app.include_router(analyze_router)         # Legacy prototype routes
app.include_router(profile_router)         # Profile retrieval & verification
app.include_router(privacy_router)         # Removal guidance & privacy

@app.on_event("startup")
def on_startup():
    db = SessionLocal()
    try:
        seed_sample_profile(db)
    finally:
        db.close()

@app.get("/")
def read_root():
    return {
        "app": "Digital Footprint Analyzer",
        "purpose": "Dynamic public web discovery with identity disambiguation and provenance",
        "badge": "PUBLIC / AUTHORIZED INFORMATION ONLY",
        "disclaimer": "This system accesses only publicly available web information. Zero private account scraping.",
        "status": "online"
    }

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "services": ["Wikidata API", "Wikipedia REST API", "GitHub API", "Dynamic Web Search"],
        "dynamic_search": "active"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
