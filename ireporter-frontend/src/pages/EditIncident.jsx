import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { incidentService } from '../services/incidentService';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const EditIncident = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [incident, setIncident] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'redflag',
    location: '',
    media: null
  });

  useEffect(() => {
    fetchIncident();
  }, [id]);

  const fetchIncident = async () => {
    try {
      const response = await incidentService.getIncidentById(id);
      const incidentData = response.data;
      
      // Check if user can edit this incident
      if (incidentData.user_id !== user?.id && !isAdmin()) {
        toast.error('You can only edit your own incidents');
        navigate('/incidents');
        return;
      }

      setIncident(incidentData);
      setFormData({
        title: incidentData.title || '',
        description: incidentData.description || '',
        type: incidentData.type || 'redflag',
        location: incidentData.location || '',
        media: null
      });
    } catch (error) {
      console.error('Error fetching incident:', error);
      toast.error('Failed to load incident');
      navigate('/incidents');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    if (e.target.name === 'media') {
      setFormData({
        ...formData,
        media: e.target.files[0]
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('type', formData.type);
      submitData.append('location', formData.location);
      
      if (formData.media) {
        submitData.append('media', formData.media);
      }

      await incidentService.updateIncident(id, submitData);
      toast.success('Incident updated successfully!');
      navigate(`/incidents/${id}`);
    } catch (error) {
      console.error('Error updating incident:', error);
      toast.error(error.response?.data?.error || 'Failed to update incident');
    } finally {
      setSaving(false);
    }
  };

  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
    padding: '20px'
  };

  const cardStyle = {
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
    padding: '40px'
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '30px'
  };

  const titleStyle = {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '10px'
  };

  const subtitleStyle = {
    color: '#666',
    fontSize: '16px'
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
    marginBottom: '8px',
    color: '#333',
    fontSize: '14px',
    fontWeight: '600'
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
    minHeight: '100px',
    resize: 'vertical'
  };

  const selectStyle = {
    ...inputStyle,
    cursor: 'pointer'
  };

  const buttonGroupStyle = {
    display: 'flex',
    gap: '15px',
    marginTop: '20px'
  };

  const buttonStyle = {
    flex: 1,
    padding: '12px',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s'
  };

  const saveButtonStyle = {
    ...buttonStyle,
    backgroundColor: saving ? '#ccc' : '#28a745',
    color: 'white'
  };

  const cancelButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#6c757d',
    color: 'white'
  };

  const typeDescriptions = {
    redflag: 'Corruption, bribery, or other illegal activities',
    intervention: 'Infrastructure issues, public service problems'
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={{ ...cardStyle, textAlign: 'center' }}>
          <div style={{
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #667eea',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            animation: 'spin 2s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p>Loading incident...</p>
        </div>
      </div>
    );
  }

  if (!incident) {
    return (
      <div style={containerStyle}>
        <div style={{ ...cardStyle, textAlign: 'center' }}>
          <h2>Incident not found</h2>
          <button
            onClick={() => navigate('/incidents')}
            style={cancelButtonStyle}
          >
            Back to Incidents
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>✏️ Edit Incident</h1>
          <p style={subtitleStyle}>Update incident information</p>
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
              placeholder="Brief description of the incident"
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
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
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
            >
              <option value="redflag">🚩 Red Flag</option>
              <option value="intervention">🔧 Intervention</option>
            </select>
            <small style={{ color: '#666', marginTop: '5px', fontSize: '12px' }}>
              {typeDescriptions[formData.type]}
            </small>
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
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
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
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
            />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle} htmlFor="media">Update Evidence (Photo/Video)</label>
            <input
              id="media"
              name="media"
              type="file"
              accept="image/*,video/*"
              onChange={handleChange}
              style={inputStyle}
            />
            <small style={{ color: '#666', marginTop: '5px', fontSize: '12px' }}>
              Optional: Upload new photos or videos to replace existing evidence
            </small>
            {incident.media_url && (
              <div style={{ marginTop: '10px' }}>
                <small style={{ color: '#666' }}>Current evidence:</small>
                <div style={{ marginTop: '5px' }}>
                  {incident.media_url.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                    <img
                      src={incident.media_url}
                      alt="Current evidence"
                      style={{
                        maxWidth: '200px',
                        maxHeight: '150px',
                        borderRadius: '4px',
                        border: '1px solid #e9ecef'
                      }}
                    />
                  ) : (
                    <video
                      controls
                      style={{
                        maxWidth: '200px',
                        maxHeight: '150px',
                        borderRadius: '4px',
                        border: '1px solid #e9ecef'
                      }}
                    >
                      <source src={incident.media_url} type="video/mp4" />
                    </video>
                  )}
                </div>
              </div>
            )}
          </div>

          <div style={buttonGroupStyle}>
            <button
              type="button"
              onClick={() => navigate(`/incidents/${id}`)}
              style={cancelButtonStyle}
              onMouseOver={(e) => e.target.style.backgroundColor = '#5a6268'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#6c757d'}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              style={saveButtonStyle}
              onMouseOver={(e) => !saving && (e.target.style.backgroundColor = '#218838')}
              onMouseOut={(e) => !saving && (e.target.style.backgroundColor = '#28a745')}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditIncident;