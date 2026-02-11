import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { incidentService } from '../services/incidentService';
import { toast } from 'react-toastify';

// Add keyframe animation for spinner
const spinnerAnimation = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// Inject the animation into the document
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = spinnerAnimation;
  document.head.appendChild(style);
}

const Dashboard = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    investigating: 0,
    resolved: 0,
    rejected: 0,
    redflags: 0,
    interventions: 0
  });
  const [recentIncidents, setRecentIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await incidentService.getAllIncidents();
      const incidents = response.data;
      
      // Calculate statistics
      const newStats = {
        total: incidents.length,
        pending: incidents.filter(i => i.status === 'pending').length,
        investigating: incidents.filter(i => i.status === 'investigating').length,
        resolved: incidents.filter(i => i.status === 'resolved').length,
        rejected: incidents.filter(i => i.status === 'rejected').length,
        redflags: incidents.filter(i => i.type === 'redflag').length,
        interventions: incidents.filter(i => i.type === 'intervention').length
      };
      
      setStats(newStats);
      setRecentIncidents(incidents.slice(0, 5)); // Get latest 5 incidents
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
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
    padding: '20px 20px 60px 20px'
  };

  const cardStyle = {
    maxWidth: '1400px',
    margin: '0 auto',
    backgroundColor: 'white',
    borderRadius: '15px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
    padding: '30px',
    overflow: 'hidden'
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '30px',
    paddingBottom: '20px',
    borderBottom: '2px solid #f0f0f0'
  };

  const titleStyle = {
    fontSize: '36px',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '10px'
  };

  const welcomeStyle = {
    fontSize: '20px',
    color: '#555',
    marginBottom: '8px'
  };

  const userInfoStyle = {
    fontSize: '14px',
    color: '#888',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '15px',
    flexWrap: 'wrap'
  };

  const statsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '40px'
  };

  const statCardStyle = {
    backgroundColor: '#f8f9fa',
    padding: '25px',
    borderRadius: '10px',
    textAlign: 'center',
    border: '2px solid #e9ecef',
    transition: 'transform 0.3s, box-shadow 0.3s',
    cursor: 'pointer'
  };

  const statNumberStyle = {
    fontSize: '36px',
    fontWeight: 'bold',
    marginBottom: '8px'
  };

  const statLabelStyle = {
    fontSize: '14px',
    color: '#666',
    fontWeight: '600'
  };

  const quickActionsStyle = {
    marginBottom: '40px'
  };

  const sectionTitleStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '20px',
    textAlign: 'center'
  };

  const actionsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '15px'
  };

  const actionButtonStyle = {
    padding: '20px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px'
  };

  const recentIncidentsStyle = {
    marginBottom: '30px'
  };

  const incidentItemStyle = {
    backgroundColor: '#f8f9fa',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '10px',
    border: '1px solid #e9ecef'
  };

  const incidentHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '10px',
    flexWrap: 'wrap',
    gap: '10px'
  };

  const badgeStyle = {
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
    color: 'white'
  };

  const logoutButtonStyle = {
    padding: '12px 24px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    marginTop: '20px'
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={{ ...cardStyle, textAlign: 'center', padding: '60px 30px' }}>
          <div style={{
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #667eea',
            borderRadius: '50%',
            width: '60px',
            height: '60px',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p style={{ fontSize: '18px', color: '#667eea', fontWeight: '600' }}>Loading your dashboard...</p>
          <p style={{ fontSize: '14px', color: '#888', marginTop: '10px' }}>Please wait while we fetch your data</p>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>
            {isAdmin() ? '👑 Admin Dashboard' : '🎯 User Dashboard'}
          </h1>
          <p style={welcomeStyle}>
            Welcome back, <strong>{user?.name || user?.email}</strong>!
          </p>
          <p style={userInfoStyle}>
            Role: {isAdmin() ? '👑 Administrator' : '👤 Regular User'} | 
            ID: {user?.id} | 
            Last login: {new Date().toLocaleDateString()}
            {isAdmin() && (
              <span style={{
                marginLeft: '15px',
                backgroundColor: '#dc3545',
                color: 'white',
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                ADMIN ACCESS
              </span>
            )}
          </p>
        </div>

        {/* Statistics Cards */}
        <div style={statsGridStyle}>
          <div 
            style={{...statCardStyle, borderColor: '#667eea'}}
            onClick={() => navigate('/incidents')}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 15px 30px rgba(0,0,0,0.15)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{...statNumberStyle, color: '#667eea'}}>{stats.total}</div>
            <div style={statLabelStyle}>Total Incidents</div>
          </div>

          <div 
            style={{...statCardStyle, borderColor: '#ffc107'}}
            onClick={() => navigate('/incidents')}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 15px 30px rgba(0,0,0,0.15)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{...statNumberStyle, color: '#ffc107'}}>{stats.pending}</div>
            <div style={statLabelStyle}>Pending Review</div>
          </div>

          <div 
            style={{...statCardStyle, borderColor: '#007bff'}}
            onClick={() => navigate('/incidents')}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 15px 30px rgba(0,0,0,0.15)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{...statNumberStyle, color: '#007bff'}}>{stats.investigating}</div>
            <div style={statLabelStyle}>Under Investigation</div>
          </div>

          <div 
            style={{...statCardStyle, borderColor: '#28a745'}}
            onClick={() => navigate('/incidents')}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 15px 30px rgba(0,0,0,0.15)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{...statNumberStyle, color: '#28a745'}}>{stats.resolved}</div>
            <div style={statLabelStyle}>Resolved</div>
          </div>

          <div 
            style={{...statCardStyle, borderColor: '#dc3545'}}
            onClick={() => navigate('/incidents')}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 15px 30px rgba(0,0,0,0.15)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{...statNumberStyle, color: '#dc3545'}}>{stats.redflags}</div>
            <div style={statLabelStyle}>🚩 Red Flags</div>
          </div>

          <div 
            style={{...statCardStyle, borderColor: '#17a2b8'}}
            onClick={() => navigate('/incidents')}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 15px 30px rgba(0,0,0,0.15)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{...statNumberStyle, color: '#17a2b8'}}>{stats.interventions}</div>
            <div style={statLabelStyle}>🔧 Interventions</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={quickActionsStyle}>
          <h2 style={sectionTitleStyle}>⚡ Quick Actions</h2>
          <div style={actionsGridStyle}>
            <button
              onClick={() => navigate('/incidents/create')}
              style={{...actionButtonStyle, backgroundColor: '#28a745', color: 'white'}}
              onMouseOver={(e) => e.target.style.backgroundColor = '#218838'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#28a745'}
            >
              <span>📝</span> Report New Incident
            </button>

            <button
              onClick={() => navigate('/incidents')}
              style={{...actionButtonStyle, backgroundColor: '#007bff', color: 'white'}}
              onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
            >
              <span>📋</span> {isAdmin() ? 'Manage All Incidents' : 'View My Incidents'}
            </button>

            <button
              onClick={() => window.location.reload()}
              style={{...actionButtonStyle, backgroundColor: '#17a2b8', color: 'white'}}
              onMouseOver={(e) => e.target.style.backgroundColor = '#138496'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#17a2b8'}
            >
              <span>🔄</span> Refresh Data
            </button>

            <button
              onClick={() => navigate('/help')}
              style={{...actionButtonStyle, backgroundColor: '#6c757d', color: 'white'}}
              onMouseOver={(e) => e.target.style.backgroundColor = '#545b62'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#6c757d'}
            >
              <span>❓</span> Help & Guide
            </button>

            {isAdmin() && (
              <button
                onClick={() => window.open('/data_viewer.html', '_blank')}
                style={{...actionButtonStyle, backgroundColor: '#6f42c1', color: 'white'}}
                onMouseOver={(e) => e.target.style.backgroundColor = '#5a32a3'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#6f42c1'}
              >
                <span>🔍</span> Admin Data Viewer
              </button>
            )}

            {isAdmin() && (
              <button
                onClick={() => navigate('/admin')}
                style={{...actionButtonStyle, backgroundColor: '#dc3545', color: 'white'}}
                onMouseOver={(e) => e.target.style.backgroundColor = '#c82333'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#dc3545'}
              >
                <span>👑</span> Admin Panel
              </button>
            )}
          </div>
        </div>

        {/* Admin-Only Section */}
        {isAdmin() && (
          <div style={{...quickActionsStyle, backgroundColor: '#fff3cd', border: '2px solid #ffc107', borderRadius: '10px', padding: '25px'}}>
            <h2 style={{...sectionTitleStyle, color: '#856404'}}>
              👑 Admin Control Panel
            </h2>
            <div style={{marginBottom: '20px', color: '#856404', fontSize: '14px', textAlign: 'center'}}>
              Administrative functions - Use with caution
            </div>
            
            <div style={actionsGridStyle}>
              <div style={{...statCardStyle, backgroundColor: '#d4edda', borderColor: '#28a745'}}>
                <div style={{...statNumberStyle, color: '#28a745'}}>{stats.total}</div>
                <div style={statLabelStyle}>Total System Incidents</div>
                <div style={{fontSize: '12px', color: '#666', marginTop: '5px'}}>All users combined</div>
              </div>

              <div style={{...statCardStyle, backgroundColor: '#cce5ff', borderColor: '#007bff'}}>
                <div style={{...statNumberStyle, color: '#007bff'}}>{stats.pending}</div>
                <div style={statLabelStyle}>Awaiting Review</div>
                <div style={{fontSize: '12px', color: '#666', marginTop: '5px'}}>Requires admin action</div>
              </div>

              <div style={{...statCardStyle, backgroundColor: '#f8d7da', borderColor: '#dc3545'}}>
                <div style={{...statNumberStyle, color: '#dc3545'}}>{stats.redflags}</div>
                <div style={statLabelStyle}>Critical Red Flags</div>
                <div style={{fontSize: '12px', color: '#666', marginTop: '5px'}}>High priority incidents</div>
              </div>
            </div>

            <div style={{marginTop: '20px', textAlign: 'center'}}>
              <button
                onClick={() => navigate('/incidents')}
                style={{
                  ...actionButtonStyle,
                  backgroundColor: '#dc3545',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '700'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#c82333'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#dc3545'}
              >
                🛡️ Manage All Incidents (Admin View)
              </button>
            </div>
          </div>
        )}

        {/* Recent Incidents */}
        {recentIncidents.length > 0 ? (
          <div style={recentIncidentsStyle}>
            <h2 style={sectionTitleStyle}>📊 Recent Incidents</h2>
            <div style={{ fontSize: '14px', color: '#666', textAlign: 'center', marginBottom: '20px' }}>
              Showing your {recentIncidents.length} most recent incidents
            </div>
            {recentIncidents.map(incident => (
              <div key={incident.id} style={incidentItemStyle}>
                <div style={incidentHeaderStyle}>
                  <div>
                    <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>{incident.title}</h4>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
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
                  </div>
                </div>
                <p style={{ color: '#666', margin: '10px 0 0 0', fontSize: '14px' }}>
                  {incident.description?.substring(0, 100)}...
                </p>
                <button
                  onClick={() => navigate(`/incidents/${incident.id}`)}
                  style={{
                    marginTop: '10px',
                    padding: '6px 12px',
                    backgroundColor: '#667eea',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#5568d3'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#667eea'}
                >
                  View Details →
                </button>
              </div>
            ))}
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button
                onClick={() => navigate('/incidents')}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#5568d3'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#667eea'}
              >
                View All Incidents →
              </button>
            </div>
          </div>
        ) : (
          <div style={{
            ...recentIncidentsStyle,
            textAlign: 'center',
            padding: '40px 20px',
            backgroundColor: '#f8f9fa',
            borderRadius: '10px',
            border: '2px dashed #dee2e6'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '15px' }}>📭</div>
            <h3 style={{ color: '#333', marginBottom: '10px' }}>No Incidents Yet</h3>
            <p style={{ color: '#666', marginBottom: '20px' }}>
              {isAdmin() 
                ? "No incidents have been reported in the system yet." 
                : "You haven't reported any incidents yet. Get started by creating your first report!"}
            </p>
            {!isAdmin() && (
              <button
                onClick={() => navigate('/incidents/create')}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#218838'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#28a745'}
              >
                📝 Report Your First Incident
              </button>
            )}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <div style={{
            backgroundColor: '#e7f3ff',
            border: '1px solid #b3d9ff',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '20px'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '10px' }}>💡</div>
            <h3 style={{ color: '#0056b3', marginBottom: '10px', fontSize: '18px' }}>Quick Tips</h3>
            <div style={{ color: '#004085', fontSize: '14px', lineHeight: '1.6' }}>
              {isAdmin() ? (
                <>
                  <p style={{ margin: '5px 0' }}>• Click on any stat card to view filtered incidents</p>
                  <p style={{ margin: '5px 0' }}>• Use the Admin Panel to manage all system incidents</p>
                  <p style={{ margin: '5px 0' }}>• Review pending incidents regularly to keep the system updated</p>
                </>
              ) : (
                <>
                  <p style={{ margin: '5px 0' }}>• Click on stat cards to quickly navigate to your incidents</p>
                  <p style={{ margin: '5px 0' }}>• Report incidents anonymously without logging in</p>
                  <p style={{ margin: '5px 0' }}>• Track the status of your reports in real-time</p>
                </>
              )}
            </div>
          </div>
          
          <button
            onClick={logout}
            style={logoutButtonStyle}
            onMouseOver={(e) => e.target.style.backgroundColor = '#c82333'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#dc3545'}
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;