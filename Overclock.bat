@echo off
title OVERCLOCK - Tactical Cyberpunk Arena
cd /d "%~dp0"

echo ======================================================================
echo    OVERCLOCK // HIGH-OCTANE CYBERPUNK LAN ARENA // V3.0
echo ======================================================================
echo.

where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
  echo [ERROR] Node.js is not installed or not in PATH!
  echo Please install Node.js from https://nodejs.org/ to host Overclock.
  echo.
  pause
  exit /b 1
)

echo [✓] Node.js runtime detected.
echo [✓] Launching browser to http://localhost:3000 ...
echo [✓] Classmates can connect using your local Wi-Fi IP on port 3000!
echo.

:: Open default browser
start "" "http://localhost:3000"

:: Start Node server
node server\server.js
