#!/usr/bin/env bash
# Build script for Render deployment

set -o errexit

echo "=== Installing Python dependencies ==="
pip install --no-cache-dir -r requirements.txt

echo "=== Downloading spaCy model ==="
python -m spacy download en_core_web_sm || echo "spaCy model skipped"

echo "=== Building frontend ==="
cd frontend
npm install
npm run build
cd ..

echo "=== Copying frontend build ==="
rm -rf backend/static
cp -r frontend/dist backend/static

echo "=== Build complete ==="
