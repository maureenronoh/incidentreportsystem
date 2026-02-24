# 📱 Install iReporter on Your Phone - Simple Guide

## 🎯 Quick Steps

### Step 1: Make Sure Everything is Running
Your app is already running! ✅
- Backend: http://localhost:5001
- Frontend: http://localhost:3000
- Network URL: **http://10.0.15.58:3000**

### Step 2: Connect Your Phone
1. Make sure your phone is on the **same WiFi network** as your computer
2. Open your phone's browser (Chrome or Safari)
3. Type this URL: **http://10.0.15.58:3000**

### Step 3: Install as App (PWA)

#### On Android (Chrome):
1. Open http://10.0.15.58:3000 in Chrome
2. Tap the **menu (⋮)** in the top right
3. Tap **"Add to Home screen"** or **"Install app"**
4. Tap **"Install"** or **"Add"**
5. The app icon will appear on your home screen!

#### On iPhone (Safari):
1. Open http://10.0.15.58:3000 in Safari
2. Tap the **Share button** (square with arrow)
3. Scroll down and tap **"Add to Home Screen"**
4. Tap **"Add"**
5. The app icon will appear on your home screen!

## 🔧 If It Doesn't Work

### Problem: "Can't reach this page"

**Solution 1: Allow Firewall Access**
Run this command in PowerShell (as Administrator):
```powershell
New-NetFirewallRule -DisplayName "iReporter App" -Direction Inbound -Protocol TCP -LocalPort 3000 -Action Allow
```

**Solution 2: Check WiFi**
- Make sure both devices are on the same WiFi network
- Check your phone's WiFi settings

**Solution 3: Try on Computer First**
- Open http://10.0.15.58:3000 on your computer's browser
- If it works there, it should work on your phone

## 📲 Using the App

Once installed:
- **Launch** the app from your home screen like any other app
- **Login** with your account or register a new one
- **Report incidents** with photos and location
- **Get notifications** when admins update your reports
- **Works offline** - you can view cached data without internet

## 🌟 Features on Mobile

✅ Touch-friendly interface
✅ Bottom navigation bar
✅ Floating action button for quick reports
✅ Camera access for photos
✅ Location services
✅ Push notifications
✅ Offline support
✅ Fast and responsive

## 🔍 Current Network Info

- Your Computer IP: **10.0.15.58**
- Frontend Port: **3000**
- Backend Port: **5001**
- Mobile URL: **http://10.0.15.58:3000**

## 💡 Pro Tips

1. **Bookmark it**: If you don't want to install, just bookmark the URL
2. **Share with others**: Anyone on your WiFi can access it with the same URL
3. **Keep servers running**: Make sure both backend and frontend are running
4. **Check IP changes**: If you restart your computer, the IP might change

## 🚀 Alternative: Deploy Online

If you want to access the app from anywhere (not just your WiFi), you can deploy it to:
- **Heroku** (free tier available)
- **Vercel** (free for frontend)
- **Railway** (free tier available)
- **Render** (free tier available)

Would you like help deploying it online?

---

**Your Mobile URL: http://10.0.15.58:3000**

Just open this URL on your phone's browser and install it! 🎉
