# iReporter API Documentation

Complete API reference for the iReporter backend.

## Base URL
```
http://localhost:5001/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### Authentication

#### Register User
```http
POST /users/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** `201 Created`
```json
{
  "message": "User registered successfully",
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "is_admin": false
  }
}
```

#### Login
```http
POST /users/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** `200 OK`
```json
{
  "message": "Login successful",
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "is_admin": false
  }
}
```

### Incidents

#### Get All Incidents
```http
GET /incidents
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "incidents": [
    {
      "id": "507f1f77bcf86cd799439011",
      "title": "Pothole on Main Street",
      "description": "Large pothole causing traffic issues",
      "type": "intervention",
      "category": "road_infrastructure",
      "location": "Main Street, City Center",
      "status": "pending",
      "user_id": "507f1f77bcf86cd799439012",
      "created_at": "2024-02-11T10:30:00Z",
      "updated_at": "2024-02-11T10:30:00Z"
    }
  ]
}
```

#### Create Incident
```http
POST /incidents
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Pothole on Main Street",
  "description": "Large pothole causing traffic issues",
  "type": "intervention",
  "category": "road_infrastructure",
  "location": "Main Street, City Center"
}
```

**Response:** `201 Created`
```json
{
  "message": "Incident created successfully",
  "incident": {
    "id": "507f1f77bcf86cd799439011",
    "title": "Pothole on Main Street",
    "description": "Large pothole causing traffic issues",
    "type": "intervention",
    "category": "road_infrastructure",
    "location": "Main Street, City Center",
    "status": "pending",
    "user_id": "507f1f77bcf86cd799439012",
    "created_at": "2024-02-11T10:30:00Z"
  }
}
```

#### Get Single Incident
```http
GET /incidents/:id
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "incident": {
    "id": "507f1f77bcf86cd799439011",
    "title": "Pothole on Main Street",
    "description": "Large pothole causing traffic issues",
    "type": "intervention",
    "category": "road_infrastructure",
    "location": "Main Street, City Center",
    "status": "pending",
    "user_id": "507f1f77bcf86cd799439012",
    "created_at": "2024-02-11T10:30:00Z",
    "updated_at": "2024-02-11T10:30:00Z"
  }
}
```

#### Update Incident
```http
PUT /incidents/:id
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "status": "investigating"
}
```

**Note:** Only admins can update the `status` field.

**Response:** `200 OK`
```json
{
  "message": "Incident updated successfully",
  "incident": {
    "id": "507f1f77bcf86cd799439011",
    "title": "Updated Title",
    "description": "Updated description",
    "status": "investigating",
    "updated_at": "2024-02-11T11:00:00Z"
  }
}
```

#### Delete Incident
```http
DELETE /incidents/:id
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "message": "Incident deleted successfully"
}
```

#### Anonymous Report
```http
POST /incidents/anonymous
```

**Request Body:**
```json
{
  "title": "Anonymous Report",
  "description": "Description of the incident",
  "type": "redflag",
  "category": "bribery",
  "location": "Location details"
}
```

**Response:** `201 Created`
```json
{
  "message": "Anonymous report submitted successfully",
  "incident": {
    "id": "507f1f77bcf86cd799439011",
    "title": "Anonymous Report",
    "status": "pending"
  }
}
```

### Notifications

#### Get User Notifications
```http
GET /notifications
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "notifications": [
    {
      "id": "507f1f77bcf86cd799439011",
      "user_id": "507f1f77bcf86cd799439012",
      "incident_id": "507f1f77bcf86cd799439013",
      "message": "Your incident 'Pothole' has been resolved!",
      "type": "status_update",
      "read": false,
      "created_at": "2024-02-11T12:00:00Z"
    }
  ],
  "unread_count": 3
}
```

#### Mark Notification as Read
```http
PUT /notifications/:id/read
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "message": "Notification marked as read"
}
```

#### Mark All Notifications as Read
```http
PUT /notifications/read-all
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "message": "All notifications marked as read",
  "count": 5
}
```

### Users (Admin Only)

#### Get All Users
```http
GET /users
Authorization: Bearer <admin_token>
```

**Response:** `200 OK`
```json
{
  "users": [
    {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "is_admin": false,
      "created_at": "2024-02-10T10:00:00Z"
    }
  ]
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid request data"
}
```

### 401 Unauthorized
```json
{
  "error": "Authentication required"
}
```

### 403 Forbidden
```json
{
  "error": "Permission denied"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

## Rate Limiting

Currently no rate limiting is implemented. Consider adding rate limiting for production use.

## CORS

CORS is enabled for all origins in development. Configure appropriately for production.

## Data Models

### User
```python
{
  "name": str,
  "email": str,
  "password": str (hashed),
  "is_admin": bool,
  "created_at": datetime
}
```

### Incident
```python
{
  "title": str,
  "description": str,
  "type": str,  # 'redflag' or 'intervention'
  "category": str,
  "location": str,
  "status": str,  # 'pending', 'investigating', 'resolved', 'rejected'
  "user_id": str,
  "created_at": datetime,
  "updated_at": datetime
}
```

### Notification
```python
{
  "user_id": str,
  "incident_id": str,
  "message": str,
  "type": str,
  "read": bool,
  "created_at": datetime
}
```
