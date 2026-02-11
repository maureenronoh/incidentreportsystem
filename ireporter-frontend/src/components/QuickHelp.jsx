import React, { useState } from 'react';

const QuickHelp = ({ tips }) => {
  const [isVisible, setIsVisible] = useState(false);

  const containerStyle = {
    position: 'relative',
    display: 'inline-block'
  };

  const buttonStyle = {
    backgroundColor: 'transparent',
    border: '2px solid #007bff',
    borderRadius: '50%',
    width: '30px',
    height: '30px',
    cursor: 'pointer',
    color: '#007bff',
    fontSize: '14px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s'
  };

  const tooltipStyle = {
    position: 'absolute',
    bottom: '40px',
    right: '0',
    backgroundColor: '#333',
    color: 'white',
    padding: '15px',
    borderRadius: '8px',
    width: '280px',
    fontSize: '14px',
    lineHeight: '1.4',
    zIndex: 1000,
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    visibility: isVisible ? 'visible' : 'hidden',
    opacity: isVisible ? 1 : 0,
    transition: 'all 0.3s'
  };

  const arrowStyle = {
    position: 'absolute',
    top: '100%',
    right: '15px',
    borderWidth: '8px',
    borderStyle: 'solid',
    borderColor: '#333 transparent transparent transparent'
  };

  const titleStyle = {
    fontWeight: 'bold',
    marginBottom: '10px',
    color: '#fff'
  };

  const listStyle = {
    listStyle: 'none',
    padding: 0,
    margin: 0
  };

  const listItemStyle = {
    padding: '4px 0',
    borderBottom: '1px solid #555'
  };

  return (
    <div style={containerStyle}>
      <button
        style={buttonStyle}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
        title="Quick Help"
      >
        ?
      </button>
      
      <div style={tooltipStyle}>
        <div style={titleStyle}>💡 Quick Tips</div>
        <ul style={listStyle}>
          {tips.map((tip, index) => (
            <li key={index} style={listItemStyle}>
              • {tip}
            </li>
          ))}
        </ul>
        <div style={arrowStyle}></div>
      </div>
    </div>
  );
};

export default QuickHelp;