#!/usr/bin/env python3
"""
Complete simple backend for iReporter with all dashboard endpoints
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from pymongo import MongoClient
from bson import ObjectId
import datetime
import bcrypt

app = Flask(__name__)

# Configure CORS
CORS(app, origins="*", supports_credentials=False)

# JWT configuration
app.config["JWT_SECRET_KEY"] = 'test-secret-key'
jwt = JWTManager(app)

# MongoDB configuration
try:
    client = MongoClient('mongodb://localhost:27017/ireporter')
    db = client.ireporter
    users_collection = db.users
    incidents_collection = db.incidents
    notifications_collection = db.notifications
    
    # Test connection
    client.admin.command('ping')
    print("✅ MongoDB connection successful!")
    
except Exception as e:
    print(f"❌ MongoDB connection failed: {e}")
    exit(1)

def hash_password(password):
    """Hash password using bcrypt"""
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

def check_password(password, hashed):
    """Check password against hash"""
    return bcrypt.checkpw(password.encode('utf-8'), hashed)

def find_user_by_email(email):
    """Find user by email"""
    return users_collection.find_one({"email": email.lower()})

def find_user_by_id(user_id):
    """Find user by ID"""
    try:
        if ObjectId.is_valid(user_id):
            return users_collection.find_one({"_id": ObjectId(user_id)})
        else:
            # Fallback for integer IDs from migration
            return users_collection.find_one({"legacy_id": int(user_id)})
    except:
        return None

def serialize_doc(doc):
    """Convert MongoDB document to JSON serializable format"""
    if doc is None:
        return None
    
    # Create a copy to avoid modifying the original
    doc = dict(doc)
    
    if '_id' in doc:
        doc['id'] = str(doc['_id'])
        del doc['_id']
    
    # Convert all ObjectId and datetime objects
    for key, value in doc.items():
        if isinstance(value, ObjectId):
            doc[key] = str(value)
        elif isinstance(value, datetime.datetime):
            doc[key] = value.isoformat()
    
    return doc

def create_notification(user_id, incident_id, message, notification_type='status_update'):
    """Create a notification for a user"""
    try:
        notification = {
            'user_id': user_id,
            'incident_id': incident_id,
            'message': message,
            'type': notification_type,
            'read': False,
            'created_at': datetime.datetime.now()
        }
        result = notifications_collection.insert_one(notification)
        print(f"✅ Notification created for user {user_id}: {message}")
        return result.inserted_id
    except Exception as e:
        print(f"❌ Error creating notification: {e}")
        return None

@app.route('/')
def home():
    return jsonify({
        "message": "iReporter Backend API (Complete Simple)",
        "status": "running",
        "endpoints": {
            "register": "POST /api/users/register",
            "login": "POST /api/users/login",
            "incidents": "GET /api/incidents",
            "anonymous": "POST /api/incidents/anonymous"
        }
    })

@app.route('/api/users/register', methods=['POST', 'OPTIONS'])
def register():
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        email = data.get('email', '').strip().lower()
        password = data.get('password', '').strip()
        name = data.get('name', '').strip()
        
        if not email or not password or not name:
            return jsonify({"error": "Name, email and password are required"}), 400
        
        if find_user_by_email(email):
            return jsonify({"error": "User already exists"}), 400
        
        # First user is admin
        user_count = users_collection.count_documents({})
        is_admin = user_count == 0
        
        # Hash password
        hashed_password = hash_password(password)
        
        new_user = {
            "name": name,
            "email": email,
            "password": hashed_password,
            "role": "admin" if is_admin else "user",
            "is_admin": is_admin,
            "email_verified": True,
            "created_at": datetime.datetime.now(),
            "updated_at": datetime.datetime.now()
        }
        
        result = users_collection.insert_one(new_user)
        
        # Create response user object
        user_response = {
            "id": str(result.inserted_id),
            "name": name,
            "email": email,
            "role": new_user["role"],
            "is_admin": is_admin,
            "email_verified": True,
            "created_at": new_user["created_at"].isoformat()
        }
        
        # Auto-login user
        access_token = create_access_token(identity=str(result.inserted_id))
        return jsonify({
            "message": "User registered and logged in successfully",
            "user": user_response,
            "token": access_token,
            "auto_login": True
        }), 201
        
    except Exception as e:
        print(f"Registration error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/users/login', methods=['POST', 'OPTIONS'])
def login():
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        email = data.get('email', '').strip().lower()
        password = data.get('password', '').strip()
        
        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400
        
        user = find_user_by_email(email)
        
        if not user:
            return jsonify({"error": "Invalid credentials"}), 401
        
        # Check password
        if not check_password(password, user['password']):
            return jsonify({"error": "Invalid credentials"}), 401
        
        access_token = create_access_token(identity=str(user['_id']))
        
        user_response = {
            "id": str(user['_id']),
            "name": user['name'],
            "email": user['email'],
            "role": user.get('role', 'user'),
            "is_admin": user.get('is_admin', False),
            "email_verified": user.get('email_verified', False),
            "created_at": user['created_at'].isoformat() if isinstance(user['created_at'], datetime.datetime) else user['created_at']
        }
        
        return jsonify({
            "message": "Login successful",
            "user": user_response,
            "token": access_token
        }), 200
        
    except Exception as e:
        print(f"Login error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/users/me', methods=['GET'])
@jwt_required()
def get_current_user():
    try:
        current_user_id = get_jwt_identity()
        user = find_user_by_id(current_user_id)
        
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        user_response = serialize_doc(user.copy())
        if 'password' in user_response:
            del user_response['password']
        
        return jsonify(user_response), 200
        
    except Exception as e:
        print(f"Get current user error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/incidents', methods=['GET', 'POST', 'OPTIONS'])
@jwt_required()
def incidents():
    if request.method == 'OPTIONS':
        return '', 200
    
    current_user_id = get_jwt_identity()
    current_user = find_user_by_id(current_user_id)
    
    if not current_user:
        return jsonify({"error": "User not found"}), 404
    
    if request.method == 'GET':
        try:
            # Get all incidents with user names
            incidents_cursor = incidents_collection.find().sort("created_at", -1)
            incidents_list = []
            
            for incident in incidents_cursor:
                incident_dict = serialize_doc(incident)
                
                # Handle user name for both authenticated and anonymous incidents
                if incident.get('user_id'):
                    incident_user = find_user_by_id(str(incident.get('user_id')))
                    incident_dict['user_name'] = incident_user['name'] if incident_user else 'Unknown'
                    incident_dict['is_anonymous'] = incident.get('is_anonymous', False)
                else:
                    # Anonymous incident
                    incident_dict['user_name'] = incident.get('reporter_name', 'Anonymous')
                    incident_dict['is_anonymous'] = True
                
                incidents_list.append(incident_dict)
            
            return jsonify(incidents_list), 200
            
        except Exception as e:
            print(f"Get incidents error: {e}")
            return jsonify({"error": str(e)}), 500
    
    elif request.method == 'POST':
        try:
            # Handle both JSON and form data
            if request.is_json:
                data = request.get_json()
            else:
                data = request.form.to_dict()
            
            if not data:
                return jsonify({"error": "No data provided"}), 400
            
            title = data.get('title', '').strip()
            description = data.get('description', '').strip()
            incident_type = data.get('type', '').strip()
            location = data.get('location', '').strip()
            
            if not all([title, description, incident_type, location]):
                return jsonify({"error": "Title, description, type, and location are required"}), 400
            
            if incident_type not in ['redflag', 'intervention']:
                return jsonify({"error": "Type must be 'redflag' or 'intervention'"}), 400
            
            new_incident = {
                "title": title,
                "description": description,
                "type": incident_type,
                "location": location,
                "status": "pending",
                "user_id": ObjectId(current_user_id),
                "media_url": None,
                "created_at": datetime.datetime.now(),
                "updated_at": datetime.datetime.now()
            }
            
            result = incidents_collection.insert_one(new_incident)
            
            # Return the created incident with proper serialization
            created_incident = {
                "id": str(result.inserted_id),
                "title": title,
                "description": description,
                "type": incident_type,
                "location": location,
                "status": "pending",
                "user_id": current_user_id,
                "media_url": None,
                "created_at": new_incident["created_at"].isoformat(),
                "updated_at": new_incident["updated_at"].isoformat(),
                "user_name": current_user['name']
            }
            
            return jsonify({
                "message": "Incident created successfully",
                "incident": created_incident
            }), 201
            
        except Exception as e:
            print(f"Create incident error: {e}")
            return jsonify({"error": str(e)}), 500

@app.route('/api/incidents/anonymous', methods=['POST', 'OPTIONS'])
def create_anonymous_incident():
    """Create incident without authentication"""
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        title = data.get('title', '').strip()
        description = data.get('description', '').strip()
        incident_type = data.get('type', '').strip()
        location = data.get('location', '').strip()
        reporter_email = data.get('reporter_email', '').strip()
        reporter_name = data.get('reporter_name', '').strip()
        
        if not all([title, description, incident_type, location]):
            return jsonify({"error": "Title, description, type, and location are required"}), 400
        
        if incident_type not in ['redflag', 'intervention']:
            return jsonify({"error": "Type must be 'redflag' or 'intervention'"}), 400
        
        new_incident = {
            "title": title,
            "description": description,
            "type": incident_type,
            "location": location,
            "status": "pending",
            "user_id": None,
            "reporter_email": reporter_email.lower() if reporter_email else None,
            "reporter_name": reporter_name if reporter_name else "Anonymous",
            "is_anonymous": True,
            "media_url": None,
            "created_at": datetime.datetime.now(),
            "updated_at": datetime.datetime.now()
        }
        
        result = incidents_collection.insert_one(new_incident)
        
        created_incident = {
            "id": str(result.inserted_id),
            "title": title,
            "description": description,
            "type": incident_type,
            "location": location,
            "status": "pending",
            "reporter_name": new_incident["reporter_name"],
            "is_anonymous": True,
            "media_url": None,
            "created_at": new_incident["created_at"].isoformat(),
            "updated_at": new_incident["updated_at"].isoformat()
        }
        
        return jsonify({
            "message": "Anonymous incident reported successfully",
            "incident": created_incident
        }), 201
        
    except Exception as e:
        print(f"Anonymous incident creation error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/incidents/stats', methods=['GET'])
@jwt_required()
def incident_stats():
    try:
        total = incidents_collection.count_documents({})
        pending = incidents_collection.count_documents({"status": "pending"})
        investigating = incidents_collection.count_documents({"status": "investigating"})
        resolved = incidents_collection.count_documents({"status": "resolved"})
        rejected = incidents_collection.count_documents({"status": "rejected"})
        redflags = incidents_collection.count_documents({"type": "redflag"})
        interventions = incidents_collection.count_documents({"type": "intervention"})
        
        stats = {
            "total": total,
            "pending": pending,
            "investigating": investigating,
            "resolved": resolved,
            "rejected": rejected,
            "redflags": redflags,
            "interventions": interventions
        }
        
        return jsonify(stats), 200
        
    except Exception as e:
        print(f"Get stats error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/incidents/<incident_id>', methods=['GET', 'PUT', 'DELETE', 'OPTIONS'])
@jwt_required()
def incident_detail(incident_id):
    if request.method == 'OPTIONS':
        return '', 200
    
    current_user_id = get_jwt_identity()
    current_user = find_user_by_id(current_user_id)
    
    if not current_user:
        return jsonify({"error": "User not found"}), 404
    
    try:
        if ObjectId.is_valid(incident_id):
            incident = incidents_collection.find_one({"_id": ObjectId(incident_id)})
        else:
            incident = incidents_collection.find_one({"legacy_id": int(incident_id)})
    except:
        incident = None
    
    if not incident:
        return jsonify({"error": "Incident not found"}), 404
    
    if request.method == 'GET':
        try:
            incident_dict = serialize_doc(incident)
            
            # Get user name
            if incident.get('user_id'):
                incident_user = find_user_by_id(str(incident.get('user_id')))
                incident_dict['user_name'] = incident_user['name'] if incident_user else 'Unknown'
            else:
                incident_dict['user_name'] = incident.get('reporter_name', 'Anonymous')
            
            return jsonify(incident_dict), 200
            
        except Exception as e:
            print(f"Get incident error: {e}")
            return jsonify({"error": str(e)}), 500
    
    elif request.method == 'PUT':
        # Check if user can edit (owner or admin)
        if str(incident.get('user_id', '')) != current_user_id and not current_user.get('is_admin', False):
            return jsonify({"error": "Permission denied"}), 403
        
        try:
            if request.is_json:
                data = request.get_json()
            else:
                data = request.form.to_dict()
            
            if not data:
                return jsonify({"error": "No data provided"}), 400
            
            # Update incident fields
            update_fields = {}
            if 'title' in data:
                update_fields['title'] = data['title'].strip()
            if 'description' in data:
                update_fields['description'] = data['description'].strip()
            if 'type' in data and data['type'] in ['redflag', 'intervention']:
                update_fields['type'] = data['type']
            if 'location' in data:
                update_fields['location'] = data['location'].strip()
            
            # Admin can update status
            old_status = incident.get('status', 'pending')
            if 'status' in data and current_user.get('is_admin', False):
                if data['status'] in ['pending', 'investigating', 'resolved', 'rejected']:
                    update_fields['status'] = data['status']
                    
                    # Create notification for incident owner if status changed
                    if data['status'] != old_status and incident.get('user_id'):
                        status_messages = {
                            'investigating': f"Your incident '{incident.get('title', 'Untitled')}' is now under investigation.",
                            'resolved': f"Your incident '{incident.get('title', 'Untitled')}' has been resolved!",
                            'rejected': f"Your incident '{incident.get('title', 'Untitled')}' has been reviewed and rejected."
                        }
                        if data['status'] in status_messages:
                            create_notification(
                                str(incident.get('user_id')),
                                str(incident['_id']),
                                status_messages[data['status']],
                                'status_update'
                            )
            
            update_fields['updated_at'] = datetime.datetime.now()
            
            incidents_collection.update_one(
                {"_id": incident['_id']},
                {"$set": update_fields}
            )
            
            # Get updated incident
            updated_incident = incidents_collection.find_one({"_id": incident['_id']})
            incident_dict = serialize_doc(updated_incident)
            
            return jsonify({
                "message": "Incident updated successfully",
                "incident": incident_dict
            }), 200
            
        except Exception as e:
            print(f"Update incident error: {e}")
            return jsonify({"error": str(e)}), 500
    
    elif request.method == 'DELETE':
        # Check if user can delete (owner or admin)
        if str(incident.get('user_id', '')) != current_user_id and not current_user.get('is_admin', False):
            return jsonify({"error": "Permission denied"}), 403
        
        try:
            incidents_collection.delete_one({"_id": incident['_id']})
            return jsonify({"message": "Incident deleted successfully"}), 200
            
        except Exception as e:
            print(f"Delete incident error: {e}")
            return jsonify({"error": str(e)}), 500

# Notification endpoints
@app.route('/api/notifications', methods=['GET'])
@jwt_required()
def get_notifications():
    """Get all notifications for the current user"""
    try:
        current_user_id = get_jwt_identity()
        
        # Get all notifications for this user, sorted by newest first
        notifications = list(notifications_collection.find(
            {"user_id": current_user_id}
        ).sort("created_at", -1))
        
        notifications_list = [serialize_doc(notif) for notif in notifications]
        
        # Count unread notifications
        unread_count = notifications_collection.count_documents({
            "user_id": current_user_id,
            "read": False
        })
        
        return jsonify({
            "notifications": notifications_list,
            "unread_count": unread_count
        }), 200
        
    except Exception as e:
        print(f"Get notifications error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/notifications/<notification_id>/read', methods=['PUT'])
@jwt_required()
def mark_notification_read(notification_id):
    """Mark a notification as read"""
    try:
        current_user_id = get_jwt_identity()
        
        if not ObjectId.is_valid(notification_id):
            return jsonify({"error": "Invalid notification ID"}), 400
        
        # Find notification
        notification = notifications_collection.find_one({
            "_id": ObjectId(notification_id),
            "user_id": current_user_id
        })
        
        if not notification:
            return jsonify({"error": "Notification not found"}), 404
        
        # Mark as read
        notifications_collection.update_one(
            {"_id": ObjectId(notification_id)},
            {"$set": {"read": True}}
        )
        
        return jsonify({"message": "Notification marked as read"}), 200
        
    except Exception as e:
        print(f"Mark notification read error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/notifications/read-all', methods=['PUT'])
@jwt_required()
def mark_all_notifications_read():
    """Mark all notifications as read for the current user"""
    try:
        current_user_id = get_jwt_identity()
        
        result = notifications_collection.update_many(
            {"user_id": current_user_id, "read": False},
            {"$set": {"read": True}}
        )
        
        return jsonify({
            "message": "All notifications marked as read",
            "count": result.modified_count
        }), 200
        
    except Exception as e:
        print(f"Mark all notifications read error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("🚀 Starting Complete Simple iReporter Backend...")
    print("📡 API running on: http://localhost:5001")
    print("✅ Registration: POST http://localhost:5001/api/users/register")
    print("✅ Login: POST http://localhost:5001/api/users/login")
    print("✅ Incidents: GET/POST http://localhost:5001/api/incidents")
    print("✅ Anonymous Report: POST http://localhost:5001/api/incidents/anonymous")
    print("✅ Incident Stats: GET http://localhost:5001/api/incidents/stats")
    print("🔔 Notifications: GET http://localhost:5001/api/notifications")
    print("🔔 Mark Read: PUT http://localhost:5001/api/notifications/<id>/read")
    print("🔔 Mark All Read: PUT http://localhost:5001/api/notifications/read-all")
    app.run(debug=False, port=5001, host='0.0.0.0')