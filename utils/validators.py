"""
Validation utilities for iReporter
"""

import re
from typing import Dict, Tuple, Optional


def validate_email(email: str) -> Tuple[bool, Optional[str]]:
    """
    Validate email address format
    
    Args:
        email: Email address to validate
        
    Returns:
        Tuple of (is_valid, error_message)
    """
    if not email:
        return False, "Email is required"
    
    # Basic email regex pattern
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    
    if not re.match(pattern, email):
        return False, "Invalid email format"
    
    if len(email) > 255:
        return False, "Email is too long"
    
    return True, None


def validate_password(password: str) -> Tuple[bool, Optional[str]]:
    """
    Validate password strength
    
    Args:
        password: Password to validate
        
    Returns:
        Tuple of (is_valid, error_message)
    """
    if not password:
        return False, "Password is required"
    
    if len(password) < 6:
        return False, "Password must be at least 6 characters long"
    
    if len(password) > 128:
        return False, "Password is too long"
    
    # Check for at least one letter and one number
    has_letter = any(c.isalpha() for c in password)
    has_number = any(c.isdigit() for c in password)
    
    if not (has_letter and has_number):
        return False, "Password must contain both letters and numbers"
    
    return True, None


def validate_incident_data(data: Dict) -> Tuple[bool, Optional[str]]:
    """
    Validate incident report data
    
    Args:
        data: Incident data dictionary
        
    Returns:
        Tuple of (is_valid, error_message)
    """
    required_fields = ['title', 'description', 'type', 'location']
    
    # Check required fields
    for field in required_fields:
        if field not in data or not data[field]:
            return False, f"{field.capitalize()} is required"
    
    # Validate title length
    if len(data['title']) < 5:
        return False, "Title must be at least 5 characters long"
    
    if len(data['title']) > 200:
        return False, "Title is too long (max 200 characters)"
    
    # Validate description length
    if len(data['description']) < 10:
        return False, "Description must be at least 10 characters long"
    
    if len(data['description']) > 5000:
        return False, "Description is too long (max 5000 characters)"
    
    # Validate incident type
    valid_types = ['redflag', 'intervention']
    if data['type'] not in valid_types:
        return False, f"Invalid incident type. Must be one of: {', '.join(valid_types)}"
    
    # Validate location
    if len(data['location']) < 3:
        return False, "Location must be at least 3 characters long"
    
    if len(data['location']) > 500:
        return False, "Location is too long (max 500 characters)"
    
    # Validate category if provided
    if 'category' in data and data['category']:
        valid_redflag_categories = [
            'bribery', 'embezzlement', 'fraud', 'abuse_of_office',
            'nepotism', 'conflict_of_interest', 'other'
        ]
        valid_intervention_categories = [
            'road_infrastructure', 'water_supply', 'electricity',
            'waste_management', 'public_transport', 'healthcare',
            'education', 'security', 'other'
        ]
        
        if data['type'] == 'redflag' and data['category'] not in valid_redflag_categories:
            return False, "Invalid category for red flag incident"
        
        if data['type'] == 'intervention' and data['category'] not in valid_intervention_categories:
            return False, "Invalid category for intervention incident"
    
    return True, None


def validate_status(status: str) -> Tuple[bool, Optional[str]]:
    """
    Validate incident status
    
    Args:
        status: Status to validate
        
    Returns:
        Tuple of (is_valid, error_message)
    """
    valid_statuses = ['pending', 'investigating', 'resolved', 'rejected']
    
    if status not in valid_statuses:
        return False, f"Invalid status. Must be one of: {', '.join(valid_statuses)}"
    
    return True, None


def validate_user_data(data: Dict) -> Tuple[bool, Optional[str]]:
    """
    Validate user registration data
    
    Args:
        data: User data dictionary
        
    Returns:
        Tuple of (is_valid, error_message)
    """
    required_fields = ['name', 'email', 'password']
    
    # Check required fields
    for field in required_fields:
        if field not in data or not data[field]:
            return False, f"{field.capitalize()} is required"
    
    # Validate name
    if len(data['name']) < 2:
        return False, "Name must be at least 2 characters long"
    
    if len(data['name']) > 100:
        return False, "Name is too long (max 100 characters)"
    
    # Validate email
    is_valid, error = validate_email(data['email'])
    if not is_valid:
        return False, error
    
    # Validate password
    is_valid, error = validate_password(data['password'])
    if not is_valid:
        return False, error
    
    return True, None
