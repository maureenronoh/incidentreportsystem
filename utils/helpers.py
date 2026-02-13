"""
Helper utility functions for iReporter
"""

import re
import uuid
from datetime import datetime
from typing import Any, Optional


def format_date(date: datetime, format_string: str = "%Y-%m-%d %H:%M:%S") -> str:
    """
    Format datetime object to string
    
    Args:
        date: Datetime object to format
        format_string: Format string (default: YYYY-MM-DD HH:MM:SS)
        
    Returns:
        Formatted date string
    """
    if not isinstance(date, datetime):
        return str(date)
    
    return date.strftime(format_string)


def generate_id() -> str:
    """
    Generate a unique ID
    
    Returns:
        UUID string
    """
    return str(uuid.uuid4())


def sanitize_input(text: str) -> str:
    """
    Sanitize user input by removing potentially harmful characters
    
    Args:
        text: Input text to sanitize
        
    Returns:
        Sanitized text
    """
    if not text:
        return ""
    
    # Remove HTML tags
    text = re.sub(r'<[^>]+>', '', text)
    
    # Remove script tags and content
    text = re.sub(r'<script[^>]*>.*?</script>', '', text, flags=re.DOTALL | re.IGNORECASE)
    
    # Trim whitespace
    text = text.strip()
    
    return text


def truncate_text(text: str, max_length: int = 100, suffix: str = "...") -> str:
    """
    Truncate text to specified length
    
    Args:
        text: Text to truncate
        max_length: Maximum length
        suffix: Suffix to add if truncated
        
    Returns:
        Truncated text
    """
    if not text or len(text) <= max_length:
        return text
    
    return text[:max_length - len(suffix)] + suffix


def get_status_color(status: str) -> str:
    """
    Get color code for incident status
    
    Args:
        status: Incident status
        
    Returns:
        Hex color code
    """
    colors = {
        'pending': '#ffc107',
        'investigating': '#007bff',
        'resolved': '#28a745',
        'rejected': '#dc3545'
    }
    
    return colors.get(status.lower(), '#6c757d')


def get_type_icon(incident_type: str) -> str:
    """
    Get emoji icon for incident type
    
    Args:
        incident_type: Type of incident
        
    Returns:
        Emoji icon
    """
    icons = {
        'redflag': '🚩',
        'intervention': '🔧'
    }
    
    return icons.get(incident_type.lower(), '📋')


def calculate_response_time(created_at: datetime, updated_at: Optional[datetime] = None) -> str:
    """
    Calculate response time for an incident
    
    Args:
        created_at: Incident creation time
        updated_at: Incident update time (default: now)
        
    Returns:
        Human-readable response time
    """
    if updated_at is None:
        updated_at = datetime.now()
    
    delta = updated_at - created_at
    
    days = delta.days
    hours = delta.seconds // 3600
    minutes = (delta.seconds % 3600) // 60
    
    if days > 0:
        return f"{days} day{'s' if days > 1 else ''}"
    elif hours > 0:
        return f"{hours} hour{'s' if hours > 1 else ''}"
    elif minutes > 0:
        return f"{minutes} minute{'s' if minutes > 1 else ''}"
    else:
        return "Just now"


def paginate_results(items: list, page: int = 1, per_page: int = 10) -> dict:
    """
    Paginate a list of items
    
    Args:
        items: List of items to paginate
        page: Page number (1-indexed)
        per_page: Items per page
        
    Returns:
        Dictionary with paginated results and metadata
    """
    total = len(items)
    total_pages = (total + per_page - 1) // per_page
    
    start = (page - 1) * per_page
    end = start + per_page
    
    return {
        'items': items[start:end],
        'page': page,
        'per_page': per_page,
        'total': total,
        'total_pages': total_pages,
        'has_prev': page > 1,
        'has_next': page < total_pages
    }


def format_phone_number(phone: str) -> str:
    """
    Format phone number to standard format
    
    Args:
        phone: Phone number string
        
    Returns:
        Formatted phone number
    """
    # Remove all non-digit characters
    digits = re.sub(r'\D', '', phone)
    
    # Format based on length
    if len(digits) == 10:
        return f"({digits[:3]}) {digits[3:6]}-{digits[6:]}"
    elif len(digits) == 11:
        return f"+{digits[0]} ({digits[1:4]}) {digits[4:7]}-{digits[7:]}"
    else:
        return phone


def get_category_label(category: str) -> str:
    """
    Get human-readable label for category
    
    Args:
        category: Category code
        
    Returns:
        Human-readable label
    """
    labels = {
        # Red flag categories
        'bribery': '💰 Bribery',
        'embezzlement': '💼 Embezzlement',
        'fraud': '🎭 Fraud',
        'abuse_of_office': '👔 Abuse of Office',
        'nepotism': '👨‍👩‍👧 Nepotism',
        'conflict_of_interest': '⚖️ Conflict of Interest',
        
        # Intervention categories
        'road_infrastructure': '🛣️ Road Infrastructure',
        'water_supply': '💧 Water Supply',
        'electricity': '⚡ Electricity',
        'waste_management': '🗑️ Waste Management',
        'public_transport': '🚌 Public Transport',
        'healthcare': '🏥 Healthcare',
        'education': '🎓 Education',
        'security': '🚨 Security',
        'other': '📋 Other'
    }
    
    return labels.get(category, category.replace('_', ' ').title())
