import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HelpButton = () => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const buttonStyle = {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0,123,255,0.3)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease'
  };

  const buttonHoverStyle = {
    ...buttonStyle,
    backgroundColor: '#0056b3',
    transform: 'scale(1.1)',
    boxShadow: '0 6px 16px rgba(0,123,255,0.4)'
  };

  return (
    <button
      style={isHovered ? buttonHoverStyle : buttonStyle}
      onClick={() => navigate('/help')}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title="Get Help & Documentation"
    >
      ❓
    </button>
  );
};

export default HelpButton;