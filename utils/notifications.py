"""
Notification utilities for iReporter
"""

from typing import Dict, Optional
from datetime import datetime


def create_notification_message(incident_title: str, status: str, incident_type: str = None) -> str:
    """
    Create notification message based on status change
    
    Args:
        incident_title: Title of the incident
        status: New status of the incident
        incident_type: Type of incident (optional)
        
    Returns:
        Notification message string
    """
    messages = {
        'investigating': f"Your incident '{incident_title}' is now under investigation.",
        'resolved': f"Your incident '{incident_title}' has been resolved!",
        'rejected': f"Your incident '{incident_title}' has been reviewed and rejected.",
        'pending': f"Your incident '{incident_title}' is pending review."
    }
    
    return messages.get(status, f"Your incident '{incident_title}' status has been updated to {status}.")


def send_notification(user_id: str, message: str, notification_type: str = 'status_update') -> Dict:
    """
    Prepare notification data for sending
    
    Args:
        user_id: ID of the user to notify
        message: Notification message
        notification_type: Type of notification
        
    Returns:
        Notification data dictionary
    """
    return {
        'user_id': user_id,
        'message': message,
        'type': notification_type,
        'read': False,
        'created_at': datetime.now()
    }


def get_notification_icon(notification_type: str) -> str:
    """
    Get icon for notification type
    
    Args:
        notification_type: Type of notification
        
    Returns:
        Emoji icon
    """
    icons = {
        'status_update': '📢',
        'comment': '💬',
        'mention': '👤',
        'system': '⚙️',
        'warning': '⚠️',
        'success': '✅',
        'error': '❌'
    }
    
    return icons.get(notification_type, '📬')


def format_notification_time(created_at: datetime) -> str:
    """
    Format notification timestamp to relative time
    
    Args:
        created_at: Notification creation time
        
    Returns:
        Relative time string
    """
    now = datetime.now()
    delta = now - created_at
    
    seconds = delta.total_seconds()
    
    if seconds < 60:
        return "Just now"
    elif seconds < 3600:
        minutes = int(seconds / 60)
        return f"{minutes} minute{'s' if minutes > 1 else ''} ago"
    elif seconds < 86400:
        hours = int(seconds / 3600)
        return f"{hours} hour{'s' if hours > 1 else ''} ago"
    elif seconds < 604800:
        days = int(seconds / 86400)
        return f"{days} day{'s' if days > 1 else ''} ago"
    else:
        return created_at.strftime("%b %d, %Y")


def group_notifications_by_date(notifications: list) -> Dict:
    """
    Group notifications by date
    
    Args:
        notifications: List of notification dictionaries
        
    Returns:
        Dictionary with dates as keys and notification lists as values
    """
    grouped = {}
    
    for notification in notifications:
        created_at = notification.get('created_at')
        if isinstance(created_at, str):
            created_at = datetime.fromisoformat(created_at)
        
        date_key = created_at.strftime("%Y-%m-%d")
        
        if date_key not in grouped:
            grouped[date_key] = []
        
        grouped[date_key].append(notification)
    
    return grouped


def get_unread_count(notifications: list) -> int:
    """
    Count unread notifications
    
    Args:
        notifications: List of notification dictionaries
        
    Returns:
        Count of unread notifications
    """
    return sum(1 for n in notifications if not n.get('read', False))


def mark_notifications_as_read(notification_ids: list) -> Dict:
    """
    Prepare data for marking notifications as read
    
    Args:
        notification_ids: List of notification IDs
        
    Returns:
        Update data dictionary
    """
    return {
        'notification_ids': notification_ids,
        'read': True,
        'read_at': datetime.now()
    }


def filter_notifications_by_type(notifications: list, notification_type: str) -> list:
    """
    Filter notifications by type
    
    Args:
        notifications: List of notification dictionaries
        notification_type: Type to filter by
        
    Returns:
        Filtered list of notifications
    """
    return [n for n in notifications if n.get('type') == notification_type]


def get_notification_priority(notification_type: str) -> int:
    """
    Get priority level for notification type
    
    Args:
        notification_type: Type of notification
        
    Returns:
        Priority level (1=highest, 5=lowest)
    """
    priorities = {
        'error': 1,
        'warning': 2,
        'status_update': 3,
        'comment': 4,
        'system': 5
    }
    
    return priorities.get(notification_type, 5)


def sort_notifications_by_priority(notifications: list) -> list:
    """
    Sort notifications by priority and date
    
    Args:
        notifications: List of notification dictionaries
        
    Returns:
        Sorted list of notifications
    """
    return sorted(
        notifications,
        key=lambda n: (
            get_notification_priority(n.get('type', 'system')),
            n.get('created_at', datetime.now())
        ),
        reverse=True
    )
