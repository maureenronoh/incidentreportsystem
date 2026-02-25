# iReporter - Incident Reporting System

A web and mobile application for reporting and managing incidents (red flags and interventions).

## Features

- User registration and authentication
- Report incidents (red flags and interventions)
- Anonymous reporting
- Admin dashboard with analytics
- Real-time notifications
- Status tracking (pending, investigating, resolved, rejected)
- Mobile-responsive design

## Tech Stack

**Backend:**
- Python/Flask
- MongoDB
- JWT Authentication
- Flask-CORS

**Frontend:**
- React
- React Router
- Axios
- Context API for state management

## Quick Start

### Prerequisites
- Python 3.11+
- Node.js 16+
- MongoDB (local or Atlas)

### Backend Setup

```bash
# Install dependencies
pip install -r requirements_simple.txt

# Run backend
python backend_complete_simple.py
```

Backend runs on http://localhost:5001

### Frontend Setup

```bash
cd ireporter-frontend

# Install dependencies
npm install

# Run frontend
npm start
```

Frontend runs on http://localhost:3000

### Easy Start (Windows)

Just double-click:
```
START_APP.bat
```

This starts both backend and frontend automatically.

## Deployment

### Backend with ngrok (for testing)

```bash
# Start backend
python backend_complete_simple.py

# Expose with ngrok
ngrok http 5001
```

### Frontend to Netlify

```bash
cd ireporter-frontend
npm run build
```

Drag the `build` folder to https://app.netlify.com/drop

### Generate APK

1. Deploy frontend to Netlify
2. Go to https://www.pwabuilder.com
3. Enter your Netlify URL
4. Download APK for Android

## Environment Variables

**Backend:**
- `MONGODB_URI` - MongoDB connection string (default: localhost)
- `PORT` - Server port (default: 5001)

**Frontend:**
- `REACT_APP_API_URL` - Backend API URL (default: http://localhost:5001/api)

## Project Structure

```
├── backend_complete_simple.py    # Main backend server
├── requirements_simple.txt       # Python dependencies
├── ireporter-frontend/          # React frontend
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   ├── pages/             # Page components
│   │   ├── services/          # API services
│   │   └── context/           # React context
│   └── public/                # Static files
└── docs/                       # Documentation
```

## API Endpoints

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/me` - Get current user

### Incidents
- `GET /api/incidents` - Get all incidents
- `POST /api/incidents` - Create incident
- `GET /api/incidents/:id` - Get incident by ID
- `PUT /api/incidents/:id` - Update incident
- `DELETE /api/incidents/:id` - Delete incident
- `POST /api/incidents/anonymous` - Create anonymous incident
- `GET /api/incidents/stats` - Get incident statistics

### Admin
- `GET /api/admin/users` - Get all users (admin only)
- `PATCH /api/admin/users/:id/role` - Update user role (admin only)

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark notification as read
- `PUT /api/notifications/read-all` - Mark all as read

## License

MIT License

## Contributors

Maureen Ronoh
