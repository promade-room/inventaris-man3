@echo off
echo ==========================================
echo Updating Project: inventaris-man3
echo ==========================================
echo.

echo [1/3] Running Git Pull...
git pull
if %ERRORLEVEL% neq 0 (
    echo Error occurred during git pull.
    pause
    exit /b %ERRORLEVEL%
)
echo.

echo [2/3] Installing backend dependencies...
if exist backend\package.json (
    cd backend
    call npm install
    if %ERRORLEVEL% neq 0 (
        echo Error occurred during npm install in backend.
        cd ..
        pause
        exit /b %ERRORLEVEL%
    )
    cd ..
) else (
    echo No package.json found in backend directory.
)
echo.

echo [3/3] Installing frontend dependencies...
if exist frontend\package.json (
    cd frontend
    call npm install
    if %ERRORLEVEL% neq 0 (
        echo Error occurred during npm install in frontend.
        cd ..
        pause
        exit /b %ERRORLEVEL%
    )
    cd ..
) else (
    echo No package.json found in frontend directory.
)
echo.

echo ==========================================
echo Update completed successfully!
echo ==========================================
pause
