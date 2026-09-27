# Stage 1: Build React frontend
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Python backend + serve frontend
FROM python:3.11-slim
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN python -m spacy download en_core_web_sm || true

# Copy backend code
COPY backend/ ./backend/

# Copy frontend build from Stage 1 into backend/static
COPY --from=frontend-build /app/frontend/dist ./backend/static/

# Copy env file
COPY .env.example ./backend/.env

# Hugging Face Spaces uses port 7860
EXPOSE 7860

# Start FastAPI from backend directory so imports work correctly
CMD ["sh", "-c", "cd backend && uvicorn main:app --host 0.0.0.0 --port 7860"]
