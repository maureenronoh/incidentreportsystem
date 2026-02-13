#!/usr/bin/env python3
"""
Database backup script
Creates a backup of the MongoDB database
"""

import os
import sys
from datetime import datetime
from pymongo import MongoClient
import json


def backup_database(output_dir='backups'):
    """Backup MongoDB database to JSON files"""
    try:
        # Create backup directory
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)
        
        # Connect to MongoDB
        client = MongoClient('mongodb://localhost:27017/ireporter')
        db = client.ireporter
        
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        backup_path = os.path.join(output_dir, f'backup_{timestamp}')
        os.makedirs(backup_path)
        
        print(f"🔧 Creating backup at: {backup_path}")
        
        # Backup each collection
        collections = ['users', 'incidents', 'notifications']
        
        for collection_name in collections:
            print(f"📝 Backing up {collection_name}...")
            collection = db[collection_name]
            
            # Get all documents
            documents = list(collection.find())
            
            # Convert ObjectId to string
            for doc in documents:
                if '_id' in doc:
                    doc['_id'] = str(doc['_id'])
                if 'created_at' in doc:
                    doc['created_at'] = doc['created_at'].isoformat()
                if 'updated_at' in doc:
                    doc['updated_at'] = doc['updated_at'].isoformat()
            
            # Save to JSON file
            file_path = os.path.join(backup_path, f'{collection_name}.json')
            with open(file_path, 'w') as f:
                json.dump(documents, f, indent=2)
            
            print(f"   ✅ Backed up {len(documents)} documents")
        
        print(f"\n✅ Backup completed successfully!")
        print(f"   Location: {backup_path}")
        
        return True
        
    except Exception as e:
        print(f"❌ Backup failed: {e}")
        return False


if __name__ == '__main__':
    success = backup_database()
    sys.exit(0 if success else 1)
