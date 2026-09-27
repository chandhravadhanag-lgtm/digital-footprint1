import os
from pathlib import Path
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
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

# --- Production: Serve React frontend build ---
STATIC_DIR = Path(__file__).parent / "static"

if STATIC_DIR.exists() and (STATIC_DIR / "index.html").exists():
    # Serve static assets (JS, CSS, images)
    app.mount("/assets", StaticFiles(directory=str(STATIC_DIR / "assets")), name="assets")

    # Serve other static files (favicon, etc.)
    @app.get("/favicon.svg")
    async def favicon():
        return FileResponse(str(STATIC_DIR / "favicon.svg"))

    # SPA catch-all: serve index.html for any non-API route
    @app.get("/{full_path:path}")
    async def serve_spa(request: Request, full_path: str):
        # Don't intercept API routes
        if full_path.startswith("api/") or full_path in ("docs", "openapi.json", "redoc", "health"):
            return None
        file_path = STATIC_DIR / full_path
        if file_path.exists() and file_path.is_file():
            return FileResponse(str(file_path))
        return FileResponse(str(STATIC_DIR / "index.html"))

