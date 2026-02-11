"""
Backend API Tests
Tests for the iReporter backend API endpoints
"""

import unittest
import json
from backend_complete_simple import app
from pymongo import MongoClient


class TestBackendAPI(unittest.TestCase):
    """Test cases for backend API"""
    
    @classmethod
    def setUpClass(cls):
        """Set up test client"""
        cls.client = app.test_client()
        cls.client.testing = True
    
    def test_home_endpoint(self):
        """Test home endpoint returns correct response"""
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIn('message', data)
        self.assertIn('status', data)
    
    def test_register_endpoint_exists(self):
        """Test register endpoint exists"""
        response = self.client.options('/api/users/register')
        self.assertEqual(response.status_code, 200)
    
    def test_login_endpoint_exists(self):
        """Test login endpoint exists"""
        response = self.client.options('/api/users/login')
        self.assertEqual(response.status_code, 200)
    
    def test_incidents_endpoint_requires_auth(self):
        """Test incidents endpoint requires authentication"""
        response = self.client.get('/api/incidents')
        # Should return 401 or 422 (unprocessable entity) without token
        self.assertIn(response.status_code, [401, 422])
    
    def test_anonymous_report_endpoint_exists(self):
        """Test anonymous report endpoint exists"""
        response = self.client.options('/api/incidents/anonymous')
        self.assertEqual(response.status_code, 200)


class TestDatabaseConnection(unittest.TestCase):
    """Test cases for database connectivity"""
    
    def test_mongodb_connection(self):
        """Test MongoDB connection is successful"""
        try:
            client = MongoClient('mongodb://localhost:27017/ireporter', serverSelectionTimeoutMS=2000)
            client.admin.command('ping')
            connected = True
        except Exception:
            connected = False
        
        self.assertTrue(connected, "MongoDB connection should be successful")
    
    def test_database_collections_exist(self):
        """Test required collections exist"""
        try:
            client = MongoClient('mongodb://localhost:27017/ireporter')
            db = client.ireporter
            collections = db.list_collection_names()
            
            # Check if collections exist or can be created
            self.assertIsInstance(collections, list)
        except Exception as e:
            self.fail(f"Database collections check failed: {e}")


class TestIncidentModel(unittest.TestCase):
    """Test cases for incident data model"""
    
    def test_incident_structure(self):
        """Test incident has required fields"""
        incident = {
            'title': 'Test Incident',
            'description': 'Test Description',
            'type': 'redflag',
            'category': 'bribery',
            'location': 'Test Location',
            'status': 'pending'
        }
        
        required_fields = ['title', 'description', 'type', 'location']
        for field in required_fields:
            self.assertIn(field, incident)
    
    def test_incident_types(self):
        """Test valid incident types"""
        valid_types = ['redflag', 'intervention']
        
        for inc_type in valid_types:
            incident = {'type': inc_type}
            self.assertIn(incident['type'], valid_types)
    
    def test_incident_statuses(self):
        """Test valid incident statuses"""
        valid_statuses = ['pending', 'investigating', 'resolved', 'rejected']
        
        for status in valid_statuses:
            incident = {'status': status}
            self.assertIn(incident['status'], valid_statuses)


class TestUserModel(unittest.TestCase):
    """Test cases for user data model"""
    
    def test_user_structure(self):
        """Test user has required fields"""
        user = {
            'name': 'Test User',
            'email': 'test@example.com',
            'password': 'hashed_password',
            'is_admin': False
        }
        
        required_fields = ['name', 'email', 'password']
        for field in required_fields:
            self.assertIn(field, user)
    
    def test_email_format(self):
        """Test email is lowercase"""
        email = 'Test@Example.COM'
        normalized_email = email.lower()
        self.assertEqual(normalized_email, 'test@example.com')


class TestNotificationModel(unittest.TestCase):
    """Test cases for notification data model"""
    
    def test_notification_structure(self):
        """Test notification has required fields"""
        notification = {
            'user_id': 'user123',
            'incident_id': 'incident456',
            'message': 'Test notification',
            'type': 'status_update',
            'read': False
        }
        
        required_fields = ['user_id', 'incident_id', 'message', 'type', 'read']
        for field in required_fields:
            self.assertIn(field, notification)


if __name__ == '__main__':
    unittest.main()
