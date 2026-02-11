import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { userService } from '../services/userService';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState('');
  const [resendEmail, setResendEmail] = useState('');
  const [resending, setResending] = useState(false);

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (token) {
      verifyEmailToken(token);
    } else {
      setVerifying(false);
      setError('No verification token provided');
    }
  }, [searchParams]);

  const verifyEmailToken = async (token) => {
    try {
      const response = await userService.verifyEmail(token);
      
      if (response.data.token && response.data.user) {
        // Auto-login the user
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        setVerified(true);
        toast.success('Email verified successfully! Welcome to iReporter!');
        
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      }
    } catch (error) {
      console.error('Email verification failed:', error);
      setError(error.response?.data?.message || 'Email verification failed');
    } finally {
      setVerifying(false);
    }
  };

  const handleResendVerification = async (e) => {
    e.preventDefault();
    
    if (!resendEmail.trim()) {
      toast.error('Please enter your email address');
      return;
    }

    setResending(true);
    
    try {
      await userService.resendVerification(resendEmail);
      toast.success('Verification email sent! Please check your inbox.');
      setResendEmail('');
    } catch (error) {
      console.error('Resend verification failed:', error);
      toast.error(error.response?.data?.error || 'Failed to send verification email');
    } finally {
      setResending(false);
    }
  };

  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px'
  };

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
    padding: '40px',
    maxWidth: '500px',
    width: '100%',
    textAlign: 'center'
  };

  const titleStyle = {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '20px'
  };

  const messageStyle = {
    fontSize: '16px',
    color: '#666',
    marginBottom: '30px',
    lineHeight: '1.6'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    border: '2px solid #e1e5e9',
    borderRadius: '6px',
    fontSize: '16px',
    marginBottom: '15px',
    boxSizing: 'border-box'
  };

  const buttonStyle = {
    width: '100%',
    padding: '12px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginBottom: '15px'
  };

  const linkStyle = {
    color: '#667eea',
    textDecoration: 'none',
    fontWeight: '600'
  };

  const spinnerStyle = {
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #667eea',
    borderRadius: '50%',
    width: '50px',
    height: '50px',
    animation: 'spin 2s linear infinite',
    margin: '0 auto 20px'
  };

  if (verifying) {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <div style={spinnerStyle}></div>
          <h1 style={titleStyle}>Verifying Email...</h1>
          <p style={messageStyle}>Please wait while we verify your email address.</p>
        </div>
      </div>
    );
  }

  if (verified) {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <div style={{ fontSize: '60px', marginBottom: '20px' }}>✅</div>
          <h1 style={titleStyle}>Email Verified!</h1>
          <p style={messageStyle}>
            Your email has been successfully verified. You are now logged in and will be redirected to your dashboard.
          </p>
          <div style={{ fontSize: '14px', color: '#999' }}>
            Redirecting in a few seconds...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <div style={{ fontSize: '60px', marginBottom: '20px' }}>❌</div>
          <h1 style={titleStyle}>Verification Failed</h1>
          <p style={messageStyle}>{error}</p>
          
          <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
            <h3 style={{ marginBottom: '15px', color: '#333' }}>Need a new verification email?</h3>
            <form onSubmit={handleResendVerification}>
              <input
                type="email"
                placeholder="Enter your email address"
                value={resendEmail}
                onChange={(e) => setResendEmail(e.target.value)}
                style={inputStyle}
                required
              />
              <button
                type="submit"
                disabled={resending}
                style={{
                  ...buttonStyle,
                  backgroundColor: resending ? '#6c757d' : '#007bff'
                }}
              >
                {resending ? 'Sending...' : 'Resend Verification Email'}
              </button>
            </form>
          </div>
          
          <div style={{ marginTop: '20px' }}>
            <a href="/login" style={linkStyle}>← Back to Login</a>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default VerifyEmail;