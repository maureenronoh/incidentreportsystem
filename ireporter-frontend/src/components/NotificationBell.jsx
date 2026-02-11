import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const API_URL = 'http://localhost:5001/api';

  useEffect(() => {
    fetchNotifications();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.get(`${API_URL}/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setNotifications(response.data.notifications || []);
      setUnreadCount(response.data.unread_count || 0);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_URL}/notifications/${notificationId}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_URL}/notifications/read-all`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchNotifications();
    } catch (error) {
      console.error('Error marking all as read:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    if (notification.incident_id) {
      navigate(`/incidents/${notification.incident_id}`);
      setShowDropdown(false);
    }
  };

  const bellStyle = {
    position: 'relative',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '50%',
    backgroundColor: 'white',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    transition: 'all 0.3s'
  };

  const badgeStyle = {
    position: 'absolute',
    top: '-5px',
    right: '-5px',
    backgroundColor: '#dc3545',
    color: 'white',
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    fontWeight: 'bold',
    border: '2px solid white'
  };

  const dropdownStyle = {
    position: 'absolute',
    top: '50px',
    right: '0',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
    width: '350px',
    maxHeight: '400px',
    overflowY: 'auto',
    zIndex: 1000,
    border: '1px solid #e0e0e0'
  };

  const headerStyle = {
    padding: '15px',
    borderBottom: '1px solid #e0e0e0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f9fa'
  };

  const notificationItemStyle = (isRead) => ({
    padding: '15px',
    borderBottom: '1px solid #f0f0f0',
    cursor: 'pointer',
    backgroundColor: isRead ? 'white' : '#f0f8ff',
    transition: 'background-color 0.2s',
    ':hover': {
      backgroundColor: '#e9ecef'
    }
  });

  const emptyStyle = {
    padding: '40px 20px',
    textAlign: 'center',
    color: '#666'
  };

  return (
    <div style={{ position: 'relative' }}>
      <div
        style={bellStyle}
        onClick={() => setShowDropdown(!showDropdown)}
        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <span style={{ fontSize: '24px' }}>🔔</span>
        {unreadCount > 0 && (
          <div style={badgeStyle}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </div>
        )}
      </div>

      {showDropdown && (
        <>
          {/* Backdrop to close dropdown */}
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 999
            }}
            onClick={() => setShowDropdown(false)}
          />
          
          <div style={dropdownStyle}>
            <div style={headerStyle}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>
                Notifications
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  disabled={loading}
                  style={{
                    padding: '5px 10px',
                    fontSize: '12px',
                    backgroundColor: '#667eea',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.6 : 1
                  }}
                >
                  {loading ? 'Marking...' : 'Mark all read'}
                </button>
              )}
            </div>

            {notifications.length === 0 ? (
              <div style={emptyStyle}>
                <div style={{ fontSize: '48px', marginBottom: '10px' }}>🔕</div>
                <p style={{ margin: 0 }}>No notifications yet</p>
                <p style={{ fontSize: '12px', color: '#999', marginTop: '5px' }}>
                  You'll be notified when there are updates
                </p>
              </div>
            ) : (
              <div>
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    style={notificationItemStyle(notification.read)}
                    onClick={() => handleNotificationClick(notification)}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e9ecef'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = notification.read ? 'white' : '#f0f8ff'}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <div style={{ fontSize: '20px' }}>
                        {notification.type === 'status_update' ? '📢' : '📬'}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ 
                          margin: '0 0 5px 0', 
                          fontSize: '14px',
                          fontWeight: notification.read ? 'normal' : 'bold',
                          color: '#333'
                        }}>
                          {notification.message}
                        </p>
                        <p style={{ 
                          margin: 0, 
                          fontSize: '11px', 
                          color: '#999' 
                        }}>
                          {new Date(notification.created_at).toLocaleString()}
                        </p>
                      </div>
                      {!notification.read && (
                        <div style={{
                          width: '8px',
                          height: '8px',
                          backgroundColor: '#667eea',
                          borderRadius: '50%',
                          marginTop: '5px'
                        }} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationBell;
