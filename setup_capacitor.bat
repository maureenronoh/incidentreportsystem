@echo off
echo ========================================
echo  iReporter - Setup Capacitor for APK
echo ========================================
echo.

echo This will set up Capacitor to build an Android APK file.
echo.
echo Prerequisites:
echo  - Node.js installed (you have this)
echo  - Android Studio installed (you need this)
echo  - Java JDK 11+ installed
echo.
echo Press any key to continue or Ctrl+C to cancel...
pause >nul

cd ireporter-frontend

echo.
echo Step 1: Installing Capacitor...
echo.
call npm install @capacitor/core @capacitor/cli @capacitor/android

echo.
echo Step 2: Building React app...
echo.
call npm run build

echo.
echo Step 3: Initializing Capacitor...
echo.
call npx cap init "iReporter" "com.ireporter.app" --web-dir=build

echo.
echo Step 4: Adding Android platform...
echo.
call npx cap add android

echo.
echo Step 5: Syncing files...
echo.
call npx cap sync

echo.
echo ========================================
echo  Setup Complete!
echo ========================================
echo.
echo Next steps:
echo  1. Open Android Studio
echo  2. Open the 'android' folder in ireporter-frontend
echo  3. Wait for Gradle sync to complete
echo  4. Click Build -^> Build Bundle(s) / APK(s) -^> Build APK(s)
echo  5. APK will be in: android\app\build\outputs\apk\debug\
echo.
echo To open Android Studio now, run:
echo   npx cap open android
echo.
pause
