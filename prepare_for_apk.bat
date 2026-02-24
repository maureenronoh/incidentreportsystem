@echo off
echo ========================================
echo  Prepare iReporter for APK Build
echo ========================================
echo.

echo This will prepare your app for deployment and APK creation.
echo.
echo You have 3 options:
echo.
echo 1. PWA Builder (Easiest - No Android Studio)
echo    - Deploy online first
echo    - Use PWA Builder to create APK
echo    - Takes 20 minutes
echo.
echo 2. Capacitor (Requires Android Studio)
echo    - Install Capacitor
echo    - Build with Android Studio
echo    - Takes 1 hour
echo.
echo 3. Quick Test (Local WiFi only)
echo    - Build and serve locally
echo    - APK only works on your WiFi
echo    - Takes 10 minutes
echo.

set /p choice="Enter your choice (1, 2, or 3): "

if "%choice%"=="1" goto pwa_builder
if "%choice%"=="2" goto capacitor
if "%choice%"=="3" goto quick_test
goto end

:pwa_builder
echo.
echo ========================================
echo  Option 1: PWA Builder
echo ========================================
echo.
echo Steps to follow:
echo.
echo 1. Deploy backend to Railway (https://railway.app/)
echo 2. Deploy frontend to Vercel (https://vercel.com/)
echo 3. Go to PWA Builder (https://www.pwabuilder.com/)
echo 4. Enter your Vercel URL
echo 5. Generate and download APK
echo.
echo Read DEPLOY_FOR_APK.md for detailed instructions.
echo.
pause
goto end

:capacitor
echo.
echo ========================================
echo  Option 2: Capacitor Setup
echo ========================================
echo.
echo Installing Capacitor...
cd ireporter-frontend
call npm install @capacitor/core @capacitor/cli @capacitor/android
echo.
echo Building React app...
call npm run build
echo.
echo Initializing Capacitor...
call npx cap init "iReporter" "com.ireporter.app" --web-dir=build
echo.
echo Adding Android platform...
call npx cap add android
echo.
echo Syncing files...
call npx cap sync
echo.
echo ========================================
echo  Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Open Android Studio
echo 2. Open the 'android' folder
echo 3. Build APK: Build -^> Build Bundle(s) / APK(s) -^> Build APK(s)
echo 4. APK location: android\app\build\outputs\apk\debug\
echo.
pause
goto end

:quick_test
echo.
echo ========================================
echo  Option 3: Quick Test Build
echo ========================================
echo.
echo Building React app...
cd ireporter-frontend
call npm run build
echo.
echo ========================================
echo  Build Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Serve the build: npx serve -s build -l 3000
echo 2. Go to PWA Builder: https://www.pwabuilder.com/
echo 3. Enter: http://your-ip:3000
echo 4. Generate APK
echo.
echo Note: This APK only works on your WiFi!
echo.
pause
goto end

:end
echo.
echo For detailed instructions, read:
echo - DEPLOY_FOR_APK.md
echo - BUILD_APK_EASY.md
echo - APK_OPTIONS.txt
echo.
pause
