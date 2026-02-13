#!/usr/bin/env python3
"""
Database initialization script
Creates indexes and initial data for iReporter
"""

from pymongo import MongoClient, ASCENDING, DESCENDING
import sys


def init_database():
    """Initialize database with indexes and collections"""
    try:
        # Connect to MongoDB
        client = MongoClient('mongodb://localhost:27017/ireporter')
        db = client.ireporter
        
        print("🔧 Initializing iReporter database...")
        
        # Create indexes for users collection
        print("📝 Creating indexes for users collection...")
        db.users.create_index([("email", ASCENDING)], unique=True)
        db.users.create_index([("created_at", DESCENDING)])
        db.users.create_index([("is_admin", ASCENDING)])
        
        # Create indexes for incidents collection
        print("📝 Creating indexes for incidents collection...")
        db.incidents.create_index([("user_id", ASCENDING)])
        db.incidents.create_index([("status", ASCENDING)])
        db.incidents.create_index([("type", ASCENDING)])
        db.incidents.create_index([("category", ASCENDING)])
        db.incidents.create_index([("created_at", DESCENDING)])
        db.incidents.create_index([("location", ASCENDING)])
        
        # Create compound indexes
        db.incidents.create_index([("user_id", ASCENDING), ("status", ASCENDING)])
        db.incidents.create_index([("type", ASCENDING), ("status", ASCENDING)])
        
        # Create indexes for notifications collection
        print("📝 Creating indexes for notifications collection...")
        db.notifications.create_index([("user_id", ASCENDING)])
        db.notifications.create_index([("read", ASCENDING)])
        db.notifications.create_index([("created_at", DESCENDING)])
        db.notifications.create_index([("user_id", ASCENDING), ("read", ASCENDING)])
        
        print("✅ Database initialized successfully!")
        print(f"   Collections: {', '.join(db.list_collection_names())}")
        
        return True
        
    except Exception as e:
        print(f"❌ Database initialization failed: {e}")
        return False


if __name__ == '__main__':
    success = init_database()
    sys.exit(0 if success else 1)
