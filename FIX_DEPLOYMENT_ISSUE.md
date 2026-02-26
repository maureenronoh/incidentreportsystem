# Fix Deployment Issue - Step by Step

## The Problem
✅ Works locally (localhost)
❌ Doesn't work after deployment (Netlify)

**Root Cause**: Your `.env.production` file has a placeholder URL instead of your actual Render backend URL.

## Solution - 3 Steps

### Step 1: Get Your Render Backend URL

1. Go to your Render dashboard: https://dashboard.render.com
2. Click on your backend service
3. Copy the URL at the top (looks like: `https://your-app-name.onrender.com`)

**Example URLs**:
- `https://ireporter-backend.onrender.com`
- `https://ireporter-api.onrender.com`
- `https://ireporter-backend-xyz.onrender.com`

### Step 2: Update .env.production File

Edit `ireporter-frontend/.env.production` and replace with your actual URL:

```env
REACT_APP_API_URL=https://YOUR-ACTUAL-RENDER-URL.onrender.com/api
```

**Important**:
- Replace `YOUR-ACTUAL-RENDER-URL` with your real Render service name
- Keep `/api` at the end
- Use `https://` not `http://`
- No trailing slash after `/api`

**Example**:
```env
REACT_APP_API_URL=https://ireporter-backend.onrender.com/api
```

### Step 3: Push to GitHub

```bash
git add ireporter-frontend/.env.production
git commit -m "Update production API URL with actual Render backend"
git push origin main
```

Netlify will automatically detect the push and redeploy (takes 2-3 minutes).

## Alternative: Set Environment Variable in Netlify Dashboard

If you don't want to commit the URL to GitHub, you can set it in Netlify:

1. Go to Netlify dashboard: https://app.netlify.com
2. Select your site
3. Go to "Site configuration" → "Environment variables"
4. Click "Add a variable"
5. Add:
   ```
   Key: REACT_APP_API_URL
   Value: https://your-render-url.onrender.com/api
   ```
6. Click "Save"
7. Go to "Deploys" tab
8. Click "Trigger deploy" → "Clear cache and deploy site"

**Note**: Environment variables in Netlify dashboard override `.env.production` file.

## Verify It's Fixed

After Netlify redeploys:

1. Open your Netlify site URL
2. Open browser console (F12)
3. Try to register/login
4. Check the Network tab - the API calls should go to your Render URL, not localhost

### What to Look For:

**Before Fix** (Network tab shows):
```
POST http://localhost:5001/api/users/register  ❌ (fails in production)
```

**After Fix** (Network tab shows):
```
POST https://your-render-url.onrender.com/api/users/register  ✅
```

## Common Issues After Deployment

### Issue 1: CORS Error

**Error in Console**:
```
Access to XMLHttpRequest at 'https://your-render-url.onrender.com/api/users/register' 
from origin 'https://your-netlify-site.netlify.app' has been blocked by CORS policy
```

**Solution**: Update backend CORS configuration

Your backend already has CORS enabled for all origins:
```python
CORS(app, origins="*", supports_credentials=False)
```

But if you still get CORS errors, update to:
```python
CORS(app, origins=["https://your-netlify-site.netlify.app", "http://localhost:3000"], supports_credentials=True)
```

Then push backend changes to GitHub and Render will auto-redeploy.

### Issue 2: Backend Not Running

**Error in Console**:
```
POST https://your-render-url.onrender.com/api/users/register net::ERR_CONNECTION_REFUSED
```

**Solution**: 
1. Go to Render dashboard
2. Check if your backend service is running (should show green "Live")
3. If it's sleeping, click on it to wake it up
4. Free tier Render services sleep after 15 minutes of inactivity

### Issue 3: Wrong MongoDB URI

**Error**: Backend runs but can't connect to database

**Solution**: 
1. Go to Render dashboard
2. Select your backend service
3. Go to "Environment" tab
4. Verify `MONGODB_URI` is set to:
   ```
   mongodb+srv://ireporter:maureenjepkirui@ireporter.t4dc3fn.mongodb.net/ireporter?retryWrites=true&w=majority&appName=ireporter
   ```
5. Click "Save Changes"
6. Render will auto-redeploy

### Issue 4: Environment Variable Not Loading

**Symptom**: Netlify still uses localhost URL after updating .env.production

**Solution**:
1. Clear Netlify cache:
   - Go to Netlify dashboard
   - Deploys tab
   - "Trigger deploy" → "Clear cache and deploy site"

2. Or set environment variable directly in Netlify dashboard (see Alternative method above)

## Quick Checklist

Before testing deployment:

- [ ] Updated `.env.production` with actual Render URL
- [ ] Pushed changes to GitHub
- [ ] Netlify has redeployed (check Deploys tab)
- [ ] Render backend is running (green "Live" status)
- [ ] MongoDB Atlas connection is configured in Render
- [ ] Cleared browser cache (Ctrl+Shift+R)

## Test Deployment

1. Open your Netlify site URL (not localhost)
2. Open browser console (F12)
3. Try to register with a new email
4. Check Network tab - should show requests to Render URL
5. If successful, you'll be logged in and redirected to dashboard

## Still Not Working?

If it still doesn't work after following these steps, check:

1. **Browser Console** - What error do you see?
2. **Network Tab** - What URL is being called? What's the status code?
3. **Render Logs** - Go to Render dashboard → Your service → Logs tab
4. **Netlify Logs** - Go to Netlify dashboard → Your site → Deploys → Click latest deploy → View logs

Tell me what you find and I'll help you fix it!

## Summary

The fix is simple:
1. Get your Render backend URL
2. Update `ireporter-frontend/.env.production` with that URL
3. Push to GitHub
4. Wait for Netlify to redeploy
5. Test on your Netlify site

That's it! 🎉
