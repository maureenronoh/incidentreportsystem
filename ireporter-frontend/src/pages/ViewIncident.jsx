import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { incidentService } from '../services/incidentService';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const ViewIncident = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIncident();
  }, [id]);

  const fetchIncident = async () => {
    try {
      const response = await incidentService.getIncidentById(id);
      setIncident(response.data);
    } catch (error) {
      console.error('Error fetching incident:', error);
      toast.error('Failed to load incident');
      navigate('/incidents');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      await incidentService.updateIncidentStatus(id, newStatus);
      toast.success('Status updated successfully');
      fetchIncident();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this incident?')) {
      try {
        await incidentService.deleteIncident(id);
        toast.success('Incident deleted successfully');
        navigate('/incidents');
      } catch (error) {
        console.error('Error deleting incident:', error);
        toast.error('Failed to delete incident');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return '#ffc107';
      case 'investigating': return '#007bff';
      case 'resolved': return '#28a745';
      case 'rejected': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getTypeColor = (type) => {
    return type?.toLowerCase() === 'redflag' ? '#dc3545' : '#007bff';
  };

  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
    padding: '20px'
  };

  const cardStyle = {
    maxWidth: '800px',
    margin: '0 auto',
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
    padding: '40px'
  };

  const headerStyle = {
    borderBottom: '2px solid #e9ecef',
    paddingBottom: '20px',
    marginBottom: '30px'
  };

  const titleStyle = {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '15px'
  };

  const badgeStyle = {
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '600',
    color: 'white',
    marginRight: '10px',
    marginBottom: '10px',
    display: 'inline-block'
  };

  const sectionStyle = {
    marginBottom: '25px'
  };

  const sectionTitleStyle = {
    fontSize: '18px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  const contentStyle = {
    color: '#666',
    lineHeight: '1.6',
    fontSize: '16px'
  };

  const buttonGroupStyle = {
    display: 'flex',
    gap: '10px',
    marginTop: '30px',
    flexWrap: 'wrap'
  };

  const buttonStyle = {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-block',
    transition: 'background-color 0.3s'
  };

  const primaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#007bff',
    color: 'white'
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#6c757d',
    color: 'white'
  };

  const warningButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#ffc107',
    color: '#333'
  };

  const dangerButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#dc3545',
    color: 'white'
  };

  const metaInfoStyle = {
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '25px'
  };

  const metaItemStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
    fontSize: '14px'
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
          <p>Loading incident details...</p>
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
            style={primaryButtonStyle}
          >
            Back to Incidents
          </button>
        </div>
      </div>
    );
  }

  const canEdit = user?.id === incident.user_id || isAdmin();

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>{incident.title}</h1>
          <div>
            <span style={{ ...badgeStyle, backgroundColor: getTypeColor(incident.type) }}>
              {incident.type === 'redflag' ? '🚩 Red Flag' : '🔧 Intervention'}
            </span>
            <span style={{ ...badgeStyle, backgroundColor: getStatusColor(incident.status) }}>
              {incident.status?.charAt(0).toUpperCase() + incident.status?.slice(1)}
            </span>
          </div>
        </div>

        <div style={metaInfoStyle}>
          <div style={metaItemStyle}>
            <strong>📍 Location:</strong>
            <span>{incident.location}</span>
          </div>
          <div style={metaItemStyle}>
            <strong>📅 Reported:</strong>
            <span>{new Date(incident.created_at).toLocaleString()}</span>
          </div>
          <div style={metaItemStyle}>
            <strong>👤 Reporter:</strong>
            <span>
              {incident.user_name || 'Anonymous'}
              {isAdmin() && (
                <span style={{
                  marginLeft: '10px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  fontSize: '11px'
                }}>
                  ID: {incident.user_id}
                </span>
              )}
            </span>
          </div>
          {incident.updated_at && incident.updated_at !== incident.created_at && (
            <div style={metaItemStyle}>
              <strong>🔄 Last Updated:</strong>
              <span>{new Date(incident.updated_at).toLocaleString()}</span>
            </div>
          )}
          {isAdmin() && (
            <div style={metaItemStyle}>
              <strong>🛡️ Admin View:</strong>
              <span style={{ color: '#dc3545', fontWeight: '600' }}>
                Full administrative access enabled
              </span>
            </div>
          )}
        </div>

        <div style={sectionStyle}>
          <h3 style={sectionTitleStyle}>
            📝 Description
          </h3>
          <div style={contentStyle}>
            {incident.description}
          </div>
        </div>

        {incident.media_url && (
          <div style={sectionStyle}>
            <h3 style={sectionTitleStyle}>
              📎 Evidence
            </h3>
            <div style={{ textAlign: 'center' }}>
              {incident.media_url.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                <img
                  src={incident.media_url}
                  alt="Incident evidence"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '400px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                  }}
                />
              ) : (
                <video
                  controls
                  style={{
                    maxWidth: '100%',
                    maxHeight: '400px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                  }}
                >
                  <source src={incident.media_url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          </div>
        )}

        {isAdmin() && (
          <div style={{
            ...sectionStyle,
            backgroundColor: '#fff3cd',
            border: '2px solid #ffc107',
            borderRadius: '8px',
            padding: '20px'
          }}>
            <h3 style={{...sectionTitleStyle, color: '#856404'}}>
              👑 Administrative Controls
            </h3>
            <div style={{marginBottom: '15px', color: '#856404', fontSize: '14px'}}>
              {incident.user_id === user?.id ? 
                'You are the owner of this incident' : 
                'You have admin privileges to manage this incident'
              }
            </div>
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center' }}>
              <div>
                <label style={{display: 'block', marginBottom: '5px', fontWeight: '600', color: '#856404'}}>
                  Update Status:
                </label>
                <select
                  value={incident.status}
                  onChange={(e) => handleStatusUpdate(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '4px',
                    border: '2px solid #ffc107',
                    fontSize: '14px',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="pending">⏳ Pending Review</option>
                  <option value="investigating">🔍 Under Investigation</option>
                  <option value="resolved">✅ Resolved</option>
                  <option value="rejected">❌ Rejected</option>
                </select>
              </div>
              <div style={{
                backgroundColor: '#dc3545',
                color: 'white',
                padding: '8px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                ADMIN PRIVILEGES ACTIVE
              </div>
            </div>
          </div>
        )}

        <div style={buttonGroupStyle}>
          <button
            onClick={() => navigate('/incidents')}
            style={secondaryButtonStyle}
            onMouseOver={(e) => e.target.style.backgroundColor = '#5a6268'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#6c757d'}
          >
            ← Back to List
          </button>

          {canEdit && (
            <button
              onClick={() => navigate(`/incidents/${incident.id}/edit`)}
              style={warningButtonStyle}
              onMouseOver={(e) => e.target.style.backgroundColor = '#e0a800'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#ffc107'}
            >
              ✏️ Edit Incident
            </button>
          )}

          {canEdit && (
            <button
              onClick={handleDelete}
              style={dangerButtonStyle}
              onMouseOver={(e) => e.target.style.backgroundColor = '#c82333'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#dc3545'}
            >
              🗑️ Delete Incident
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewIncident;