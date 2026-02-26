# Deployment Steps for Render & Netlify

## What Changed
Fixed AnonymousReport.jsx to use the API service (which respects environment variables) instead of hardcoded localhost URL.

## Step 1: Update Production Environment File

Before deploying, update `ireporter-frontend/.env.production` with your actual Render backend URL:

```env
REACT_APP_API_URL=https://your-backend-name.onrender.com/api
```

Replace `your-backend-name` with your actual Render service name.

## Step 2: Render (Backend) Configuration

Your backend is already configured correctly. Just verify these environment variables in Render dashboard:

1. Go to your Render dashboard: https://dashboard.render.com
2. Select your backend service
3. Go to "Environment" tab
4. Verify these variables exist:

```
MONGODB_URI=mongodb+srv://ireporter:maureenjepkirui@ireporter.t4dc3fn.mongodb.net/ireporter?retryWrites=true&w=majority&appName=ireporter
JWT_SECRET_KEY=your-secret-key-change-this-in-production
PORT=5001
```

5. Click "Save Changes" if you made any updates
6. Render will automatically redeploy

## Step 3: Netlify (Frontend) Configuration

### Option A: Update .env.production and Push

1. Update `ireporter-frontend/.env.production` with your Render URL
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Fix anonymous report API and update production URL"
   git push origin main
   ```
3. Netlify will automatically detect the push and redeploy

### Option B: Set Environment Variable in Netlify Dashboard

1. Go to Netlify dashboard: https://app.netlify.com
2. Select your site
3. Go to "Site configuration" → "Environment variables"
4. Add or update:
   ```
   Key: REACT_APP_API_URL
   Value: https://your-backend-name.onrender.com/api
   ```
5. Click "Save"
6. Go to "Deploys" tab and click "Trigger deploy" → "Clear cache and deploy site"

## Step 4: Verify Deployment

After both deploy:

1. Open your Netlify site URL
2. Try these features:
   - Register a new user
   - Login
   - Report an anonymous incident (this was broken before)
3. Check browser console (F12) for any errors

## Important Notes

- The `.env.production` file is used during the build process on Netlify
- Environment variables set in Netlify dashboard override `.env.production`
- Always use HTTPS URLs in production (not HTTP)
- The backend URL should NOT have a trailing slash

## Troubleshooting

If anonymous reporting still doesn't work:

1. Check browser console for errors
2. Verify the API URL in Network tab (F12 → Network)
3. Make sure Render backend is running (visit the URL directly)
4. Check CORS is enabled on backend (already configured in your code)
