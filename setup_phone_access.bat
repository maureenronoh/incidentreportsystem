@echo off
echo ========================================
echo  iReporter - Setup Phone Access
echo ========================================
echo.

echo Step 1: Adding Windows Firewall Rule...
echo.
powershell -Command "Start-Process powershell -ArgumentList '-NoProfile -ExecutionPolicy Bypass -Command \"New-NetFirewallRule -DisplayName ''iReporter App'' -Direction Inbound -Protocol TCP -LocalPort 3000 -Action Allow -ErrorAction SilentlyContinue\"' -Verb RunAs"

timeout /t 3 >nul

echo.
echo Step 2: Getting your IP address...
echo.
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr "IPv4"') do (
    set IP=%%a
    set IP=!IP: =!
    echo Your IP Address: !IP!
    echo.
    echo ========================================
    echo  OPEN THIS URL ON YOUR PHONE:
    echo  http://!IP!:3000
    echo ========================================
    echo.
)

echo.
echo Step 3: Instructions
echo.
echo 1. Make sure your phone is on the SAME WiFi network
echo 2. Open your phone's browser (Chrome or Safari)
echo 3. Type the URL shown above
echo 4. Tap "Add to Home Screen" to install the app
echo.
echo Press any key to open the URL in your browser to test...
pause >nul

start http://10.0.15.58:3000

echo.
echo If the page opens in your browser, it should work on your phone too!
echo.
pause
