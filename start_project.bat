@echo off
echo ==============================================================
echo Starting Digital Footprint Analyzer (Backend + Frontend)
echo ==============================================================

echo [1/2] Starting FastAPI Backend on port 8000...
start "Digital Footprint Analyzer - Backend" cmd /k "cd /d "%~dp0backend" && "C:\Users\Dell\AppData\Local\Python\bin\python.exe" -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload"

timeout /t 2 >nul

echo [2/2] Starting Vite Frontend on port 5173...
start "Digital Footprint Analyzer - Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev -- --host 0.0.0.0 --port 5173"

echo.
echo ==============================================================
echo Digital Footprint Analyzer is launching!
echo Frontend: http://localhost:5173
echo Backend API Docs: http://localhost:8000/docs
echo ==============================================================
pause
