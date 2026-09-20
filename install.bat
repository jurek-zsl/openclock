@echo off
title OVERCLOCK Installer
cd /d "%~dp0"
echo ======================================================================
echo    OVERCLOCK // LAUNCHING AUTOMATED INSTALLER...
echo ======================================================================
powershell -ExecutionPolicy Bypass -NoProfile -Command "if (Test-Path '%~dp0install.ps1') { & '%~dp0install.ps1' } else { irm https://raw.githubusercontent.com/jurek-zsl/openclock/main/install.ps1 | iex }"
pause
