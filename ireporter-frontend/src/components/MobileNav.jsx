import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MobileNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin } = useAuth();

  const navItems = [
    {
      path: '/dashboard',
      icon: '🏠',
      label: 'Home',
      active: location.pathname === '/dashboard'
    },
    {
      path: '/incidents',
      icon: '📋',
      label: 'Incidents',
      active: location.pathname === '/incidents'
    },
    {
      path: '/incidents/create',
      icon: '➕',
      label: 'Report',
      active: location.pathname === '/incidents/create'
    },
    {
      path: '/help',
      icon: '❓',
      label: 'Help',
      active: location.pathname === '/help'
    }
  ];

  // Add admin panel for admin users
  if (isAdmin()) {
    navItems.splice(3, 0, {
      path: '/admin',
      icon: '👑',
      label: 'Admin',
      active: location.pathname === '/admin'
    });
  }

  const navStyle = {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    background: 'white',
    borderTop: '1px solid #e9ecef',
    padding: '8px 0',
    display: 'flex',
    justifyContent: 'space-around',
    zIndex: 1000,
    boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
    paddingBottom: 'max(8px, env(safe-area-inset-bottom))'
  };

  const navItemStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '8px 12px',
    textDecoration: 'none',
    color: '#6c757d',
    fontSize: '12px',
    minWidth: '60px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    borderRadius: '8px'
  };

  const activeNavItemStyle = {
    ...navItemStyle,
    color: '#667eea',
    background: 'rgba(102, 126, 234, 0.1)'
  };

  const iconStyle = {
    fontSize: '20px',
    marginBottom: '4px'
  };

  const labelStyle = {
    fontSize: '11px',
    fontWeight: '500'
  };

  // Don't show on login/register pages
  if (location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/verify-email') {
    return null;
  }

  return (
    <nav style={navStyle}>
      {navItems.map((item) => (
        <div
          key={item.path}
          style={item.active ? activeNavItemStyle : navItemStyle}
          onClick={() => navigate(item.path)}
        >
          <div style={iconStyle}>{item.icon}</div>
          <div style={labelStyle}>{item.label}</div>
        </div>
      ))}
    </nav>
  );
};

export default MobileNav;