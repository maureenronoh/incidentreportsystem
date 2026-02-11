import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import QuickHelp from '../components/QuickHelp';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [anonymousLoading, setAnonymousLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'anonymous'
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [anonymousData, setAnonymousData] = useState({
    title: '',
    description: '',
    type: 'redflag',
    location: '',
    reporter_name: '',
    reporter_email: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAnonymousChange = (e) => {
    setAnonymousData({
      ...anonymousData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const result = await login(formData.email, formData.password);
    setLoading(false);
    
    if (result.success) {
      toast.success('Login successful!');
      navigate('/dashboard');
    } else {
      toast.error(result.error);
    }
  };

  const handleAnonymousSubmit = async (e) => {
    e.preventDefault();
    setAnonymousLoading(true);

    try {
      const response = await fetch('http://localhost:5001/api/incidents/anonymous', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(anonymousData)
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Incident reported successfully! Thank you for your report.');
        setAnonymousData({
          title: '',
          description: '',
          type: 'redflag',
          location: '',
          reporter_name: '',
          reporter_email: ''
        });
        
        setTimeout(() => {
          toast.info('To track your incident progress, please register/login with the email you provided.');
        }, 2000);
      } else {
        toast.error(data.error || 'Failed to submit report');
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      toast.error('Failed to submit report. Please try again.');
    } finally {
      setAnonymousLoading(false);
    }
  };

  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
    padding: '20px'
  };

  const cardStyle = {
    maxWidth: '500px',
    width: '100%',
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
    overflow: 'hidden'
  };

  const tabsStyle = {
    display: 'flex',
    backgroundColor: '#f8f9fa'
  };

  const tabStyle = {
    flex: 1,
    padding: '15px',
    textAlign: 'center',
    cursor: 'pointer',
    border: 'none',
    backgroundColor: 'transparent',
    fontSize: '16px',
    fontWeight: '600',
    transition: 'all 0.3s'
  };

  const activeTabStyle = {
    ...tabStyle,
    backgroundColor: 'white',
    color: '#667eea',
    borderBottom: '3px solid #667eea'
  };

  const anonymousActiveTabStyle = {
    ...tabStyle,
    backgroundColor: 'white',
    color: '#dc3545',
    borderBottom: '3px solid #dc3545'
  };

  const contentStyle = {
    padding: '40px'
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '30px'
  };

  const iconStyle = {
    width: '60px',
    height: '60px',
    backgroundColor: activeTab === 'login' ? '#667eea' : '#dc3545',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px',
    fontSize: '24px',
    color: 'white'
  };

  const titleStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '10px'
  };

  const subtitleStyle = {
    color: '#666',
    fontSize: '14px'
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  };

  const inputGroupStyle = {
    display: 'flex',
    flexDirection: 'column'
  };

  const labelStyle = {
    marginBottom: '5px',
    color: '#333',
    fontSize: '14px',
    fontWeight: '500'
  };

  const inputStyle = {
    padding: '12px',
    border: '2px solid #e1e5e9',
    borderRadius: '6px',
    fontSize: '16px',
    transition: 'border-color 0.3s'
  };

  const textareaStyle = {
    ...inputStyle,
    minHeight: '80px',
    resize: 'vertical'
  };

  const selectStyle = {
    ...inputStyle,
    cursor: 'pointer'
  };

  const buttonStyle = {
    padding: '12px 24px',
    backgroundColor: loading || anonymousLoading ? '#ccc' : (activeTab === 'login' ? '#667eea' : '#dc3545'),
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: loading || anonymousLoading ? 'not-allowed' : 'pointer',
    transition: 'background-color 0.3s',
    marginTop: '10px'
  };

  const linkStyle = {
    color: '#667eea',
    textDecoration: 'none',
    fontSize: '14px',
    textAlign: 'center',
    marginTop: '15px',
    display: 'block'
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        {/* Tab Navigation */}
        <div style={tabsStyle}>
          <button
            style={activeTab === 'login' ? activeTabStyle : tabStyle}
            onClick={() => setActiveTab('login')}
          >
            🔐 Login
          </button>
          <button
            style={activeTab === 'anonymous' ? anonymousActiveTabStyle : tabStyle}
            onClick={() => setActiveTab('anonymous')}
          >
            🚨 Report Anonymously
          </button>
        </div>

        <div style={contentStyle}>
          {activeTab === 'login' ? (
            // Login Form
            <>
              <div style={headerStyle}>
                <div style={iconStyle}>
                  🔐
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                  <h1 style={titleStyle}>Welcome Back</h1>
                  <QuickHelp tips={[
                    'Enter your registered email address',
                    'Use the password you created during registration',
                    'First user becomes admin automatically',
                    'Contact admin if you forgot your password'
                  ]} />
                </div>
                <p style={subtitleStyle}>Sign in to your account</p>
              </div>

              <form style={formStyle} onSubmit={handleSubmit}>
                <div style={inputGroupStyle}>
                  <label style={labelStyle} htmlFor="email">Email Address</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    style={inputStyle}
                    placeholder="Enter your email"
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
                  />
                </div>

                <div style={inputGroupStyle}>
                  <label style={labelStyle} htmlFor="password">Password</label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    style={inputStyle}
                    placeholder="Enter your password"
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={buttonStyle}
                  onMouseOver={(e) => !loading && (e.target.style.backgroundColor = '#5a6fd8')}
                  onMouseOut={(e) => !loading && (e.target.style.backgroundColor = '#667eea')}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>

                <Link to="/register" style={linkStyle}>
                  Don't have an account? Create one here
                </Link>
              </form>
            </>
          ) : (
            // Anonymous Reporting Form
            <>
              <div style={headerStyle}>
                <div style={iconStyle}>
                  🚨
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                  <h1 style={titleStyle}>Anonymous Report</h1>
                  <QuickHelp tips={[
                    'Report incidents without creating an account',
                    'Provide your email to track progress later',
                    'All reports are taken seriously and investigated',
                    'Register/login later to see your incident status'
                  ]} />
                </div>
                <p style={subtitleStyle}>Report incidents safely and anonymously</p>
              </div>

              <form style={formStyle} onSubmit={handleAnonymousSubmit}>
                <div style={inputGroupStyle}>
                  <label style={labelStyle} htmlFor="title">Incident Title *</label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    required
                    value={anonymousData.title}
                    onChange={handleAnonymousChange}
                    style={inputStyle}
                    placeholder="Brief title describing the incident"
                    onFocus={(e) => e.target.style.borderColor = '#dc3545'}
                    onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
                  />
                </div>

                <div style={inputGroupStyle}>
                  <label style={labelStyle} htmlFor="type">Incident Type *</label>
                  <select
                    id="type"
                    name="type"
                    required
                    value={anonymousData.type}
                    onChange={handleAnonymousChange}
                    style={selectStyle}
                    onFocus={(e) => e.target.style.borderColor = '#dc3545'}
                    onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
                  >
                    <option value="redflag">🚩 Red Flag (Corruption)</option>
                    <option value="intervention">🛠️ Intervention (Call for Action)</option>
                  </select>
                </div>

                <div style={inputGroupStyle}>
                  <label style={labelStyle} htmlFor="location">Location *</label>
                  <input
                    id="location"
                    name="location"
                    type="text"
                    required
                    value={anonymousData.location}
                    onChange={handleAnonymousChange}
                    style={inputStyle}
                    placeholder="Where did this incident occur?"
                    onFocus={(e) => e.target.style.borderColor = '#dc3545'}
                    onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
                  />
                </div>

                <div style={inputGroupStyle}>
                  <label style={labelStyle} htmlFor="description">Description *</label>
                  <textarea
                    id="description"
                    name="description"
                    required
                    value={anonymousData.description}
                    onChange={handleAnonymousChange}
                    style={textareaStyle}
                    placeholder="Provide detailed information about the incident..."
                    onFocus={(e) => e.target.style.borderColor = '#dc3545'}
                    onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
                  />
                </div>

                <div style={inputGroupStyle}>
                  <label style={labelStyle} htmlFor="reporter_name">Your Name (Optional)</label>
                  <input
                    id="reporter_name"
                    name="reporter_name"
                    type="text"
                    value={anonymousData.reporter_name}
                    onChange={handleAnonymousChange}
                    style={inputStyle}
                    placeholder="Leave blank to remain completely anonymous"
                    onFocus={(e) => e.target.style.borderColor = '#dc3545'}
                    onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
                  />
                </div>

                <div style={inputGroupStyle}>
                  <label style={labelStyle} htmlFor="reporter_email">Your Email (Optional)</label>
                  <input
                    id="reporter_email"
                    name="reporter_email"
                    type="email"
                    value={anonymousData.reporter_email}
                    onChange={handleAnonymousChange}
                    style={inputStyle}
                    placeholder="Provide email to track progress (recommended)"
                    onFocus={(e) => e.target.style.borderColor = '#dc3545'}
                    onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
                  />
                  <small style={{ color: '#666', fontSize: '12px', marginTop: '5px' }}>
                    If you provide an email, you can register/login later to track your incident's progress
                  </small>
                </div>

                <button
                  type="submit"
                  disabled={anonymousLoading}
                  style={buttonStyle}
                  onMouseOver={(e) => !anonymousLoading && (e.target.style.backgroundColor = '#c82333')}
                  onMouseOut={(e) => !anonymousLoading && (e.target.style.backgroundColor = '#dc3545')}
                >
                  {anonymousLoading ? 'Submitting Report...' : 'Submit Anonymous Report'}
                </button>

                <Link to="/register" style={linkStyle}>
                  Want to create an account? Register here
                </Link>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;