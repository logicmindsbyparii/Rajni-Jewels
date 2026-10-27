@echo off
setlocal
cd /d "%~dp0"
echo ==========================================
echo          LUXORA JEWELRY WEBSITE
echo ==========================================
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js was not found. Please install Node.js LTS from https://nodejs.org/ and reopen this file.
  pause
  exit /b 1
)
if not exist node_modules (
  echo Installing project dependencies. This may take a few minutes...
  call npm install
  if errorlevel 1 (
    echo Dependency installation failed. Check your internet connection and try again.
    pause
    exit /b 1
  )
)
echo Starting LUXORA at http://localhost:5173
echo Keep this window open while using the website.
call npm run dev -- --host 127.0.0.1
pause
