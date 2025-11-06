@echo off
echo ========================================
echo   AcadMark - Quick Deployment Helper
echo ========================================
echo.

echo This script will help you prepare for deployment.
echo.

echo Step 1: Initialize Git Repository
echo ----------------------------------
git init
if %errorlevel% neq 0 (
    echo Git initialization failed. Make sure Git is installed.
    pause
    exit /b 1
)
echo Git initialized successfully!
echo.

echo Step 2: Create .gitignore
echo -------------------------
if not exist .gitignore (
    echo .gitignore already created
) else (
    echo .gitignore found
)
echo.

echo Step 3: Add all files
echo ---------------------
git add .
echo Files added to git
echo.

echo Step 4: Create initial commit
echo -----------------------------
git commit -m "Initial commit - AcadMark v1.0"
echo Commit created!
echo.

echo ========================================
echo   Deployment Ready!
echo ========================================
echo.
echo Next steps:
echo.
echo 1. Create a GitHub repository at: https://github.com/new
echo    Name: acadmark-attendance
echo.
echo 2. Run these commands to push:
echo    git remote add origin https://github.com/YOUR_USERNAME/acadmark-attendance.git
echo    git branch -M main
echo    git push -u origin main
echo.
echo 3. Choose a hosting platform:
echo    - Render (Recommended): https://render.com
echo    - Railway: https://railway.app
echo    - Heroku: https://heroku.com
echo.
echo 4. Follow the DEPLOYMENT_CHECKLIST.md for detailed steps
echo.
echo ========================================
pause
