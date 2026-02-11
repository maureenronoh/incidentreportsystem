import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const PublicNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      path: '/report',
      icon: '🚨',
      label: 'Report',
      active: location.pathname === '/report'
    },
    {
      path: '/login',
      icon: '🔑',
      label: 'Login',
      active: location.pathname === '/login'
    },
    {
      path: '/register',
      icon: '👤',
      label: 'Register',
      active: location.pathname === '/register'
    }
  ];

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
    minWidth: '80px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    borderRadius: '8px'
  };

  const activeNavItemStyle = {
    ...navItemStyle,
    color: '#dc3545',
    background: 'rgba(220, 53, 69, 0.1)'
  };

  const iconStyle = {
    fontSize: '20px',
    marginBottom: '4px'
  };

  const labelStyle = {
    fontSize: '11px',
    fontWeight: '500'
  };

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

export default PublicNav;