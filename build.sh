#!/usr/bin/env bash
# Build script for Render deployment
# This script installs all dependencies and builds the React frontend

set -o errexit  # Exit on error

echo "=== Installing Python dependencies ==="
pip install -r requirements.txt

# Download spaCy English model (small)
echo "=== Downloading spaCy model ==="
python -m spacy download en_core_web_sm || echo "spaCy model download skipped (optional)"

echo "=== Installing Node.js and building frontend ==="
# Install Node.js dependencies and build
cd frontend
npm install
npm run build
cd ..

# Move the built frontend to where FastAPI can serve it
echo "=== Moving frontend build to backend/static ==="
rm -rf backend/static
cp -r frontend/dist backend/static

echo "=== Build complete ==="
