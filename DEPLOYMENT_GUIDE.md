# Deployment Guide

## Option 1: Local with ngrok (Fastest)

### Step 1: Start Backend
```bash
python backend_complete_simple.py
```

### Step 2: Expose with ngrok
```bash
ngrok http 5001
```

Copy the ngrok URL (e.g., `https://abc123.ngrok-free.dev`)

### Step 3: Build Frontend
```bash
cd ireporter-frontend
npm run build
```

### Step 4: Deploy to Netlify
- Go to https://app.netlify.com/drop
- Drag the `build` folder
- Add environment variable: `REACT_APP_API_URL` = your ngrok URL + `/api`

### Step 5: Generate APK
- Go to https://www.pwabuilder.com
- Enter your Netlify URL
- Download APK

---

## Option 2: Full Cloud Deployment

### Backend to Railway

1. Sign up at https://railway.app
2. Create new project from GitHub
3. Add environment variables:
   - `MONGODB_URI` - Your MongoDB Atlas connection string
   - `PORT` - 5001
4. Deploy

### Frontend to Netlify

1. Build: `npm run build`
2. Deploy to https://app.netlify.com/drop
3. Add environment variable: `REACT_APP_API_URL` = Railway backend URL + `/api`

### Generate APK

Same as Option 1, Step 5

---

## Auto-Start on Windows

To start backend and ngrok automatically:

1. Double-click `auto_start_backend.bat`

OR

2. Add to Windows Startup:
   - Press Windows + R
   - Type: `shell:startup`
   - Copy `auto_start_backend.bat` to this folder
