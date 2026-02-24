import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { incidentService } from '../services/incidentService';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const IncidentList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin, user } = useAuth();
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Get filter from URL query parameter
    const params = new URLSearchParams(location.search);
    const filterParam = params.get('filter');
    if (filterParam) {
      setFilter(filterParam);
    }
  }, [location.search]);

  useEffect(() => {
    fetchIncidents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchIncidents = async () => {
    try {
      console.log('Fetching incidents...');
      const response = await incidentService.getAllIncidents();
      console.log('Incidents API response:', response);
      
      let allIncidents = response.data || response; // Handle both response.data and direct response
      
      console.log('All incidents:', allIncidents);
      
      // If not admin, filter to show only user's own incidents
      if (!isAdmin() && user) {
        allIncidents = allIncidents.filter(incident => {
          // Handle both ObjectId string and regular ID comparison
          const incidentUserId = incident.user_id;
          const currentUserId = user.id;
          
          console.log('Comparing user IDs:', { incidentUserId, currentUserId });
          
          return incidentUserId === currentUserId || 
                 String(incidentUserId) === String(currentUserId);
        });
        console.log('Filtered incidents for user:', allIncidents);
      }
      
      setIncidents(allIncidents);
    } catch (error) {
      console.error('Error fetching incidents:', error);
      console.error('Error response:', error.response);
      toast.error('Failed to load incidents');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this incident?')) {
      try {
        await incidentService.deleteIncident(id);
        toast.success('Incident deleted successfully');
        fetchIncidents();
      } catch (error) {
        console.error('Error deleting incident:', error);
        toast.error('Failed to delete incident');
      }
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await incidentService.updateIncidentStatus(id, newStatus);
      toast.success('Status updated successfully');
      fetchIncidents();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
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

  const filteredIncidents = incidents.filter(incident => {
    if (filter === 'all') return true;
    return incident.type?.toLowerCase() === filter || incident.status?.toLowerCase() === filter;
  });

  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
    padding: '20px'
  };

  const cardStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
    padding: '30px'
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    flexWrap: 'wrap',
    gap: '15px'
  };

  const titleStyle = {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#333',
    margin: 0
  };

  const buttonStyle = {
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-block'
  };

  const filterStyle = {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
    flexWrap: 'wrap'
  };

  const filterButtonStyle = {
    padding: '8px 16px',
    border: '2px solid #667eea',
    borderRadius: '20px',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.3s'
  };

  const activeFilterStyle = {
    ...filterButtonStyle,
    backgroundColor: '#667eea',
    color: 'white'
  };

  const inactiveFilterStyle = {
    ...filterButtonStyle,
    backgroundColor: 'white',
    color: '#667eea'
  };

  const incidentCardStyle = {
    border: '1px solid #e9ecef',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '15px',
    backgroundColor: '#f8f9fa'
  };

  const incidentHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '15px',
    flexWrap: 'wrap',
    gap: '10px'
  };

  const badgeStyle = {
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
    color: 'white'
  };

  const actionButtonStyle = {
    padding: '6px 12px',
    border: 'none',
    borderRadius: '4px',
    fontSize: '12px',
    cursor: 'pointer',
    marginRight: '8px',
    marginBottom: '5px'
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
          <p>Loading incidents...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>
            {isAdmin() ? '🛡️ Admin: All System Incidents' : '📋 My Incidents'}
          </h1>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => navigate('/dashboard')}
              style={{ ...buttonStyle, backgroundColor: '#6c757d' }}
            >
              ← Back to Dashboard
            </button>
            <button
              onClick={() => navigate('/incidents/create')}
              style={buttonStyle}
            >
              + Report New Incident
            </button>
            {isAdmin() && (
              <div style={{
                backgroundColor: '#dc3545',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}>
                👑 ADMIN VIEW
              </div>
            )}
          </div>
        </div>

        {/* Active Filter Display */}
        {filter !== 'all' && (
          <div style={{
            backgroundColor: '#e7f3ff',
            border: '2px solid #667eea',
            borderRadius: '8px',
            padding: '12px 20px',
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '16px', fontWeight: '600', color: '#667eea' }}>
                🔍 Filtered by: {
                  filter === 'redflag' ? '🚩 Red Flag' :
                  filter === 'intervention' ? '🔧 Intervention' :
                  filter.charAt(0).toUpperCase() + filter.slice(1)
                }
              </span>
              <span style={{ fontSize: '14px', color: '#666' }}>
                ({filteredIncidents.length} {filteredIncidents.length === 1 ? 'incident' : 'incidents'})
              </span>
            </div>
            <button
              onClick={() => setFilter('all')}
              style={{
                padding: '6px 12px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              ✕ Clear Filter
            </button>
          </div>
        )}

        <div style={filterStyle}>
          {['all', 'redflag', 'intervention', 'pending', 'investigating', 'resolved', 'rejected'].map(filterType => {
            const count = filterType === 'all' 
              ? incidents.length 
              : incidents.filter(i => i.type?.toLowerCase() === filterType || i.status?.toLowerCase() === filterType).length;
            
            return (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                style={filter === filterType ? activeFilterStyle : inactiveFilterStyle}
              >
                {filterType === 'all' ? `All (${count})` : 
                 filterType === 'redflag' ? `🚩 Red Flag (${count})` :
                 filterType === 'intervention' ? `🔧 Intervention (${count})` :
                 `${filterType.charAt(0).toUpperCase() + filterType.slice(1)} (${count})`}
              </button>
            );
          })}
        </div>

        {filteredIncidents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            <p style={{ fontSize: '18px' }}>No incidents found</p>
            <button
              onClick={() => navigate('/incidents/create')}
              style={buttonStyle}
            >
              Report Your First Incident
            </button>
          </div>
        ) : (
          filteredIncidents.map(incident => (
            <div key={incident.id} style={incidentCardStyle}>
              <div style={incidentHeaderStyle}>
                <div>
                  <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>{incident.title}</h3>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <span style={{ ...badgeStyle, backgroundColor: getTypeColor(incident.type) }}>
                      {incident.type === 'redflag' ? '🚩 Red Flag' : '🔧 Intervention'}
                    </span>
                    <span style={{ ...badgeStyle, backgroundColor: getStatusColor(incident.status) }}>
                      {incident.status?.charAt(0).toUpperCase() + incident.status?.slice(1)}
                    </span>
                  </div>
                </div>
                <div style={{ fontSize: '12px', color: '#666', textAlign: 'right' }}>
                  <div>📍 {incident.location}</div>
                  <div>📅 {new Date(incident.created_at).toLocaleDateString()}</div>
                  {isAdmin() && (
                    <div style={{
                      marginTop: '5px',
                      fontSize: '11px',
                      color: '#007bff',
                      fontWeight: '600'
                    }}>
                      👤 Reporter: {incident.user_name || `User ${incident.user_id}`}
                    </div>
                  )}
                </div>
              </div>

              <p style={{ color: '#666', marginBottom: '15px', lineHeight: '1.5' }}>
                {incident.description}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                <button
                  onClick={() => navigate(`/incidents/${incident.id}`)}
                  style={{ ...actionButtonStyle, backgroundColor: '#007bff', color: 'white' }}
                >
                  👁️ View
                </button>
                
                {/* Edit button - only for incident owner or admin */}
                {((incident.user_id === user?.id || String(incident.user_id) === String(user?.id)) || isAdmin()) && (
                  <button
                    onClick={() => navigate(`/incidents/${incident.id}/edit`)}
                    style={{ ...actionButtonStyle, backgroundColor: '#ffc107', color: '#333' }}
                  >
                    ✏️ Edit
                  </button>
                )}

                {/* Admin-only status update */}
                {isAdmin() && (
                  <select
                    value={incident.status}
                    onChange={(e) => handleStatusUpdate(incident.id, e.target.value)}
                    style={{ 
                      ...actionButtonStyle, 
                      backgroundColor: '#17a2b8', 
                      color: 'white',
                      cursor: 'pointer',
                      border: 'none'
                    }}
                  >
                    <option value="pending">⏳ Pending</option>
                    <option value="investigating">🔍 Investigating</option>
                    <option value="resolved">✅ Resolved</option>
                    <option value="rejected">❌ Rejected</option>
                  </select>
                )}

                {/* Delete button - only for incident owner or admin */}
                {((incident.user_id === user?.id || String(incident.user_id) === String(user?.id)) || isAdmin()) && (
                  <button
                    onClick={() => handleDelete(incident.id)}
                    style={{ ...actionButtonStyle, backgroundColor: '#dc3545', color: 'white' }}
                  >
                    🗑️ Delete
                  </button>
                )}

                {/* Admin badge for actions */}
                {isAdmin() && (incident.user_id !== user?.id && String(incident.user_id) !== String(user?.id)) && (
                  <div style={{
                    ...actionButtonStyle,
                    backgroundColor: '#6f42c1',
                    color: 'white',
                    fontSize: '10px',
                    cursor: 'default'
                  }}>
                    👑 ADMIN
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default IncidentList;