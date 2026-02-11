# Notification System Implementation

## Overview
The iReporter application now includes a real-time notification system that alerts users when admins update the status of their incidents.

## Features

### 🔔 Notification Bell
- **Location**: Fixed position in the top-right corner of all authenticated pages
- **Badge**: Shows unread notification count (displays "9+" for 10 or more)
- **Visual Indicator**: Red badge for unread notifications
- **Auto-refresh**: Polls for new notifications every 30 seconds

### 📢 Notification Types
Currently supports:
- **Status Updates**: When an admin changes incident status to:
  - `investigating` - "Your incident '[title]' is now under investigation."
  - `resolved` - "Your incident '[title]' has been resolved!"
  - `rejected` - "Your incident '[title]' has been reviewed and rejected."

### 🎯 User Experience
1. **Notification Dropdown**:
   - Click the bell icon to view all notifications
   - Unread notifications have a blue background
   - Each notification shows timestamp and type icon
   - Click any notification to view the related incident

2. **Mark as Read**:
   - Click individual notification to mark as read and navigate to incident
   - "Mark all read" button to clear all unread notifications at once

3. **Empty State**:
   - Friendly message when no notifications exist
   - Clear visual indicator (🔕 icon)

## Backend Implementation

### Database
- **Collection**: `notifications`
- **Schema**:
  ```javascript
  {
    user_id: String,        // User who receives the notification
    incident_id: String,    // Related incident ID
    message: String,        // Notification message
    type: String,           // 'status_update', etc.
    read: Boolean,          // Read status
    created_at: DateTime    // Timestamp
  }
  ```

### API Endpoints

#### Get Notifications
```
GET /api/notifications
Authorization: Bearer <token>

Response:
{
  "notifications": [...],
  "unread_count": 3
}
```

#### Mark Notification as Read
```
PUT /api/notifications/<notification_id>/read
Authorization: Bearer <token>

Response:
{
  "message": "Notification marked as read"
}
```

#### Mark All Notifications as Read
```
PUT /api/notifications/read-all
Authorization: Bearer <token>

Response:
{
  "message": "All notifications marked as read",
  "count": 5
}
```

### Notification Creation
Notifications are automatically created when:
- Admin updates incident status from the admin panel
- Admin updates incident status from the incident detail page
- Status changes from any value to: investigating, resolved, or rejected

**Code Location**: `backend_complete_simple.py` - Lines ~490-510

## Frontend Implementation

### Components

#### NotificationBell Component
**Location**: `ireporter-frontend/src/components/NotificationBell.jsx`

**Features**:
- Displays notification count badge
- Dropdown menu with notification list
- Auto-refresh every 30 seconds
- Click handlers for marking as read
- Navigation to related incidents

**Styling**:
- Fixed position (top-right)
- Responsive dropdown (350px width, max 400px height)
- Smooth animations and hover effects
- Color-coded read/unread states

#### Integration
**Location**: `ireporter-frontend/src/components/MobileLayout.jsx`

The NotificationBell is integrated into the MobileLayout component, making it available on all authenticated pages:
- Dashboard
- Incident List
- Create Incident
- View Incident
- Edit Incident
- Admin Panel
- Help Page

## How It Works

### Flow Diagram
```
1. Admin updates incident status
   ↓
2. Backend creates notification for incident owner
   ↓
3. Notification stored in MongoDB
   ↓
4. User's NotificationBell polls for updates (every 30s)
   ↓
5. Badge shows unread count
   ↓
6. User clicks bell to view notifications
   ↓
7. User clicks notification
   ↓
8. Notification marked as read
   ↓
9. User navigated to incident detail page
```

### Example Scenario
1. User "John" reports an incident
2. Admin reviews and changes status to "investigating"
3. Backend creates notification for John
4. John's notification bell shows badge with "1"
5. John clicks bell and sees: "Your incident 'Pothole on Main St' is now under investigation."
6. John clicks notification
7. Notification marked as read, badge disappears
8. John is taken to the incident detail page

## Testing

### Manual Testing Steps
1. **Create Test Incident**:
   - Login as regular user
   - Create a new incident
   - Note the incident ID

2. **Update Status as Admin**:
   - Login as admin
   - Navigate to the incident
   - Change status to "investigating"
   - Logout

3. **Check Notifications**:
   - Login as the original user
   - Check notification bell (should show "1")
   - Click bell to view notification
   - Click notification to navigate to incident
   - Verify notification is marked as read

4. **Test Multiple Notifications**:
   - Repeat with different status changes
   - Test "Mark all read" functionality

## Future Enhancements

Potential improvements:
- 🔄 Real-time notifications using WebSockets
- 📧 Email notifications for critical updates
- 🔊 Browser push notifications
- 💬 Comment notifications
- 👥 Mention notifications (@username)
- 🔕 Notification preferences/settings
- 📊 Notification history/archive
- 🔍 Filter notifications by type
- ⏰ Scheduled digest notifications

## Troubleshooting

### Notifications Not Appearing
1. Check backend is running: `http://localhost:5001`
2. Verify MongoDB connection
3. Check browser console for errors
4. Verify user is logged in (token exists)
5. Check notification collection in MongoDB

### Badge Not Updating
1. Wait 30 seconds for auto-refresh
2. Refresh the page manually
3. Check network tab for API calls
4. Verify token is valid

### Cannot Mark as Read
1. Check user permissions
2. Verify notification belongs to current user
3. Check backend logs for errors
4. Verify MongoDB write permissions

## Files Modified/Created

### Backend
- ✅ `backend_complete_simple.py` - Added notification endpoints and logic

### Frontend
- ✅ `ireporter-frontend/src/components/NotificationBell.jsx` - New component
- ✅ `ireporter-frontend/src/components/MobileLayout.jsx` - Integrated NotificationBell
- ✅ `ireporter-frontend/src/pages/Dashboard.jsx` - Removed duplicate import

### Documentation
- ✅ `docs/NOTIFICATION_SYSTEM.md` - This file

## Summary

The notification system is now fully functional! Users will receive notifications when admins update their incident statuses, improving communication and transparency in the incident reporting process.
