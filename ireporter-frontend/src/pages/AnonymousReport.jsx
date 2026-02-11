import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import QuickHelp from '../components/QuickHelp';

const AnonymousReport = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/incidents/anonymous', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Incident reported successfully! Thank you for your report.');
        setFormData({
          title: '',
          description: '',
          type: 'redflag',
          location: '',
          reporter_name: '',
          reporter_email: ''
        });
        
        // Show success message with tracking info
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
      setLoading(false);
    }
  };

  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const cardStyle = {
    maxWidth: '600px',
    width: '100%',
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
    padding: '40px'
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '30px'
  };

  const iconStyle = {
    width: '60px',
    height: '60px',
    backgroundColor: '#dc3545',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px',
    fontSize: '24px',
    color: 'white'
  };

  const titleStyle = {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '10px'
  };

  const subtitleStyle = {
    color: '#666',
    fontSize: '16px',
    marginBottom: '20px'
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
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
    minHeight: '120px',
    resize: 'vertical'
  };

  const selectStyle = {
    ...inputStyle,
    cursor: 'pointer'
  };

  const buttonStyle = {
    padding: '12px 24px',
    backgroundColor: loading ? '#ccc' : '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: loading ? 'not-allowed' : 'pointer',
    transition: 'background-color 0.3s'
  };

  const linkStyle = {
    color: '#667eea',
    textDecoration: 'none',
    fontSize: '14px',
    textAlign: 'center',
    marginTop: '20px',
    display: 'block'
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={headerStyle}>
          <div style={iconStyle}>
            🚨
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <h1 style={titleStyle}>Anonymous Report</h1>
            <QuickHelp tips={[
              'You can report incidents without creating an account',
              'Provide your email to track progress later',
              'All reports are taken seriously and investigated',
              'Register/login later to see your incident status'
            ]} />
          </div>
          <p style={subtitleStyle}>Report incidents safely and anonymously</p>
        </div>

        <form style={formStyle} onSubmit={handleSubmit}>
          <div style={inputGroupStyle}>
            <label style={labelStyle} htmlFor="title">Incident Title *</label>
            <input
              id="title"
              name="title"
              type="text"
              required
              value={formData.title}
              onChange={handleChange}
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
              value={formData.type}
              onChange={handleChange}
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
              value={formData.location}
              onChange={handleChange}
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
              value={formData.description}
              onChange={handleChange}
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
              value={formData.reporter_name}
              onChange={handleChange}
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
              value={formData.reporter_email}
              onChange={handleChange}
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
            disabled={loading}
            style={buttonStyle}
            onMouseOver={(e) => !loading && (e.target.style.backgroundColor = '#c82333')}
            onMouseOut={(e) => !loading && (e.target.style.backgroundColor = '#dc3545')}
          >
            {loading ? 'Submitting Report...' : 'Submit Anonymous Report'}
          </button>

          <Link to="/login" style={linkStyle}>
            Have an account? Login to track your reports
          </Link>
          
          <Link to="/register" style={linkStyle}>
            Want to create an account? Register here
          </Link>
        </form>
      </div>
    </div>
  );
};

export default AnonymousReport;