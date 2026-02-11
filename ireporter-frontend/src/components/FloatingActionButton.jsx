import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const FloatingActionButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(false);

  // Don't show FAB on certain pages
  const hiddenPaths = ['/login', '/register', '/verify-email', '/incidents/create', '/help'];
  if (hiddenPaths.includes(location.pathname)) {
    return null;
  }

  const fabStyle = {
    position: 'fixed',
    bottom: '90px', // Above bottom nav
    right: '20px',
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
    zIndex: 999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    paddingBottom: 'max(0px, env(safe-area-inset-bottom))'
  };

  const fabHoverStyle = {
    ...fabStyle,
    transform: 'scale(1.1)',
    boxShadow: '0 6px 16px rgba(102, 126, 234, 0.5)'
  };

  return (
    <button
      style={isHovered ? fabHoverStyle : fabStyle}
      onClick={() => navigate('/incidents/create')}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title="Report New Incident"
      aria-label="Report New Incident"
    >
      ➕
    </button>
  );
};

export default FloatingActionButton;