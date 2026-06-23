@echo off
echo ==========================================
echo Starting Inventaris MAN 3 Application
echo ==========================================
echo.

:: Check if backend package.json exists
if not exist backend\package.json (
    echo Error: backend/package.json not found!
    pause
    exit /b 1
)

:: Check if frontend package.json exists
if not exist frontend\package.json (
    echo Error: frontend/package.json not found!
    pause
    exit /b 1
)

echo Starting backend server in background...
start /B cmd /c "cd backend && npm run dev"

echo Starting frontend server in foreground...
cd frontend
call npm run dev -- --open

