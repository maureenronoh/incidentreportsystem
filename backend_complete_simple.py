#!/usr/bin/env python3
"""
iReporter Backend - PostgreSQL version
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_sqlalchemy import SQLAlchemy
import datetime
import bcrypt
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

CORS(app,
     origins="*",
     allow_headers=["Content-Type", "Authorization"],
     methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
     supports_credentials=False)

app.config["JWT_SECRET_KEY"] = os.environ.get('JWT_SECRET_KEY', 'ireporter-secret-2024')
jwt = JWTManager(app)

# PostgreSQL configuration
DATABASE_URL = os.environ.get('DATABASE_URL', 'postgresql+pg8000://localhost/ireporter')
# Render provides postgres:// — fix scheme and force pg8000 driver
DATABASE_URL = DATABASE_URL.replace('postgres://', 'postgresql://', 1)
if DATABASE_URL.startswith('postgresql://') and '+' not in DATABASE_URL.split('://')[0]:
    DATABASE_URL = DATABASE_URL.replace('postgresql://', 'postgresql+pg8000://', 1)

app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# ── Models ────────────────────────────────────────────────────────────────────

class User(db.Model):
    __tablename__ = 'users'
    id            = db.Column(db.Integer, primary_key=True)
    name          = db.Column(db.String(200), nullable=False)
    email         = db.Column(db.String(200), unique=True, nullable=False)
    password      = db.Column(db.LargeBinary, nullable=False)
    role          = db.Column(db.String(20), default='user')
    is_admin      = db.Column(db.Boolean, default=False)
    email_verified = db.Column(db.Boolean, default=True)
    created_at    = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    updated_at    = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    incidents     = db.relationship('Incident', backref='owner', lazy=True,
                                    foreign_keys='Incident.user_id')
    notifications = db.relationship('Notification', backref='recipient', lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "role": self.role,
            "is_admin": self.is_admin,
            "email_verified": self.email_verified,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


class Incident(db.Model):
    __tablename__ = 'incidents'
    id             = db.Column(db.Integer, primary_key=True)
    title          = db.Column(db.String(300), nullable=False)
    description    = db.Column(db.Text, nullable=False)
    type           = db.Column(db.String(20), nullable=False)   # redflag | intervention
    location       = db.Column(db.String(300), nullable=False)
    status         = db.Column(db.String(20), default='pending')
    user_id        = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    reporter_name  = db.Column(db.String(200))
    reporter_email = db.Column(db.String(200))
    is_anonymous   = db.Column(db.Boolean, default=False)
    media_url      = db.Column(db.String(500))
    created_at     = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    updated_at     = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    def to_dict(self, user_name=None):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "type": self.type,
            "location": self.location,
            "status": self.status,
            "user_id": self.user_id,
            "reporter_name": self.reporter_name,
            "reporter_email": self.reporter_email,
            "is_anonymous": self.is_anonymous,
            "media_url": self.media_url,
            "user_name": user_name or (self.owner.name if self.owner else self.reporter_name or 'Anonymous'),
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }


class Notification(db.Model):
    __tablename__ = 'notifications'
    id          = db.Column(db.Integer, primary_key=True)
    user_id     = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    incident_id = db.Column(db.Integer)
    message     = db.Column(db.Text, nullable=False)
    type        = db.Column(db.String(50), default='status_update')
    read        = db.Column(db.Boolean, default=False)
    created_at  = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "incident_id": self.incident_id,
            "message": self.message,
            "type": self.type,
            "read": self.read,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


# ── Helpers ───────────────────────────────────────────────────────────────────

def hash_password(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

def check_password(password, hashed):
    if isinstance(hashed, str):
        hashed = hashed.encode('utf-8')
    return bcrypt.checkpw(password.encode('utf-8'), hashed)

def create_notification(user_id, incident_id, message, notification_type='status_update'):
    try:
        notif = Notification(
            user_id=int(user_id),
            incident_id=int(incident_id) if incident_id else None,
            message=message,
            type=notification_type
        )
        db.session.add(notif)
        db.session.commit()
        print(f"✅ Notification created for user {user_id}: {message}")
    except Exception as e:
        db.session.rollback()
        print(f"❌ Error creating notification: {e}")


# ── Routes ────────────────────────────────────────────────────────────────────

@app.route('/')
def home():
    return jsonify({
        "message": "iReporter Backend API (PostgreSQL)",
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

        email    = data.get('email', '').strip().lower()
        password = data.get('password', '').strip()
        name     = data.get('name', '').strip()

        if not email or not password or not name:
            return jsonify({"error": "Name, email and password are required"}), 400

        if User.query.filter_by(email=email).first():
            return jsonify({"error": "User already exists"}), 400

        is_admin = User.query.count() == 0

        user = User(
            name=name,
            email=email,
            password=hash_password(password),
            role='admin' if is_admin else 'user',
            is_admin=is_admin
        )
        db.session.add(user)
        db.session.commit()

        token = create_access_token(identity=str(user.id))
        return jsonify({
            "message": "User registered and logged in successfully",
            "user": user.to_dict(),
            "token": token,
            "auto_login": True
        }), 201

    except Exception as e:
        db.session.rollback()
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

        email    = data.get('email', '').strip().lower()
        password = data.get('password', '').strip()

        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400

        user = User.query.filter_by(email=email).first()
        if not user or not check_password(password, user.password):
            return jsonify({"error": "Invalid credentials"}), 401

        token = create_access_token(identity=str(user.id))
        return jsonify({
            "message": "Login successful",
            "user": user.to_dict(),
            "token": token
        }), 200

    except Exception as e:
        print(f"Login error: {e}")
        return jsonify({"error": str(e)}), 500


@app.route('/api/users/me', methods=['GET'])
@jwt_required()
def get_current_user():
    try:
        user = User.query.get(int(get_jwt_identity()))
        if not user:
            return jsonify({"error": "User not found"}), 404
        return jsonify(user.to_dict()), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ── Admin ─────────────────────────────────────────────────────────────────────

@app.route('/api/admin/users', methods=['GET', 'OPTIONS'])
@jwt_required()
def get_all_users():
    if request.method == 'OPTIONS':
        return '', 200
    try:
        current_user = User.query.get(int(get_jwt_identity()))
        if not current_user or current_user.role != 'admin':
            return jsonify({"error": "Admin access required"}), 403

        users = User.query.all()
        return jsonify([u.to_dict() for u in users]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/admin/users/<int:user_id>/role', methods=['PATCH', 'OPTIONS'])
@jwt_required()
def update_user_role(user_id):
    if request.method == 'OPTIONS':
        return '', 200
    try:
        current_user = User.query.get(int(get_jwt_identity()))
        if not current_user or current_user.role != 'admin':
            return jsonify({"error": "Admin access required"}), 403

        data     = request.get_json()
        new_role = data.get('role')
        if new_role not in ['user', 'admin']:
            return jsonify({"error": "Invalid role"}), 400

        target = User.query.get(user_id)
        if not target:
            return jsonify({"error": "User not found"}), 404

        target.role     = new_role
        target.is_admin = new_role == 'admin'
        db.session.commit()

        return jsonify({"message": f"User role updated to {new_role}", "user_id": user_id, "new_role": new_role}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@app.route('/api/admin/promote', methods=['POST', 'OPTIONS'])
def promote_to_admin():
    if request.method == 'OPTIONS':
        return '', 200
    try:
        data   = request.get_json()
        secret = data.get('secret', '')
        email  = data.get('email', '').strip().lower()

        if secret != app.config['JWT_SECRET_KEY']:
            return jsonify({"error": "Invalid secret"}), 403

        user = User.query.filter_by(email=email).first()
        if not user:
            return jsonify({"error": "User not found"}), 404

        user.role     = 'admin'
        user.is_admin = True
        db.session.commit()
        return jsonify({"message": f"{email} has been promoted to admin"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@app.route('/api/admin/incidents/<int:incident_id>/status', methods=['PATCH', 'OPTIONS'])
@jwt_required()
def admin_update_incident_status(incident_id):
    if request.method == 'OPTIONS':
        return '', 200
    try:
        current_user = User.query.get(int(get_jwt_identity()))
        if not current_user or current_user.role != 'admin':
            return jsonify({"error": "Admin access required"}), 403

        data       = request.get_json()
        new_status = data.get('status') if data else None
        if new_status not in ['pending', 'investigating', 'resolved', 'rejected']:
            return jsonify({"error": "Invalid status"}), 400

        incident = Incident.query.get(incident_id)
        if not incident:
            return jsonify({"error": "Incident not found"}), 404

        old_status       = incident.status
        incident.status  = new_status
        incident.updated_at = datetime.datetime.utcnow()
        db.session.commit()

        if new_status != old_status and incident.user_id:
            msgs = {
                'investigating': f"Your incident '{incident.title}' is now under investigation.",
                'resolved':      f"Your incident '{incident.title}' has been resolved!",
                'rejected':      f"Your incident '{incident.title}' has been reviewed and rejected.",
                'pending':       f"Your incident '{incident.title}' status has been reset to pending.",
            }
            if new_status in msgs:
                create_notification(incident.user_id, incident.id, msgs[new_status])

        return jsonify({"message": "Status updated successfully", "status": new_status}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


# ── Incidents ─────────────────────────────────────────────────────────────────

@app.route('/api/incidents', methods=['GET', 'POST', 'OPTIONS'])
@jwt_required()
def incidents():
    if request.method == 'OPTIONS':
        return '', 200

    current_user = User.query.get(int(get_jwt_identity()))
    if not current_user:
        return jsonify({"error": "User not found"}), 404

    if request.method == 'GET':
        try:
            all_incidents = Incident.query.order_by(Incident.created_at.desc()).all()
            return jsonify([i.to_dict() for i in all_incidents]), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    elif request.method == 'POST':
        try:
            data = request.get_json() if request.is_json else request.form.to_dict()
            if not data:
                return jsonify({"error": "No data provided"}), 400

            title         = data.get('title', '').strip()
            description   = data.get('description', '').strip()
            incident_type = data.get('type', '').strip()
            location      = data.get('location', '').strip()

            if not all([title, description, incident_type, location]):
                return jsonify({"error": "Title, description, type, and location are required"}), 400
            if incident_type not in ['redflag', 'intervention']:
                return jsonify({"error": "Type must be 'redflag' or 'intervention'"}), 400

            incident = Incident(
                title=title, description=description,
                type=incident_type, location=location,
                user_id=current_user.id
            )
            db.session.add(incident)
            db.session.commit()
            return jsonify({"message": "Incident created successfully", "incident": incident.to_dict()}), 201

        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 500


@app.route('/api/incidents/anonymous', methods=['POST', 'OPTIONS'])
def create_anonymous_incident():
    if request.method == 'OPTIONS':
        return '', 200
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400

        title         = data.get('title', '').strip()
        description   = data.get('description', '').strip()
        incident_type = data.get('type', '').strip()
        location      = data.get('location', '').strip()

        if not all([title, description, incident_type, location]):
            return jsonify({"error": "Title, description, type, and location are required"}), 400
        if incident_type not in ['redflag', 'intervention']:
            return jsonify({"error": "Type must be 'redflag' or 'intervention'"}), 400

        incident = Incident(
            title=title, description=description,
            type=incident_type, location=location,
            reporter_name=data.get('reporter_name', '').strip() or 'Anonymous',
            reporter_email=data.get('reporter_email', '').strip().lower() or None,
            is_anonymous=True
        )
        db.session.add(incident)
        db.session.commit()
        return jsonify({"message": "Anonymous incident reported successfully", "incident": incident.to_dict()}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@app.route('/api/incidents/stats', methods=['GET'])
@jwt_required()
def incident_stats():
    try:
        return jsonify({
            "total":         Incident.query.count(),
            "pending":       Incident.query.filter_by(status='pending').count(),
            "investigating": Incident.query.filter_by(status='investigating').count(),
            "resolved":      Incident.query.filter_by(status='resolved').count(),
            "rejected":      Incident.query.filter_by(status='rejected').count(),
            "redflags":      Incident.query.filter_by(type='redflag').count(),
            "interventions": Incident.query.filter_by(type='intervention').count(),
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/incidents/<int:incident_id>', methods=['GET', 'PUT', 'DELETE', 'OPTIONS'])
@jwt_required()
def incident_detail(incident_id):
    if request.method == 'OPTIONS':
        return '', 200

    current_user = User.query.get(int(get_jwt_identity()))
    if not current_user:
        return jsonify({"error": "User not found"}), 404

    incident = Incident.query.get(incident_id)
    if not incident:
        return jsonify({"error": "Incident not found"}), 404

    if request.method == 'GET':
        return jsonify(incident.to_dict()), 200

    elif request.method == 'PUT':
        if incident.user_id != current_user.id and not current_user.is_admin:
            return jsonify({"error": "Permission denied"}), 403
        try:
            data = request.get_json() if request.is_json else request.form.to_dict()
            if not data:
                return jsonify({"error": "No data provided"}), 400

            if 'title' in data:       incident.title       = data['title'].strip()
            if 'description' in data: incident.description = data['description'].strip()
            if 'location' in data:    incident.location    = data['location'].strip()
            if 'type' in data and data['type'] in ['redflag', 'intervention']:
                incident.type = data['type']

            if 'status' in data:
                if not current_user.is_admin:
                    return jsonify({"error": "Admin access required to update status"}), 403
                new_status = data['status']
                if new_status in ['pending', 'investigating', 'resolved', 'rejected']:
                    old_status      = incident.status
                    incident.status = new_status
                    if new_status != old_status and incident.user_id:
                        msgs = {
                            'investigating': f"Your incident '{incident.title}' is now under investigation.",
                            'resolved':      f"Your incident '{incident.title}' has been resolved!",
                            'rejected':      f"Your incident '{incident.title}' has been reviewed and rejected.",
                            'pending':       f"Your incident '{incident.title}' status has been reset to pending.",
                        }
                        if new_status in msgs:
                            create_notification(incident.user_id, incident.id, msgs[new_status])

            incident.updated_at = datetime.datetime.utcnow()
            db.session.commit()
            return jsonify({"message": "Incident updated successfully", "incident": incident.to_dict()}), 200

        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 500

    elif request.method == 'DELETE':
        if incident.user_id != current_user.id and not current_user.is_admin:
            return jsonify({"error": "Permission denied"}), 403
        try:
            db.session.delete(incident)
            db.session.commit()
            return jsonify({"message": "Incident deleted successfully"}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 500


# ── Notifications ─────────────────────────────────────────────────────────────

@app.route('/api/notifications', methods=['GET'])
@jwt_required()
def get_notifications():
    try:
        user_id = int(get_jwt_identity())
        notifs  = Notification.query.filter_by(user_id=user_id).order_by(Notification.created_at.desc()).all()
        unread  = Notification.query.filter_by(user_id=user_id, read=False).count()
        return jsonify({"notifications": [n.to_dict() for n in notifs], "unread_count": unread}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/notifications/<int:notification_id>/read', methods=['PUT'])
@jwt_required()
def mark_notification_read(notification_id):
    try:
        user_id = int(get_jwt_identity())
        notif   = Notification.query.filter_by(id=notification_id, user_id=user_id).first()
        if not notif:
            return jsonify({"error": "Notification not found"}), 404
        notif.read = True
        db.session.commit()
        return jsonify({"message": "Notification marked as read"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@app.route('/api/notifications/read-all', methods=['PUT'])
@jwt_required()
def mark_all_notifications_read():
    try:
        user_id = int(get_jwt_identity())
        count   = Notification.query.filter_by(user_id=user_id, read=False).update({"read": True})
        db.session.commit()
        return jsonify({"message": "All notifications marked as read", "count": count}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


# ── Startup ───────────────────────────────────────────────────────────────────

with app.app_context():
    db.create_all()
    print("✅ PostgreSQL tables ready")
    # Sync admin flags
    User.query.filter_by(role='admin', is_admin=False).update({"is_admin": True})
    db.session.commit()
    print("✅ Admin sync complete")

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    print(f"🚀 iReporter backend starting on port {port}")
    app.run(debug=False, port=port, host='0.0.0.0')
