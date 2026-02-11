import React, { useState } from 'react';

const HelpTooltip = ({ text, children, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);

  const tooltipStyle = {
    position: 'relative',
    display: 'inline-block'
  };

  const tooltipTextStyle = {
    visibility: isVisible ? 'visible' : 'hidden',
    opacity: isVisible ? 1 : 0,
    width: '200px',
    backgroundColor: '#333',
    color: 'white',
    textAlign: 'center',
    borderRadius: '6px',
    padding: '8px 12px',
    position: 'absolute',
    zIndex: 1000,
    fontSize: '14px',
    lineHeight: '1.4',
    transition: 'opacity 0.3s',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
    ...(position === 'top' && {
      bottom: '125%',
      left: '50%',
      marginLeft: '-100px'
    }),
    ...(position === 'bottom' && {
      top: '125%',
      left: '50%',
      marginLeft: '-100px'
    }),
    ...(position === 'left' && {
      top: '50%',
      right: '125%',
      marginTop: '-20px'
    }),
    ...(position === 'right' && {
      top: '50%',
      left: '125%',
      marginTop: '-20px'
    })
  };

  const arrowStyle = {
    position: 'absolute',
    ...(position === 'top' && {
      top: '100%',
      left: '50%',
      marginLeft: '-5px',
      borderWidth: '5px',
      borderStyle: 'solid',
      borderColor: '#333 transparent transparent transparent'
    }),
    ...(position === 'bottom' && {
      bottom: '100%',
      left: '50%',
      marginLeft: '-5px',
      borderWidth: '5px',
      borderStyle: 'solid',
      borderColor: 'transparent transparent #333 transparent'
    }),
    ...(position === 'left' && {
      top: '50%',
      left: '100%',
      marginTop: '-5px',
      borderWidth: '5px',
      borderStyle: 'solid',
      borderColor: 'transparent transparent transparent #333'
    }),
    ...(position === 'right' && {
      top: '50%',
      right: '100%',
      marginTop: '-5px',
      borderWidth: '5px',
      borderStyle: 'solid',
      borderColor: 'transparent #333 transparent transparent'
    })
  };

  return (
    <div
      style={tooltipStyle}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <div style={tooltipTextStyle}>
        {text}
        <div style={arrowStyle}></div>
      </div>
    </div>
  );
};

export default HelpTooltip;