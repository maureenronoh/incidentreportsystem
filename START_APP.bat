@echo off
echo ========================================
echo  Starting iReporter Application
echo ========================================
echo.

echo Starting Backend...
start cmd /k "python backend_complete_simple.py"

timeout /t 3 >nul

echo Starting Frontend...
start cmd /k "cd ireporter-frontend && npm start"

echo.
echo ========================================
echo  Application Starting!
echo ========================================
echo.
echo Backend:  http://localhost:5001
echo Frontend: http://localhost:3000
echo.
echo Two terminal windows will open.
echo Wait for both to finish loading.
echo Then open: http://localhost:3000
echo.
pause
