# Debugging Login/Register/Anonymous Report Issues

## Quick Test Results ✅

I just tested your backend directly and ALL endpoints work perfectly:
- ✅ Registration: Working
- ✅ Login: Working  
- ✅ Anonymous Report: Working
- ✅ MongoDB Atlas: Connected

**This means the issue is in the frontend, not the backend.**

## Step 1: Check Browser Console

1. Open your app: http://localhost:3000
2. Press F12 to open Developer Tools
3. Go to "Console" tab
4. Try to register/login
5. Look for RED error messages

### Common Errors You Might See:

**Error 1: Network Error / CORS Error**
```
Access to XMLHttpRequest at 'http://localhost:5001/api/users/register' 
from origin 'http://localhost:3000' has been blocked by CORS policy
```
**Solution**: Backend CORS is already configured, but restart both servers

**Error 2: 404 Not Found**
```
POST http://localhost:5001/api/users/register 404 (Not Found)
```
**Solution**: Backend not running or wrong URL

**Error 3: Connection Refused**
```
POST http://localhost:5001/api/users/register net::ERR_CONNECTION_REFUSED
```
**Solution**: Backend server is not running

**Error 4: Undefined API URL**
```
POST http://localhost:undefined/api/users/register
```
**Solution**: Environment variable not loaded

## Step 2: Check Network Tab

1. In Developer Tools, go to "Network" tab
2. Try to register/login
3. Look for the API request
4. Click on it to see details

### What to Check:

**Request URL**: Should be `http://localhost:5001/api/users/register`
- If it's different, the .env file is not being read

**Status Code**: 
- 200/201 = Success (but frontend might not be handling response correctly)
- 400 = Bad request (check what you're sending)
- 401 = Unauthorized (wrong credentials)
- 404 = Endpoint not found (backend not running)
- 500 = Server error (check backend console)

**Request Payload**: Should show your form data
**Response**: Should show user data and token

## Step 3: Verify Environment Variables

Open a NEW terminal and run:

```bash
cd ireporter-frontend
npm start
```

Look for this line in the startup output:
```
REACT_APP_API_URL=http://localhost:5001/api
```

If you DON'T see it, the .env file is not being read.

### Fix: Restart Frontend

1. Stop the frontend (Ctrl+C in terminal)
2. Make sure `.env` file exists in `ireporter-frontend/` folder
3. Start again: `npm start`

## Step 4: Check .env File

Verify `ireporter-frontend/.env` contains:
```env
DISABLE_ESLINT_PLUGIN=true
REACT_APP_API_URL=http://localhost:5001/api
```

**Important**: 
- No quotes around the URL
- No trailing slash after `/api`
- Must start with `REACT_APP_`

## Step 5: Test API Directly in Browser

Open these URLs in your browser:

1. **Backend Health Check**:
   ```
   http://localhost:5001/
   ```
   Should show: `{"status": "running", ...}`

2. **Test Registration with Postman/Thunder Client**:
   ```
   POST http://localhost:5001/api/users/register
   Content-Type: application/json
   
   {
     "name": "Test User",
     "email": "test2@example.com",
     "password": "test123"
   }
   ```

## Step 6: Clear Browser Cache

Sometimes old code is cached:

1. Open Developer Tools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"
4. Try again

## Step 7: Check for JavaScript Errors

In Console tab, look for:
- Syntax errors in your code
- Undefined variables
- Import errors

## Step 8: Verify Both Servers Are Running

Run this command:
```bash
netstat -ano | findstr ":5001 :3000"
```

You should see:
```
TCP    0.0.0.0:3000    ...    LISTENING
TCP    0.0.0.0:5001    ...    LISTENING
```

If not, restart using `START_APP.bat`

## Step 9: Test with Simple HTML

Create a test file `test.html` in your project root:

```html
<!DOCTYPE html>
<html>
<head>
    <title>API Test</title>
</head>
<body>
    <h1>API Test</h1>
    <button onclick="testRegister()">Test Register</button>
    <button onclick="testLogin()">Test Login</button>
    <button onclick="testAnonymous()">Test Anonymous</button>
    <div id="result"></div>

    <script>
        async function testRegister() {
            try {
                const response = await fetch('http://localhost:5001/api/users/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: 'Test User',
                        email: 'test' + Date.now() + '@example.com',
                        password: 'test123'
                    })
                });
                const data = await response.json();
                document.getElementById('result').innerHTML = 
                    '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
            } catch (error) {
                document.getElementById('result').innerHTML = 
                    '<pre style="color:red">' + error.message + '</pre>';
            }
        }

        async function testLogin() {
            try {
                const response = await fetch('http://localhost:5001/api/users/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: 'test@example.com',
                        password: 'test123'
                    })
                });
                const data = await response.json();
                document.getElementById('result').innerHTML = 
                    '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
            } catch (error) {
                document.getElementById('result').innerHTML = 
                    '<pre style="color:red">' + error.message + '</pre>';
            }
        }

        async function testAnonymous() {
            try {
                const response = await fetch('http://localhost:5001/api/incidents/anonymous', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        title: 'Test Incident',
                        description: 'Test description',
                        type: 'redflag',
                        location: 'Test Location'
                    })
                });
                const data = await response.json();
                document.getElementById('result').innerHTML = 
                    '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
            } catch (error) {
                document.getElementById('result').innerHTML = 
                    '<pre style="color:red">' + error.message + '</pre>';
            }
        }
    </script>
</body>
</html>
```

Open `test.html` in your browser and click the buttons. If these work, the backend is fine and the issue is in your React app.

## Most Likely Issues

Based on your symptoms, the most likely causes are:

1. **Frontend not reading .env file** - Restart frontend server
2. **Browser cache** - Hard refresh (Ctrl+Shift+R)
3. **CORS issue** - Restart both servers
4. **Wrong API URL** - Check console for actual URL being called
5. **Form validation** - Check if form is actually submitting

## What to Tell Me

After checking the above, please tell me:

1. What do you see in the browser Console? (copy the error)
2. What do you see in the Network tab? (status code, URL)
3. Does the test.html file work?
4. Are both servers running? (run netstat command)
5. What happens when you click Register/Login? (any error message?)

This will help me pinpoint the exact issue!
