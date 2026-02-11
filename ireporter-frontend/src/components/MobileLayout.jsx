import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import MobileNav from './MobileNav';
import PublicNav from './PublicNav';
import FloatingActionButton from './FloatingActionButton';
import NotificationBell from './NotificationBell';

const MobileLayout = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [isMobile, setIsMobile] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Handle online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const layoutStyle = {
    minHeight: '100vh',
    paddingBottom: isMobile ? '80px' : '0', // Space for mobile nav
    position: 'relative'
  };

  const offlineBannerStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    background: '#dc3545',
    color: 'white',
    padding: '10px',
    textAlign: 'center',
    fontSize: '14px',
    zIndex: 2000
  };

  const contentStyle = {
    paddingTop: !isOnline ? '50px' : '0' // Space for offline banner
  };

  return (
    <div style={layoutStyle}>
      {!isOnline && (
        <div style={offlineBannerStyle}>
          📡 You're offline. Some features may not work.
        </div>
      )}
      
      {/* Notification Bell - Fixed position for authenticated users */}
      {isAuthenticated && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 1500
        }}>
          <NotificationBell />
        </div>
      )}
      
      <div style={contentStyle}>
        {children}
      </div>
      
      {isMobile && isAuthenticated && <FloatingActionButton />}
      {isMobile && isAuthenticated && <MobileNav />}
      {isMobile && !isAuthenticated && <PublicNav />}
    </div>
  );
};

export default MobileLayout;