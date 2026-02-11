# run_mongodb.py - MongoDB version of iReporter Backend
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from pymongo import MongoClient
from bson import ObjectId
import datetime
import os
import bcrypt
import smtplib
import secrets
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

app = Flask(__name__)

# Configure CORS - Allow all origins for development
CORS(app, origins="*", supports_credentials=False)

# JWT configuration
app.config["JWT_SECRET_KEY"] = os.environ.get('JWT_SECRET_KEY', 'your-secret-key-change-this')
jwt = JWTManager(app)

# Email configuration
EMAIL_HOST = os.environ.get('EMAIL_HOST', 'smtp.gmail.com')
EMAIL_PORT = int(os.environ.get('EMAIL_PORT', '587'))
EMAIL_USER = os.environ.get('EMAIL_USER', 'your-email@gmail.com')
EMAIL_PASSWORD = os.environ.get('EMAIL_PASSWORD', 'your-app-password')
EMAIL_FROM = os.environ.get('EMAIL_FROM', 'iReporter <your-email@gmail.com>')

print(f"📧 Email configuration: {EMAIL_USER} via {EMAIL_HOST}:{EMAIL_PORT}")

# MongoDB configuration
MONGO_URI = os.environ.get('MONGO_URI', 'mongodb://localhost:27017/ireporter')
try:
    client = MongoClient(MONGO_URI)
    db = client.ireporter
    users_collection = db.users
    incidents_collection = db.incidents
    
    # Test connection
    client.admin.command('ping')
    print("✅ MongoDB connection successful!")
    
except Exception as e:
    print(f"❌ MongoDB connection failed: {e}")
    print("Make sure MongoDB is running on localhost:27017")
    exit(1)

# Helper functions
def hash_password(password):
    """Hash password using bcrypt"""
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

def check_password(password, hashed):
    """Check password against hash"""
    return bcrypt.checkpw(password.encode('utf-8'), hashed)

def find_user_by_email(email):
    return users_collection.find_one({"email": email})

def find_user_by_id(user_id):
    try:
        if ObjectId.is_valid(user_id):
            return users_collection.find_one({"_id": ObjectId(user_id)})
        else:
            # Fallback for integer IDs from migration
            return users_collection.find_one({"legacy_id": int(user_id)})
    except:
        return None

def find_incident_by_id(incident_id):
    try:
        if ObjectId.is_valid(incident_id):
            return incidents_collection.find_one({"_id": ObjectId(incident_id)})
        else:
            return incidents_collection.find_one({"legacy_id": int(incident_id)})
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

def link_anonymous_incidents_to_user(user_email, user_id):
    """Link anonymous incidents to user when they register/login"""
    try:
        # Find anonymous incidents with matching email
        result = incidents_collection.update_many(
            {
                "reporter_email": user_email.lower(),
                "is_anonymous": True,
                "user_id": None
            },
            {
                "$set": {
                    "user_id": ObjectId(user_id),
                    "is_anonymous": False,
                    "updated_at": datetime.datetime.now()
                }
            }
        )
        
        if result.modified_count > 0:
            print(f"✅ Linked {result.modified_count} anonymous incidents to user {user_email}")
        
        return result.modified_count
        
    except Exception as e:
        print(f"❌ Error linking anonymous incidents: {e}")
        return 0

def send_verification_email(email, verification_token, user_name):
    """Send email verification email"""
    try:
        # Create verification URL
        verification_url = f"http://localhost:3000/verify-email?token={verification_token}"
        
        # Create email content
        subject = "Verify Your iReporter Account"
        
        html_body = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                .content {{ background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }}
                .button {{ display: inline-block; background: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }}
                .footer {{ text-align: center; margin-top: 20px; color: #666; font-size: 14px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🛡️ Welcome to iReporter</h1>
                    <p>Incident Reporting System</p>
                </div>
                <div class="content">
                    <h2>Hello {user_name}!</h2>
                    <p>Thank you for registering with iReporter. To complete your registration and start reporting incidents, please verify your email address.</p>
                    
                    <p><strong>Click the button below to verify your email:</strong></p>
                    
                    <a href="{verification_url}" class="button">✅ Verify Email Address</a>
                    
                    <p>Or copy and paste this link in your browser:</p>
                    <p style="background: #e9ecef; padding: 10px; border-radius: 5px; word-break: break-all;">
                        {verification_url}
                    </p>
                    
                    <p><strong>Important:</strong> This verification link will expire in 24 hours for security reasons.</p>
                    
                    <div class="footer">
                        <p>If you didn't create an account with iReporter, please ignore this email.</p>
                        <p>© 2026 iReporter - Incident Reporting System</p>
                    </div>
                </div>
            </div>
        </body>
        </html>
        """
        
        text_body = f"""
        Welcome to iReporter!
        
        Hello {user_name},
        
        Thank you for registering with iReporter. To complete your registration, please verify your email address by clicking the link below:
        
        {verification_url}
        
        This verification link will expire in 24 hours.
        
        If you didn't create an account with iReporter, please ignore this email.
        
        © 2026 iReporter - Incident Reporting System
        """
        
        # Create message
        msg = MIMEMultipart('alternative')
        msg['Subject'] = subject
        msg['From'] = EMAIL_FROM
        msg['To'] = email
        
        # Add both text and HTML parts
        text_part = MIMEText(text_body, 'plain')
        html_part = MIMEText(html_body, 'html')
        
        msg.attach(text_part)
        msg.attach(html_part)
        
        # Send email
        with smtplib.SMTP(EMAIL_HOST, EMAIL_PORT) as server:
            server.starttls()
            server.login(EMAIL_USER, EMAIL_PASSWORD)
            server.send_message(msg)
        
        print(f"✅ Verification email sent to {email}")
        return True
        
    except Exception as e:
        print(f"❌ Failed to send verification email to {email}: {e}")
        return False

def generate_verification_token():
    """Generate a secure verification token"""
    return secrets.token_urlsafe(32)

# Routes
@app.route('/')
def home():
    user_count = users_collection.count_documents({})
    incident_count = incidents_collection.count_documents({})
    
    return jsonify({
        "message": "iReporter Backend API (MongoDB)",
        "status": "running",
        "version": "2.0.0",
        "database": "MongoDB",
        "stats": {
            "users": user_count,
            "incidents": incident_count
        },
        "endpoints": {
            "health": "/api/health",
            "register": "POST /api/users/register",
            "login": "POST /api/users/login",
            "profile": "GET /api/users/me",
            "incidents": "GET/POST /api/incidents",
            "incident_detail": "GET/PUT/DELETE /api/incidents/:id",
            "help": "GET /api/help",
            "api_docs": "GET /api/help/endpoints",
            "examples": "GET /api/help/examples"
        },
        "documentation": {
            "help": "Visit /api/help for comprehensive API documentation",
            "endpoints": "Visit /api/help/endpoints for endpoint list",
            "examples": "Visit /api/help/examples for usage examples"
        }
    })

@app.route('/api/system/info', methods=['GET'])
def get_system_info():
    """Get system information and statistics"""
    try:
        # Get database stats
        user_count = users_collection.count_documents({})
        incident_count = incidents_collection.count_documents({})
        admin_count = users_collection.count_documents({"is_admin": True})
        
        # Get incident stats by status
        pending_count = incidents_collection.count_documents({"status": "pending"})
        investigating_count = incidents_collection.count_documents({"status": "investigating"})
        resolved_count = incidents_collection.count_documents({"status": "resolved"})
        rejected_count = incidents_collection.count_documents({"status": "rejected"})
        
        # Get incident stats by type
        redflag_count = incidents_collection.count_documents({"type": "redflag"})
        intervention_count = incidents_collection.count_documents({"type": "intervention"})
        
        # Get recent activity (last 7 days)
        from datetime import datetime, timedelta
        week_ago = datetime.now() - timedelta(days=7)
        recent_users = users_collection.count_documents({"created_at": {"$gte": week_ago}})
        recent_incidents = incidents_collection.count_documents({"created_at": {"$gte": week_ago}})
        
        system_info = {
            "system": {
                "name": "iReporter API",
                "version": "2.0.0",
                "database": "MongoDB",
                "status": "operational",
                "uptime": "Running",
                "features": [
                    "User Authentication",
                    "Incident Reporting",
                    "Admin Management",
                    "Role-based Access Control",
                    "API Documentation"
                ]
            },
            "statistics": {
                "users": {
                    "total": user_count,
                    "admins": admin_count,
                    "regular_users": user_count - admin_count,
                    "recent_registrations": recent_users
                },
                "incidents": {
                    "total": incident_count,
                    "recent_reports": recent_incidents,
                    "by_status": {
                        "pending": pending_count,
                        "investigating": investigating_count,
                        "resolved": resolved_count,
                        "rejected": rejected_count
                    },
                    "by_type": {
                        "red_flags": redflag_count,
                        "interventions": intervention_count
                    }
                }
            },
            "api_endpoints": {
                "total_endpoints": 15,
                "public_endpoints": 4,
                "protected_endpoints": 8,
                "admin_only_endpoints": 3
            },
            "documentation": {
                "help_available": True,
                "examples_provided": True,
                "endpoint_documentation": True
            }
        }
        
        return jsonify(system_info), 200
        
    except Exception as e:
        return jsonify({
            "error": "Failed to get system information",
            "details": str(e)
        }), 500

@app.route('/api/health')
def health():
    try:
        # Test MongoDB connection
        client.admin.command('ping')
        user_count = users_collection.count_documents({})
        incident_count = incidents_collection.count_documents({})
        
        return jsonify({
            "status": "healthy",
            "database": "MongoDB",
            "connection": "active",
            "service": "iReporter API",
            "stats": {
                "users": user_count,
                "incidents": incident_count
            }
        })
    except Exception as e:
        return jsonify({
            "status": "unhealthy",
            "database": "MongoDB",
            "connection": "failed",
            "error": str(e)
        }), 500

# User endpoints
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
        
        # Generate verification token
        verification_token = generate_verification_token()
        verification_expires = datetime.datetime.now() + datetime.timedelta(hours=24)
        
        new_user = {
            "name": name,
            "email": email,
            "password": hashed_password,
            "role": "admin" if is_admin else "user",
            "is_admin": is_admin,
            "email_verified": True,  # All users are auto-verified now
            "created_at": datetime.datetime.now(),
            "updated_at": datetime.datetime.now()
        }
        
        result = users_collection.insert_one(new_user)
        
        # Link any anonymous incidents to this user
        linked_count = link_anonymous_incidents_to_user(email, str(result.inserted_id))
        
        # Create response user object
        user_response = {
            "id": str(result.inserted_id),
            "name": name,
            "email": email,
            "role": new_user["role"],
            "is_admin": is_admin,
            "email_verified": new_user["email_verified"],
            "created_at": new_user["created_at"].isoformat()
        }
        
        # Prepare success message
        success_message = "User registered and logged in successfully"
        if linked_count > 0:
            success_message += f". {linked_count} anonymous incident(s) linked to your account"
        
        if is_admin:
            # Auto-login admin user
            access_token = create_access_token(identity=str(result.inserted_id))
            return jsonify({
                "message": "Admin " + success_message.lower(),
                "user": user_response,
                "token": access_token,
                "auto_login": True,
                "linked_incidents": linked_count
            }), 201
        else:
            # Auto-login regular users too (no email verification needed)
            access_token = create_access_token(identity=str(result.inserted_id))
            return jsonify({
                "message": success_message,
                "user": user_response,
                "token": access_token,
                "auto_login": True,
                "linked_incidents": linked_count
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
        
        # Email verification removed - all users can login directly
        
        # Link any anonymous incidents to this user
        linked_count = link_anonymous_incidents_to_user(user['email'], str(user['_id']))
        
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
        
        # Prepare success message
        success_message = "Login successful"
        if linked_count > 0:
            success_message += f". {linked_count} anonymous incident(s) linked to your account"
        
        return jsonify({
            "message": success_message,
            "user": user_response,
            "token": access_token,
            "linked_incidents": linked_count
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

# Incident endpoints
@app.route('/api/incidents/anonymous', methods=['POST', 'OPTIONS'])
def create_anonymous_incident():
    """Create incident without authentication - for anonymous reporting"""
    if request.method == 'OPTIONS':
        return '', 200
    
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
        reporter_email = data.get('reporter_email', '').strip()  # Optional email for linking later
        reporter_name = data.get('reporter_name', '').strip()    # Optional name
        
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
            "user_id": None,  # No user ID for anonymous reports
            "reporter_email": reporter_email.lower() if reporter_email else None,
            "reporter_name": reporter_name if reporter_name else "Anonymous",
            "is_anonymous": True,
            "media_url": None,
            "created_at": datetime.datetime.now(),
            "updated_at": datetime.datetime.now()
        }
        
        result = incidents_collection.insert_one(new_incident)
        
        # Return the created incident
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
            "incident": created_incident,
            "note": "To track this incident's progress, please register/login with the email you provided (if any)"
        }), 201
        
    except Exception as e:
        print(f"Anonymous incident creation error: {e}")
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
                "media_url": None,  # TODO: Handle file uploads
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

@app.route('/api/incidents/<incident_id>', methods=['GET', 'PUT', 'DELETE', 'OPTIONS'])
@jwt_required()
def incident_detail(incident_id):
    if request.method == 'OPTIONS':
        return '', 200
    
    current_user_id = get_jwt_identity()
    current_user = find_user_by_id(current_user_id)
    
    if not current_user:
        return jsonify({"error": "User not found"}), 404
    
    incident = find_incident_by_id(incident_id)
    
    if not incident:
        return jsonify({"error": "Incident not found"}), 404
    
    if request.method == 'GET':
        try:
            incident_dict = serialize_doc(incident)
            
            # Get user name
            incident_user = find_user_by_id(str(incident.get('user_id', '')))
            incident_dict['user_name'] = incident_user['name'] if incident_user else 'Unknown'
            
            return jsonify(incident_dict), 200
            
        except Exception as e:
            print(f"Get incident error: {e}")
            return jsonify({"error": str(e)}), 500
    
    elif request.method == 'PUT':
        # Check if user can edit (owner or admin)
        if str(incident['user_id']) != current_user_id and not current_user.get('is_admin', False):
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
        if str(incident['user_id']) != current_user_id and not current_user.get('is_admin', False):
            return jsonify({"error": "Permission denied"}), 403
        
        try:
            incidents_collection.delete_one({"_id": incident['_id']})
            return jsonify({"message": "Incident deleted successfully"}), 200
            
        except Exception as e:
            print(f"Delete incident error: {e}")
            return jsonify({"error": str(e)}), 500

@app.route('/api/incidents/<incident_id>/status', methods=['PATCH', 'OPTIONS'])
@jwt_required()
def update_incident_status(incident_id):
    if request.method == 'OPTIONS':
        return '', 200
    
    current_user_id = get_jwt_identity()
    current_user = find_user_by_id(current_user_id)
    
    if not current_user:
        return jsonify({"error": "User not found"}), 404
    
    # Only admins can update status
    if not current_user.get('is_admin', False):
        return jsonify({"error": "Admin access required"}), 403
    
    incident = find_incident_by_id(incident_id)
    
    if not incident:
        return jsonify({"error": "Incident not found"}), 404
    
    try:
        data = request.get_json()
        
        if not data or 'status' not in data:
            return jsonify({"error": "Status is required"}), 400
        
        new_status = data['status'].strip().lower()
        
        if new_status not in ['pending', 'investigating', 'resolved', 'rejected']:
            return jsonify({"error": "Invalid status"}), 400
        
        incidents_collection.update_one(
            {"_id": incident['_id']},
            {"$set": {
                "status": new_status,
                "updated_at": datetime.datetime.now()
            }}
        )
        
        # Get updated incident
        updated_incident = incidents_collection.find_one({"_id": incident['_id']})
        incident_dict = serialize_doc(updated_incident)
        
        return jsonify({
            "message": "Status updated successfully",
            "incident": incident_dict
        }), 200
        
    except Exception as e:
        print(f"Update status error: {e}")
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

# Admin endpoints
@app.route('/api/admin/users', methods=['GET'])
@jwt_required()
def admin_get_users():
    current_user_id = get_jwt_identity()
    current_user = find_user_by_id(current_user_id)
    
    if not current_user or not current_user.get('is_admin', False):
        return jsonify({"error": "Admin access required"}), 403
    
    try:
        users_cursor = users_collection.find().sort("created_at", 1)
        users_list = []
        
        for user in users_cursor:
            user_dict = serialize_doc(user)
            if 'password' in user_dict:
                del user_dict['password']
            users_list.append(user_dict)
        
        return jsonify(users_list), 200
        
    except Exception as e:
        print(f"Get users error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/admin/users/<user_id>/role', methods=['PATCH'])
@jwt_required()
def admin_update_user_role(user_id):
    current_user_id = get_jwt_identity()
    current_user = find_user_by_id(current_user_id)
    
    if not current_user or not current_user.get('is_admin', False):
        return jsonify({"error": "Admin access required"}), 403
    
    target_user = find_user_by_id(user_id)
    if not target_user:
        return jsonify({"error": "User not found"}), 404
    
    try:
        data = request.get_json()
        new_role = data.get('role', '').strip().lower()
        
        if new_role not in ['user', 'admin']:
            return jsonify({"error": "Role must be 'user' or 'admin'"}), 400
        
        users_collection.update_one(
            {"_id": target_user['_id']},
            {"$set": {
                "role": new_role,
                "is_admin": (new_role == 'admin'),
                "updated_at": datetime.datetime.now()
            }}
        )
        
        # Get updated user
        updated_user = users_collection.find_one({"_id": target_user['_id']})
        user_dict = serialize_doc(updated_user)
        if 'password' in user_dict:
            del user_dict['password']
        
        return jsonify({
            "message": f"User role updated to {new_role}",
            "user": user_dict
        }), 200
        
    except Exception as e:
        print(f"Update user role error: {e}")
        return jsonify({"error": str(e)}), 500

# Debug endpoint
@app.route('/api/debug', methods=['GET'])
def debug():
    try:
        users_cursor = users_collection.find()
        incidents_cursor = incidents_collection.find()
        
        users_list = []
        for user in users_cursor:
            user_dict = {
                "id": str(user['_id']),
                "name": user['name'],
                "email": user['email'],
                "role": user.get('role', 'user'),
                "is_admin": user.get('is_admin', False)
            }
            users_list.append(user_dict)
        
        incidents_list = []
        for incident in incidents_cursor:
            incident_dict = serialize_doc(incident)
            incidents_list.append(incident_dict)
        
        return jsonify({
            "users": users_list,
            "incidents": incidents_list,
            "database": "MongoDB",
            "collections": {
                "users": users_collection.count_documents({}),
                "incidents": incidents_collection.count_documents({})
            }
        }), 200
        
    except Exception as e:
        print(f"Debug error: {e}")
        return jsonify({"error": str(e)}), 500

# Help and Documentation endpoints
@app.route('/api/help', methods=['GET'])
def get_help():
    """Get comprehensive help documentation"""
    help_data = {
        "title": "iReporter API Help & Documentation",
        "version": "2.0.0",
        "description": "Comprehensive guide for using the iReporter incident reporting system",
        "base_url": "http://localhost:5000/api",
        "sections": {
            "getting_started": {
                "title": "Getting Started",
                "description": "Basic information for new users",
                "content": [
                    "iReporter is a platform for reporting incidents like corruption and infrastructure issues",
                    "Register for an account to start reporting incidents",
                    "Two types of incidents: Red Flags (corruption) and Interventions (infrastructure)",
                    "Track your reports from submission to resolution"
                ]
            },
            "authentication": {
                "title": "Authentication",
                "description": "How to register, login, and manage your account",
                "endpoints": [
                    {
                        "method": "POST",
                        "endpoint": "/api/users/register",
                        "description": "Register a new user account",
                        "required_fields": ["name", "email", "password"],
                        "example": {
                            "name": "John Doe",
                            "email": "john@example.com",
                            "password": "securepassword123"
                        }
                    },
                    {
                        "method": "POST",
                        "endpoint": "/api/users/login",
                        "description": "Login to your account",
                        "required_fields": ["email", "password"],
                        "example": {
                            "email": "john@example.com",
                            "password": "securepassword123"
                        }
                    },
                    {
                        "method": "GET",
                        "endpoint": "/api/users/me",
                        "description": "Get current user information",
                        "requires_auth": True
                    }
                ]
            },
            "incidents": {
                "title": "Incident Management",
                "description": "How to create, view, and manage incident reports",
                "types": {
                    "redflag": "Corruption, bribery, embezzlement, or misconduct",
                    "intervention": "Infrastructure problems, public service issues"
                },
                "statuses": {
                    "pending": "Report submitted, waiting for review",
                    "investigating": "Administrators are looking into the issue",
                    "resolved": "Issue has been addressed and closed",
                    "rejected": "Report couldn't be processed"
                },
                "endpoints": [
                    {
                        "method": "GET",
                        "endpoint": "/api/incidents",
                        "description": "Get all incidents (filtered by user role)",
                        "requires_auth": True
                    },
                    {
                        "method": "POST",
                        "endpoint": "/api/incidents",
                        "description": "Create a new incident report",
                        "requires_auth": True,
                        "required_fields": ["title", "description", "type", "location"],
                        "example": {
                            "title": "Pothole on Main Street",
                            "description": "Large pothole causing traffic issues",
                            "type": "intervention",
                            "location": "Main Street, Downtown"
                        }
                    },
                    {
                        "method": "GET",
                        "endpoint": "/api/incidents/{id}",
                        "description": "Get specific incident details",
                        "requires_auth": True
                    },
                    {
                        "method": "PUT",
                        "endpoint": "/api/incidents/{id}",
                        "description": "Update incident (owner or admin only)",
                        "requires_auth": True
                    },
                    {
                        "method": "DELETE",
                        "endpoint": "/api/incidents/{id}",
                        "description": "Delete incident (owner or admin only)",
                        "requires_auth": True
                    },
                    {
                        "method": "PATCH",
                        "endpoint": "/api/incidents/{id}/status",
                        "description": "Update incident status (admin only)",
                        "requires_auth": True,
                        "admin_only": True
                    }
                ]
            },
            "admin": {
                "title": "Admin Features",
                "description": "Administrative functions for system management",
                "requirements": "Admin role required for all admin endpoints",
                "endpoints": [
                    {
                        "method": "GET",
                        "endpoint": "/api/admin/users",
                        "description": "Get all users in the system",
                        "requires_auth": True,
                        "admin_only": True
                    },
                    {
                        "method": "PATCH",
                        "endpoint": "/api/admin/users/{id}/role",
                        "description": "Update user role",
                        "requires_auth": True,
                        "admin_only": True,
                        "example": {"role": "admin"}
                    }
                ]
            }
        },
        "error_codes": {
            "400": "Bad Request - Invalid input data",
            "401": "Unauthorized - Invalid credentials or missing token",
            "403": "Forbidden - Insufficient permissions",
            "404": "Not Found - Resource doesn't exist",
            "500": "Internal Server Error - Server-side error"
        },
        "best_practices": [
            "Always include Authorization header with Bearer token for protected endpoints",
            "Use HTTPS in production for secure data transmission",
            "Validate input data before sending requests",
            "Handle error responses appropriately in your application",
            "Store JWT tokens securely (not in localStorage for production)",
            "Implement proper error handling and user feedback"
        ]
    }
    
    return jsonify(help_data), 200

@app.route('/api/help/endpoints', methods=['GET'])
def get_api_endpoints():
    """Get list of all available API endpoints"""
    endpoints = {
        "authentication": [
            {"method": "POST", "path": "/api/users/register", "description": "Register new user"},
            {"method": "POST", "path": "/api/users/login", "description": "User login"},
            {"method": "GET", "path": "/api/users/me", "description": "Get current user", "auth": True}
        ],
        "incidents": [
            {"method": "GET", "path": "/api/incidents", "description": "Get all incidents", "auth": True},
            {"method": "POST", "path": "/api/incidents", "description": "Create incident", "auth": True},
            {"method": "GET", "path": "/api/incidents/{id}", "description": "Get incident by ID", "auth": True},
            {"method": "PUT", "path": "/api/incidents/{id}", "description": "Update incident", "auth": True},
            {"method": "DELETE", "path": "/api/incidents/{id}", "description": "Delete incident", "auth": True},
            {"method": "PATCH", "path": "/api/incidents/{id}/status", "description": "Update status", "auth": True, "admin": True},
            {"method": "GET", "path": "/api/incidents/stats", "description": "Get statistics", "auth": True}
        ],
        "admin": [
            {"method": "GET", "path": "/api/admin/users", "description": "Get all users", "auth": True, "admin": True},
            {"method": "PATCH", "path": "/api/admin/users/{id}/role", "description": "Update user role", "auth": True, "admin": True}
        ],
        "email": [
            {"method": "POST", "path": "/api/users/verify-email", "description": "Verify email"},
            {"method": "POST", "path": "/api/users/resend-verification", "description": "Resend verification"}
        ],
        "system": [
            {"method": "GET", "path": "/api/health", "description": "System health check"},
            {"method": "GET", "path": "/api/debug", "description": "Debug information"},
            {"method": "GET", "path": "/api/system/info", "description": "System information"},
            {"method": "GET", "path": "/api/help", "description": "API documentation"},
            {"method": "GET", "path": "/api/help/endpoints", "description": "List all endpoints"},
            {"method": "GET", "path": "/api/help/examples", "description": "Usage examples"}
        ]
    }
    
    return jsonify(endpoints), 200

@app.route('/api/help/examples', methods=['GET'])
def get_api_examples():
    """Get practical API usage examples"""
    examples = {
        "user_registration_flow": {
            "description": "Complete user registration and login flow",
            "steps": [
                {
                    "step": 1,
                    "action": "Register User",
                    "method": "POST",
                    "url": "http://localhost:5000/api/users/register",
                    "headers": {"Content-Type": "application/json"},
                    "body": {
                        "name": "Jane Smith",
                        "email": "jane@example.com",
                        "password": "securepass123"
                    },
                    "curl": 'curl -X POST http://localhost:5000/api/users/register -H "Content-Type: application/json" -d \'{"name":"Jane Smith","email":"jane@example.com","password":"securepass123"}\''
                },
                {
                    "step": 2,
                    "action": "Login User",
                    "method": "POST",
                    "url": "http://localhost:5000/api/users/login",
                    "headers": {"Content-Type": "application/json"},
                    "body": {
                        "email": "jane@example.com",
                        "password": "securepass123"
                    },
                    "curl": 'curl -X POST http://localhost:5000/api/users/login -H "Content-Type: application/json" -d \'{"email":"jane@example.com","password":"securepass123"}\''
                }
            ]
        },
        "incident_management_flow": {
            "description": "Creating and managing incident reports",
            "steps": [
                {
                    "step": 1,
                    "action": "Create Incident",
                    "method": "POST",
                    "url": "http://localhost:5000/api/incidents",
                    "headers": {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer YOUR_JWT_TOKEN"
                    },
                    "body": {
                        "title": "Broken Street Light",
                        "description": "Street light on Oak Avenue has been out for 3 days",
                        "type": "intervention",
                        "location": "Oak Avenue, Block 5"
                    },
                    "curl": 'curl -X POST http://localhost:5000/api/incidents -H "Content-Type: application/json" -H "Authorization: Bearer YOUR_TOKEN" -d \'{"title":"Broken Street Light","description":"Street light issue","type":"intervention","location":"Oak Avenue"}\''
                },
                {
                    "step": 2,
                    "action": "Get All Incidents",
                    "method": "GET",
                    "url": "http://localhost:5000/api/incidents",
                    "headers": {"Authorization": "Bearer YOUR_JWT_TOKEN"},
                    "curl": 'curl -X GET http://localhost:5000/api/incidents -H "Authorization: Bearer YOUR_TOKEN"'
                }
            ]
        }
    }
    
    return jsonify(examples), 200

if __name__ == '__main__':
    print("🚀 Starting iReporter Backend API (MongoDB)")
    print("📡 API running on: http://localhost:5000")
    print("🍃 Database: MongoDB")
    print("📊 Connection: mongodb://localhost:27017/ireporter")
    print("✅ Registration endpoint: POST http://localhost:5000/api/users/register")
    print("✅ Login endpoint: POST http://localhost:5000/api/users/login")
    print("✅ Incidents endpoint: GET/POST http://localhost:5000/api/incidents")
    print("🔍 Debug endpoint: GET http://localhost:5000/api/debug")
    print("📚 Help endpoint: GET http://localhost:5000/api/help")
    print("📋 API endpoints: GET http://localhost:5000/api/help/endpoints")
    print("💡 Examples: GET http://localhost:5000/api/help/examples")
    app.run(debug=False, port=5000, host='0.0.0.0')