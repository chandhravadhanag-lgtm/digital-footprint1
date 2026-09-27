# Digital Footprint Analyzer

A full-stack, consent-focused web application that dynamically queries and synthesizes a person's digital footprint using **real-time public APIs and web discovery**.

Unlike fixed prototypes or hardcoded datasets, **Digital Footprint Analyzer** performs a live, multi-source search every time a user submits a query. It implements **strict identity matching and disambiguation** to prevent combining information from different people who share the same name.

---

## Key Features

1. **Dynamic Real-Time Web Discovery**:
   - Zero hardcoded names or pre-populated person dictionaries.
   - Dynamic queries constructed from user inputs:
     - `"{name}" biography`
     - `"{name}" profession`
     - `"{name}" date of birth`
     - `"{name}" LinkedIn`
     - `"{name}" GitHub`
     - `"{name}" Instagram`
     - `"{name}" X`
     - `"{name}" official website`
2. **Multi-Source Public API Integrations**:
   - **Wikidata API & SPARQL**: Extracts structured claims (P569 DOB, P106 occupation, P108 employer, P69 education, P856 website, social handles).
   - **Wikipedia REST API**: Biographical summaries, abstracts, and verified portrait images.
   - **GitHub Public API**: Public developer bios, repository counts, companies, and blog links.
   - **Brave Search API** & Resilient Fallback: Real-time search discovery for articles, handles, and official sites.
3. **Identity Matching & Disambiguation**:
   - If multiple candidates are discovered (e.g. `Rahul Kumar`), the system detects ambiguity, scores candidates using optional location and organization parameters, and presents a candidate selection interface before conflating records.
4. **11 Core Categories with Source Provenance**:
   - Full Name, Profession, Organization, Date of Birth, Education, Career, Official Website, Social Profiles (LinkedIn, GitHub, X, Instagram, Facebook, YouTube), News Mentions, Relevant Websites, and Complete Sources Ledger.
   - Every fact provides its origin URL and confidence rating (`High`, `Medium`, `Low`).
   - Missing data explicitly states: `Not found / Not publicly verified`.
   - Contradictory information triggers: `Sources disagree — manual verification recommended.`
5. **Strict Privacy Safeguards**:
   - Zero access to private accounts, no private inboxes, no password harvesting, and no reverse phone lookups on strangers.

---

## Project Folder Structure

```
nlp_project/
├── .env                  # Local environment configuration
├── .env.example          # Environment template
├── README.md             # Project documentation
├── start_project.bat     # Windows one-click launcher for both servers
├── digitaltrace.db       # SQLite database (auto-created on startup)
│
├── backend/              # FastAPI Python Backend
│   ├── clients/          # Modular API integrations
│   │   ├── wikidata.py   # Wikidata entity search & claim extraction
│   │   ├── wikipedia.py  # Wikipedia REST API client
│   │   ├── github.py     # GitHub Public API client
│   │   └── search_engine.py # Brave Search API + resilient search fallback
│   ├── services/
│   │   ├── identity_matcher.py # Disambiguation & candidate scoring
│   │   └── synthesizer.py      # Fact compiler & confidence calculator
│   ├── routes/
│   │   ├── analyze_dynamic.py  # POST /api/analyze (Dynamic engine)
│   │   ├── profile.py          # Profile retrieval & verification
│   │   └── privacy.py          # Delisting & removal guidance
│   ├── database.py       # SQLAlchemy database session setup
│   ├── models.py         # Database schema (10 ORM tables)
│   ├── main.py           # FastAPI entrypoint
│   └── test_dynamic.py   # Automated dynamic backend test suite
│
└── frontend/             # React + TypeScript + Tailwind CSS Frontend
    ├── src/
    │   ├── components/
    │   │   ├── SearchPage.tsx        # Search input with location/org filters
    │   │   ├── CandidateSelector.tsx # Disambiguation match cards
    │   │   ├── ReportDashboard.tsx   # 11-category results dashboard
    │   │   ├── Navbar.tsx            # Header with privacy status
    │   │   ├── AnalysisModal.tsx     # Animated multi-stage loader
    │   │   └── SocialIcons.tsx       # Platform SVG icons
    │   ├── types.ts      # TypeScript interfaces
    │   ├── App.tsx       # Main state & view controller
    │   └── index.css     # Dark AI SaaS glassmorphism styling
    ├── package.json
    └── vite.config.ts    # Vite config with API proxy
```

---

## Setup & Running Locally

### Prerequisites
- Python 3.10+ (Installed on system)
- Node.js 18+ and npm

### 1. Backend Setup

Open a terminal in the `backend/` directory:
```bash
# Navigate to backend
cd backend

# Install dependencies (if not already installed)
pip install fastapi uvicorn sqlalchemy requests httpx beautifulsoup4 pydantic python-multipart scikit-learn spacy

# (Optional) Download spaCy English model
python -m spacy download en_core_web_sm

# Start FastAPI server
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
The backend will be live at: **`http://localhost:8000`**  
Interactive Swagger API docs: **`http://localhost:8000/docs`**

### 2. Frontend Setup

Open a new terminal in the `frontend/` directory:
```bash
# Navigate to frontend
cd frontend

# Install npm dependencies
npm install

# Start development server
npm run dev -- --host 0.0.0.0 --port 5173
```
The frontend will be live at: **`http://localhost:5173`**

### 3. One-Click Launcher (Windows)
Double-click `start_project.bat` in the root folder to automatically spin up both the backend and frontend in separate command windows.

---

## How to Obtain API Keys

### Brave Search API (Optional)
The application includes a resilient public search fallback that functions automatically for all queries. To connect official Brave Search API:
1. Visit the [Brave Search API Portal](https://brave.com/search/api/).
2. Create an account and sign up for the free tier (up to 2,000 queries per month).
3. Copy your subscription key.
4. Add the key to `.env` in the project root:
   ```env
   BRAVE_API_KEY=your_brave_api_key_here
   ```
5. Restart the backend server.

---

## API Documentation

### `POST /api/analyze`

**Request Payload:**
```json
{
  "full_name": "Sundar Pichai",
  "location": "California",
  "organization": "Google",
  "candidate_id": null
}
```

**Single Unambiguous Response (`status: "success"`):**
```json
{
  "status": "success",
  "person": {
    "name": "Sundar Pichai",
    "headline": "Indian-American business executive, CEO of Google LLC & Alphabet Inc.",
    "profession": {
      "value": "Computer Scientist, Executive, Chief Executive Officer",
      "source": "https://www.wikidata.org/wiki/Q3503829",
      "confidence": "High"
    },
    "organization": {
      "value": "Google, Alphabet Inc.",
      "source": "https://www.wikidata.org/wiki/Q3503829",
      "confidence": "High"
    },
    "date_of_birth": {
      "value": "1972-06-10",
      "source": "https://www.wikidata.org/wiki/Q3503829",
      "confidence": "High"
    },
    "education": [...],
    "career": [...],
    "official_website": {...}
  },
  "social_profiles": [
    {
      "platform": "LinkedIn",
      "url": "https://linkedin.com/in/sundarpichai",
      "is_verified": true,
      "source": "Wikidata / LinkedIn Public Search",
      "confidence": "High"
    },
    ...
  ],
  "websites": [...],
  "news": [...],
  "sources": [...],
  "confidence": "High"
}
```

**Disambiguation Response (`status: "disambiguation_needed"`):**
Returned when multiple individuals share the same name (e.g. `Rahul Kumar`):
```json
{
  "status": "disambiguation_needed",
  "message": "Multiple possible individuals named 'Rahul Kumar' were discovered. Please choose the intended candidate below.",
  "possible_matches": [
    {
      "candidate_id": "Q108740523",
      "display_name": "Rahul Kumar",
      "description": "chemical engineering researcher",
      "profession": "Chemical engineering researcher",
      "organization": "Public Registry",
      "score": 90
    },
    {
      "candidate_id": "Q104884210",
      "display_name": "Rahul Kumar",
      "description": "water quality researcher",
      "profession": "Water quality researcher",
      "organization": "Public Registry",
      "score": 90
    }
  ]
}
```

---

## Testing

Run the automated test suite to verify live dynamic queries and disambiguation:
```bash
python backend/test_dynamic.py
```
Test results verify:
1. `Sundar Pichai` produces full dynamic profile with DOB, Google/Alphabet, and social links.
2. `Rahul Kumar` detects multiple distinct candidates and triggers identity disambiguation.
3. Missing fields fallback cleanly to `"Not found / Not publicly verified"`.

---

## Deployment (Render.com)

This project is configured for **one-click deployment** on [Render.com](https://render.com) (free tier).

### Deploy Steps

1. Go to [https://render.com](https://render.com) and sign up / log in with GitHub
2. Click **New → Web Service**
3. Connect your GitHub repo: `chandhravadhanag-lgtm/digital-footprint1`
4. Render will auto-detect the `render.yaml` — confirm these settings:
   - **Build Command**: `./build.sh`
   - **Start Command**: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Plan**: Free
5. (Optional) Add environment variable `BRAVE_API_KEY` in the Render dashboard for enhanced search
6. Click **Deploy**

The build process will:
- Install Python dependencies from `requirements.txt`
- Install Node.js dependencies and build the React frontend
- Copy the frontend build into `backend/static/`
- FastAPI serves both the API and the React SPA from a single service

### Live URL

After deployment, your app will be available at:
```
https://digital-footprint-analyzer.onrender.com
```
(or whatever name Render assigns)

