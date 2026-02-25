@echo off
echo Starting iReporter Application...
echo.
echo Starting Backend Server...
start "Backend Server" cmd /k "python backend_complete_simple.py"
timeout /t 3 /nobreak >nul
echo.
echo Starting Frontend Server...
start "Frontend Server" cmd /k "cd ireporter-frontend && npm start"
echo.
echo Both servers are starting!
echo Backend: http://localhost:5001
echo Frontend: http://localhost:3000
echo.
echo Press any key to exit this window (servers will keep running)...
pause >nul
