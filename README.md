# iReporter - Incident Reporting System

A modern web application for reporting and managing corruption incidents and public service issues. Built with React (frontend) and Flask (backend) with MongoDB database.

## 🌟 Features

### For Users
- **Report Incidents**: Submit detailed reports with categories for Red Flags (corruption) and Interventions (public services)
- **Track Status**: Monitor your incident reports in real-time
- **Notifications**: Get notified when admins update your incident status
- **Anonymous Reporting**: Report incidents without creating an account
- **Mobile Responsive**: Fully optimized for mobile devices

### For Administrators
- **Dashboard Analytics**: Comprehensive incident analysis with charts and statistics
- **User Management**: Manage user roles and permissions
- **Status Updates**: Update incident statuses (pending, investigating, resolved, rejected)
- **Notification System**: Automatic notifications sent to users on status changes

## 🎨 Design
- Modern dark blue gradient theme
- Clean, intuitive user interface
- Responsive design for all devices
- Interactive notifications bell

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 14+
- MongoDB 4.4+

### Backend Setup

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/ireporter.git
cd ireporter
```

2. **Create virtual environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**
```bash
pip install -r requirements_simple.txt
```

4. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

5. **Start MongoDB**
```bash
# Make sure MongoDB is running on localhost:27017
mongod
```

6. **Run the backend**
```bash
python backend_complete_simple.py
```

Backend will be available at: `http://localhost:5001`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd ireporter-frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm start
```

Frontend will be available at: `http://localhost:3000`

## 📱 Mobile Access

To access from your phone on the same network:

1. Find your computer's IP address:
   - Windows: `ipconfig`
   - Mac/Linux: `ifconfig`

2. On your phone, navigate to:
   - `http://YOUR_IP_ADDRESS:3000`

## 📋 Incident Categories

### Red Flags (Corruption)
- 💰 Bribery
- 💼 Embezzlement
- 🎭 Fraud
- 👔 Abuse of Office
- 👨‍👩‍👧 Nepotism
- ⚖️ Conflict of Interest
- 🚩 Other Corruption

### Interventions (Public Services)
- 🛣️ Road Infrastructure
- 💧 Water Supply
- ⚡ Electricity
- 🗑️ Waste Management
- 🚌 Public Transport
- 🏥 Healthcare
- 🎓 Education
- 🚨 Security
- 🔧 Other Services

## 🔐 Default Admin Account

First registered user automatically becomes admin.

## 🛠️ Technology Stack

### Backend
- **Framework**: Flask
- **Database**: MongoDB
- **Authentication**: JWT (Flask-JWT-Extended)
- **Password Hashing**: bcrypt
- **CORS**: Flask-CORS

### Frontend
- **Framework**: React 19
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Notifications**: React Toastify
- **Styling**: Inline styles with dark blue theme

## 📁 Project Structure

```
ireporter/
├── backend_complete_simple.py    # Main backend application
├── requirements_simple.txt       # Python dependencies
├── run_mongodb.py               # MongoDB helper script
├── .env.example                 # Environment variables template
├── ireporter-frontend/          # React frontend
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   ├── pages/              # Page components
│   │   ├── services/           # API services
│   │   └── context/            # React context
│   └── public/                 # Static assets
├── restapi/                    # API modules
│   ├── controllers/           # Business logic
│   ├── models/                # Database models
│   ├── views/                 # API endpoints
│   └── utilities/             # Helper functions
└── docs/                      # Documentation
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login
- `GET /api/users` - Get all users (admin only)

### Incident Endpoints
- `GET /api/incidents` - Get all incidents
- `POST /api/incidents` - Create new incident
- `GET /api/incidents/<id>` - Get specific incident
- `PUT /api/incidents/<id>` - Update incident
- `DELETE /api/incidents/<id>` - Delete incident
- `POST /api/incidents/anonymous` - Anonymous report

### Notification Endpoints
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/<id>/read` - Mark as read
- `PUT /api/notifications/read-all` - Mark all as read

## 🔔 Notification System

Users receive automatic notifications when:
- Admin changes incident status to "investigating"
- Admin marks incident as "resolved"
- Admin rejects an incident

Notifications appear in the bell icon (top-right corner) with unread count badge.

## 📊 Admin Analytics

Administrators have access to:
- Total incidents count
- Status distribution (pending, investigating, resolved, rejected)
- Incident type breakdown (red flags vs interventions)
- Recent activity feed
- Monthly trend analysis

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Check the [Help page](docs/) in the application
- email (maureenjepkirui25@gmail.com)

## 🎯 Roadmap

- [ ] Email notifications
- [ ] File upload for evidence
- [ ] Geographic mapping of incidents
- [ ] Advanced search and filters
- [ ] Export reports to PDF/CSV
- [ ] Multi-language support
- [ ] Real-time updates with WebSockets

## 👥 Author

Maureen Ronoh

## 🙏 Acknowledgments

- Built for transparency and accountability
- Inspired by the need for better civic engagement
- Thanks to all contributors

---

**Made with ❤️ for a better community**
