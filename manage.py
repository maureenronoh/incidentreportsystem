#!/usr/bin/env python3
"""
iReporter Management Script
Provides command-line utilities for managing the application
"""

import sys
import os
import argparse
from pymongo import MongoClient
import bcrypt
from datetime import datetime


def get_db_connection():
    """Get MongoDB database connection"""
    try:
        client = MongoClient('mongodb://localhost:27017/ireporter')
        db = client.ireporter
        return db
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        sys.exit(1)


def create_admin_user(email, password, name):
    """Create an admin user"""
    db = get_db_connection()
    
    # Check if user exists
    existing_user = db.users.find_one({"email": email.lower()})
    if existing_user:
        print(f"❌ User with email {email} already exists")
        return False
    
    # Hash password
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    
    # Create user
    user = {
        "name": name,
        "email": email.lower(),
        "password": hashed_password,
        "is_admin": True,
        "created_at": datetime.now()
    }
    
    result = db.users.insert_one(user)
    print(f"✅ Admin user created successfully!")
    print(f"   Email: {email}")
    print(f"   ID: {result.inserted_id}")
    return True


def list_users():
    """List all users in the system"""
    db = get_db_connection()
    users = db.users.find()
    
    print("\n📋 System Users:")
    print("-" * 80)
    print(f"{'ID':<25} {'Name':<20} {'Email':<30} {'Admin':<10}")
    print("-" * 80)
    
    count = 0
    for user in users:
        user_id = str(user['_id'])
        name = user.get('name', 'N/A')
        email = user.get('email', 'N/A')
        is_admin = '✓' if user.get('is_admin', False) else ''
        print(f"{user_id:<25} {name:<20} {email:<30} {is_admin:<10}")
        count += 1
    
    print("-" * 80)
    print(f"Total users: {count}\n")


def list_incidents():
    """List all incidents in the system"""
    db = get_db_connection()
    incidents = db.incidents.find()
    
    print("\n📋 System Incidents:")
    print("-" * 100)
    print(f"{'ID':<25} {'Title':<30} {'Type':<15} {'Status':<15} {'Created':<15}")
    print("-" * 100)
    
    count = 0
    for incident in incidents:
        incident_id = str(incident['_id'])
        title = incident.get('title', 'N/A')[:28]
        inc_type = incident.get('type', 'N/A')
        status = incident.get('status', 'pending')
        created = incident.get('created_at', datetime.now()).strftime('%Y-%m-%d')
        print(f"{incident_id:<25} {title:<30} {inc_type:<15} {status:<15} {created:<15}")
        count += 1
    
    print("-" * 100)
    print(f"Total incidents: {count}\n")


def get_stats():
    """Get system statistics"""
    db = get_db_connection()
    
    total_users = db.users.count_documents({})
    admin_users = db.users.count_documents({"is_admin": True})
    total_incidents = db.incidents.count_documents({})
    pending_incidents = db.incidents.count_documents({"status": "pending"})
    resolved_incidents = db.incidents.count_documents({"status": "resolved"})
    redflags = db.incidents.count_documents({"type": "redflag"})
    interventions = db.incidents.count_documents({"type": "intervention"})
    
    print("\n📊 System Statistics:")
    print("-" * 50)
    print(f"Total Users:           {total_users}")
    print(f"Admin Users:           {admin_users}")
    print(f"Total Incidents:       {total_incidents}")
    print(f"Pending Incidents:     {pending_incidents}")
    print(f"Resolved Incidents:    {resolved_incidents}")
    print(f"Red Flags:             {redflags}")
    print(f"Interventions:         {interventions}")
    print("-" * 50)
    print()


def clear_database():
    """Clear all data from database (use with caution!)"""
    db = get_db_connection()
    
    confirm = input("⚠️  Are you sure you want to clear ALL data? (yes/no): ")
    if confirm.lower() != 'yes':
        print("❌ Operation cancelled")
        return
    
    db.users.delete_many({})
    db.incidents.delete_many({})
    db.notifications.delete_many({})
    
    print("✅ Database cleared successfully!")


def main():
    """Main entry point"""
    parser = argparse.ArgumentParser(
        description='iReporter Management Script',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python manage.py create-admin admin@example.com password123 "Admin User"
  python manage.py list-users
  python manage.py list-incidents
  python manage.py stats
        """
    )
    
    subparsers = parser.add_subparsers(dest='command', help='Available commands')
    
    # Create admin command
    create_admin_parser = subparsers.add_parser('create-admin', help='Create an admin user')
    create_admin_parser.add_argument('email', help='Admin email address')
    create_admin_parser.add_argument('password', help='Admin password')
    create_admin_parser.add_argument('name', help='Admin name')
    
    # List users command
    subparsers.add_parser('list-users', help='List all users')
    
    # List incidents command
    subparsers.add_parser('list-incidents', help='List all incidents')
    
    # Stats command
    subparsers.add_parser('stats', help='Show system statistics')
    
    # Clear database command
    subparsers.add_parser('clear-db', help='Clear all database data (DANGEROUS!)')
    
    args = parser.parse_args()
    
    if not args.command:
        parser.print_help()
        return
    
    # Execute command
    if args.command == 'create-admin':
        create_admin_user(args.email, args.password, args.name)
    elif args.command == 'list-users':
        list_users()
    elif args.command == 'list-incidents':
        list_incidents()
    elif args.command == 'stats':
        get_stats()
    elif args.command == 'clear-db':
        clear_database()


if __name__ == '__main__':
    main()
