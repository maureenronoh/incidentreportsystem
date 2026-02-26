# Quick APK Generation Checklist ✅

## Before You Start

### 1. Get Your URLs
- **Netlify URL**: `https://your-app.netlify.app` (get from Netlify dashboard)
- **Render URL**: `https://your-backend.onrender.com` (get from Render dashboard)

### 2. Update Production Config

Edit `ireporter-frontend/.env.production`:
```env
REACT_APP_API_URL=https://your-backend.onrender.com/api
```
(Replace with your actual Render URL)

### 3. Push to GitHub
```bash
git add .
git commit -m "Update production API URL"
git push origin main
```

### 4. Wait for Netlify Deploy
- Go to Netlify dashboard
- Wait for deploy to finish (green checkmark)
- Test your site works

## Generate APK (5 Minutes)

### Step 1: Go to PWABuilder
🔗 https://www.pwabuilder.com/

### Step 2: Enter Your Netlify URL
Paste: `https://your-app.netlify.app`
Click: **Start**

### Step 3: Review Report
- Should show green checks for Manifest and Service Worker
- Click: **Next** or **Package for Stores**

### Step 4: Select Android
- Click the **Android** card
- Choose **Trusted Web Activity (TWA)**

### Step 5: Configure Settings
```
Package ID: com.ireporter.app
App Name: iReporter
Version: 1.0.0
Version Code: 1
Host: (auto-filled with your Netlify URL)
Start URL: /
```

### Step 6: Signing Options
For testing: **None**
For Play Store: **Generate new signing key**

### Step 7: Download
- Click **Download**
- Save the `.zip` file
- Extract to get `app-release-signed.apk`

## Install on Phone

### Enable Installation
1. Settings → Security
2. Enable "Install from Unknown Sources"

### Transfer APK
- Email to yourself, OR
- Upload to Google Drive, OR
- USB transfer

### Install
1. Open APK file on phone
2. Click "Install"
3. Open app
4. Test login, register, and anonymous report

## Done! 🎉

Your React app is now an Android app!

## Next Steps (Optional)

- Publish to Google Play Store ($25 fee)
- Add app icon (replace logo192.png and logo512.png)
- Customize splash screen colors
- Add more PWA features

## Troubleshooting

**APK won't install?**
- Enable Unknown Sources
- Uninstall old version first

**App shows blank screen?**
- Check `.env.production` has correct URL
- Verify Render backend is running
- Check Netlify deployed successfully

**Can't connect to backend?**
- Verify REACT_APP_API_URL in production
- Check Render URL is correct (with /api at end)
- Test backend URL directly in browser

## Support

If you get stuck:
1. Check PWABuilder documentation
2. Verify both Netlify and Render are deployed
3. Test the web version first before generating APK
