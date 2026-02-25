@echo off
REM This script starts the backend and ngrok automatically

cd /d "%~dp0"

REM Start backend in background
start /min "iReporter Backend" cmd /c "python backend_complete_simple.py"

REM Wait 5 seconds for backend to start
timeout /t 5 /nobreak >nul

REM Start ngrok in background
start /min "iReporter Ngrok" cmd /c "ngrok.exe http 5001"

echo iReporter backend and ngrok started!
echo Backend: http://localhost:5001
echo Check ngrok dashboard: http://localhost:4040
