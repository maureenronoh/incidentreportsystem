import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const menuButtonStyle = {
    position: 'relative',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '50%',
    backgroundColor: 'white',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    transition: 'all 0.3s',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px'
  };

  const dotsStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '3px',
    alignItems: 'center'
  };

  const dotStyle = {
    width: '4px',
    height: '4px',
    backgroundColor: '#374151',
    borderRadius: '50%'
  };

  const dropdownStyle = {
    position: 'absolute',
    top: '50px',
    right: '0',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
    width: '250px',
    zIndex: 1000,
    border: '1px solid #e0e0e0',
    overflow: 'hidden'
  };

  const userInfoStyle = {
    padding: '15px',
    borderBottom: '1px solid #e0e0e0',
    backgroundColor: '#f8f9fa'
  };

  const menuItemStyle = {
    padding: '12px 15px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '14px',
    color: '#374151',
    borderBottom: '1px solid #f0f0f0'
  };

  const logoutItemStyle = {
    ...menuItemStyle,
    color: '#dc3545',
    fontWeight: '600',
    borderBottom: 'none'
  };

  return (
    <div style={{ position: 'relative' }} ref={menuRef}>
      <button
        style={menuButtonStyle}
        onClick={() => setIsOpen(!isOpen)}
        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <div style={dotsStyle}>
          <div style={dotStyle}></div>
          <div style={dotStyle}></div>
          <div style={dotStyle}></div>
        </div>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 999
            }}
            onClick={() => setIsOpen(false)}
          />
          
          <div style={dropdownStyle}>
            {/* User Info */}
            <div style={userInfoStyle}>
              <div style={{ fontWeight: '600', color: '#1f2937', marginBottom: '4px' }}>
                {user?.name || 'User'}
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                {user?.email}
              </div>
              {isAdmin() && (
                <div style={{
                  marginTop: '8px',
                  display: 'inline-block',
                  padding: '4px 8px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: '600'
                }}>
                  👑 ADMIN
                </div>
              )}
            </div>

            {/* Menu Items */}
            <div
              style={menuItemStyle}
              onClick={() => {
                navigate('/dashboard');
                setIsOpen(false);
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
            >
              <span>🏠</span>
              <span>Dashboard</span>
            </div>

            <div
              style={menuItemStyle}
              onClick={() => {
                navigate('/incidents');
                setIsOpen(false);
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
            >
              <span>📋</span>
              <span>My Incidents</span>
            </div>

            {isAdmin() && (
              <div
                style={menuItemStyle}
                onClick={() => {
                  navigate('/admin');
                  setIsOpen(false);
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
              >
                <span>👑</span>
                <span>Admin Panel</span>
              </div>
            )}

            <div
              style={menuItemStyle}
              onClick={() => {
                navigate('/help');
                setIsOpen(false);
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
            >
              <span>❓</span>
              <span>Help & Support</span>
            </div>

            {/* Logout */}
            <div
              style={logoutItemStyle}
              onClick={handleLogout}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
            >
              <span>🚪</span>
              <span>Logout</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserMenu;
