import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import { incidentService } from '../services/incidentService';
import { toast } from 'react-toastify';

const AdminPanel = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [analytics, setAnalytics] = useState({
    total: 0,
    byStatus: {},
    byType: {},
    byMonth: {},
    recentActivity: [],
    topReporters: []
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('analytics'); // 'users' or 'analytics'

  useEffect(() => {
    if (!isAdmin()) {
      toast.error('Admin access required');
      navigate('/dashboard');
      return;
    }
    fetchUsers();
    fetchIncidents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await userService.getAllUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const fetchIncidents = async () => {
    try {
      const response = await incidentService.getAllIncidents();
      const incidentData = response.data;
      calculateAnalytics(incidentData);
    } catch (error) {
      console.error('Error fetching incidents:', error);
      toast.error('Failed to load incidents');
    }
  };

  const calculateAnalytics = (incidentData) => {
    // Status breakdown
    const byStatus = {
      pending: 0,
      investigating: 0,
      resolved: 0,
      rejected: 0
    };

    // Type breakdown
    const byType = {
      redflag: 0,
      intervention: 0
    };

    // Monthly breakdown (last 6 months)
    const byMonth = {};
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Reporter statistics
    const reporterCounts = {};

    incidentData.forEach(incident => {
      // Count by status
      if (incident.status) {
        byStatus[incident.status] = (byStatus[incident.status] || 0) + 1;
      }

      // Count by type
      if (incident.type) {
        byType[incident.type] = (byType[incident.type] || 0) + 1;
      }

      // Count by month
      if (incident.created_at) {
        const date = new Date(incident.created_at);
        const monthKey = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
        byMonth[monthKey] = (byMonth[monthKey] || 0) + 1;
      }

      // Count by reporter
      if (incident.user_id) {
        reporterCounts[incident.user_id] = (reporterCounts[incident.user_id] || 0) + 1;
      }
    });

    // Get top 5 reporters
    const topReporters = Object.entries(reporterCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([userId, count]) => ({ userId, count }));

    // Recent activity (last 10 incidents)
    const recentActivity = incidentData
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 10);

    setAnalytics({
      total: incidentData.length,
      byStatus,
      byType,
      byMonth,
      recentActivity,
      topReporters
    });
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      await userService.updateUserRole(userId, newRole);
      toast.success(`User role updated to ${newRole}`);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
    }
  };

  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
    padding: '20px'
  };

  const cardStyle = {
    maxWidth: '1000px',
    margin: '0 auto',
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
    padding: '40px'
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '30px',
    padding: '20px',
    backgroundColor: '#dc3545',
    color: 'white',
    borderRadius: '8px'
  };

  const titleStyle = {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '10px'
  };

  const subtitleStyle = {
    fontSize: '16px',
    opacity: 0.9
  };

  const userCardStyle = {
    backgroundColor: '#f8f9fa',
    padding: '20px',
    marginBottom: '15px',
    borderRadius: '8px',
    border: '1px solid #e9ecef',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '15px'
  };

  const userInfoStyle = {
    flex: 1,
    minWidth: '200px'
  };

  const userNameStyle = {
    fontSize: '18px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '5px'
  };

  const userEmailStyle = {
    fontSize: '14px',
    color: '#666',
    marginBottom: '5px'
  };

  const userMetaStyle = {
    fontSize: '12px',
    color: '#888'
  };

  const roleControlsStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap'
  };

  const roleBadgeStyle = {
    padding: '6px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
    color: 'white'
  };

  const adminBadgeStyle = {
    ...roleBadgeStyle,
    backgroundColor: '#dc3545'
  };

  const userBadgeStyle = {
    ...roleBadgeStyle,
    backgroundColor: '#28a745'
  };

  const selectStyle = {
    padding: '6px 12px',
    borderRadius: '4px',
    border: '2px solid #e9ecef',
    fontSize: '14px',
    cursor: 'pointer'
  };

  const buttonStyle = {
    padding: '10px 20px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-block'
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
          <p>Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>👑 Admin Control Panel</h1>
          <p style={subtitleStyle}>
            User Management & System Administration
          </p>
        </div>

        <div style={{ marginBottom: '30px', display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={buttonStyle}
          >
            ← Back to Dashboard
          </button>
          <button
            onClick={() => window.open('/data_viewer.html', '_blank')}
            style={{ ...buttonStyle, backgroundColor: '#007bff' }}
          >
            🔍 Data Viewer
          </button>
          <button
            onClick={() => {
              fetchUsers();
              fetchIncidents();
            }}
            style={{ ...buttonStyle, backgroundColor: '#28a745' }}
          >
            🔄 Refresh Data
          </button>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '30px',
          borderBottom: '2px solid #e9ecef',
          paddingBottom: '10px'
        }}>
          <button
            onClick={() => setActiveTab('analytics')}
            style={{
              padding: '12px 24px',
              backgroundColor: activeTab === 'analytics' ? '#667eea' : 'transparent',
              color: activeTab === 'analytics' ? 'white' : '#667eea',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          >
            📊 Incident Analytics
          </button>
          <button
            onClick={() => setActiveTab('users')}
            style={{
              padding: '12px 24px',
              backgroundColor: activeTab === 'users' ? '#667eea' : 'transparent',
              color: activeTab === 'users' ? 'white' : '#667eea',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          >
            👥 User Management
          </button>
        </div>

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div>
            {/* Summary Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px',
              marginBottom: '30px'
            }}>
              <div style={{
                backgroundColor: '#e7f3ff',
                padding: '20px',
                borderRadius: '8px',
                border: '2px solid #007bff',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#007bff' }}>
                  {analytics.total}
                </div>
                <div style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
                  Total Incidents
                </div>
              </div>

              <div style={{
                backgroundColor: '#fff3cd',
                padding: '20px',
                borderRadius: '8px',
                border: '2px solid #ffc107',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#ffc107' }}>
                  {analytics.byStatus.pending || 0}
                </div>
                <div style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
                  Pending Review
                </div>
              </div>

              <div style={{
                backgroundColor: '#d4edda',
                padding: '20px',
                borderRadius: '8px',
                border: '2px solid #28a745',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#28a745' }}>
                  {analytics.byStatus.resolved || 0}
                </div>
                <div style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
                  Resolved
                </div>
              </div>

              <div style={{
                backgroundColor: '#f8d7da',
                padding: '20px',
                borderRadius: '8px',
                border: '2px solid #dc3545',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#dc3545' }}>
                  {analytics.byType.redflag || 0}
                </div>
                <div style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
                  🚩 Red Flags
                </div>
              </div>
            </div>

            {/* Status Breakdown */}
            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '25px',
              borderRadius: '8px',
              marginBottom: '30px',
              border: '1px solid #e9ecef'
            }}>
              <h3 style={{ color: '#333', marginTop: 0, marginBottom: '20px' }}>
                📈 Status Distribution
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {Object.entries(analytics.byStatus).map(([status, count]) => {
                  const percentage = analytics.total > 0 ? (count / analytics.total * 100).toFixed(1) : 0;
                  const colors = {
                    pending: '#ffc107',
                    investigating: '#007bff',
                    resolved: '#28a745',
                    rejected: '#dc3545'
                  };
                  
                  return (
                    <div key={status}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '5px',
                        fontSize: '14px',
                        fontWeight: '600'
                      }}>
                        <span style={{ textTransform: 'capitalize' }}>{status}</span>
                        <span>{count} ({percentage}%)</span>
                      </div>
                      <div style={{
                        width: '100%',
                        height: '20px',
                        backgroundColor: '#e9ecef',
                        borderRadius: '10px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${percentage}%`,
                          height: '100%',
                          backgroundColor: colors[status],
                          transition: 'width 0.5s ease'
                        }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Type Breakdown */}
            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '25px',
              borderRadius: '8px',
              marginBottom: '30px',
              border: '1px solid #e9ecef'
            }}>
              <h3 style={{ color: '#333', marginTop: 0, marginBottom: '20px' }}>
                🔍 Incident Types
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '20px'
              }}>
                <div style={{
                  backgroundColor: '#f8d7da',
                  padding: '20px',
                  borderRadius: '8px',
                  textAlign: 'center',
                  border: '2px solid #dc3545'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '10px' }}>🚩</div>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#dc3545' }}>
                    {analytics.byType.redflag || 0}
                  </div>
                  <div style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
                    Red Flags
                  </div>
                  <div style={{ fontSize: '12px', color: '#999', marginTop: '5px' }}>
                    {analytics.total > 0 ? ((analytics.byType.redflag || 0) / analytics.total * 100).toFixed(1) : 0}% of total
                  </div>
                </div>

                <div style={{
                  backgroundColor: '#cce5ff',
                  padding: '20px',
                  borderRadius: '8px',
                  textAlign: 'center',
                  border: '2px solid #007bff'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '10px' }}>🔧</div>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#007bff' }}>
                    {analytics.byType.intervention || 0}
                  </div>
                  <div style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
                    Interventions
                  </div>
                  <div style={{ fontSize: '12px', color: '#999', marginTop: '5px' }}>
                    {analytics.total > 0 ? ((analytics.byType.intervention || 0) / analytics.total * 100).toFixed(1) : 0}% of total
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '25px',
              borderRadius: '8px',
              marginBottom: '30px',
              border: '1px solid #e9ecef'
            }}>
              <h3 style={{ color: '#333', marginTop: 0, marginBottom: '20px' }}>
                🕒 Recent Activity (Last 10 Incidents)
              </h3>
              {analytics.recentActivity.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#666' }}>No recent activity</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {analytics.recentActivity.map((incident, index) => (
                    <div
                      key={incident.id}
                      style={{
                        backgroundColor: 'white',
                        padding: '15px',
                        borderRadius: '6px',
                        border: '1px solid #e9ecef',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '10px',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onClick={() => navigate(`/incidents/${incident.id}`)}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
                    >
                      <div style={{ flex: 1, minWidth: '200px' }}>
                        <div style={{ fontWeight: '600', color: '#333', marginBottom: '5px' }}>
                          {incident.type === 'redflag' ? '🚩' : '🔧'} {incident.title}
                        </div>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                          {incident.location} • {new Date(incident.created_at).toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '600',
                          color: 'white',
                          backgroundColor: 
                            incident.status === 'pending' ? '#ffc107' :
                            incident.status === 'investigating' ? '#007bff' :
                            incident.status === 'resolved' ? '#28a745' : '#dc3545'
                        }}>
                          {incident.status?.charAt(0).toUpperCase() + incident.status?.slice(1)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Monthly Trend */}
            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '25px',
              borderRadius: '8px',
              marginBottom: '30px',
              border: '1px solid #e9ecef'
            }}>
              <h3 style={{ color: '#333', marginTop: 0, marginBottom: '20px' }}>
                📅 Monthly Trend
              </h3>
              {Object.keys(analytics.byMonth).length === 0 ? (
                <p style={{ textAlign: 'center', color: '#666' }}>No data available</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {Object.entries(analytics.byMonth)
                    .sort((a, b) => new Date(a[0]) - new Date(b[0]))
                    .slice(-6) // Last 6 months
                    .map(([month, count]) => {
                      const maxCount = Math.max(...Object.values(analytics.byMonth));
                      const percentage = (count / maxCount * 100).toFixed(1);
                      
                      return (
                        <div key={month}>
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBottom: '5px',
                            fontSize: '14px',
                            fontWeight: '600'
                          }}>
                            <span>{month}</span>
                            <span>{count} incidents</span>
                          </div>
                          <div style={{
                            width: '100%',
                            height: '20px',
                            backgroundColor: '#e9ecef',
                            borderRadius: '10px',
                            overflow: 'hidden'
                          }}>
                            <div style={{
                              width: `${percentage}%`,
                              height: '100%',
                              backgroundColor: '#667eea',
                              transition: 'width 0.5s ease'
                            }} />
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ color: '#333', marginBottom: '15px' }}>
                👥 System Users ({users.length} total)
              </h2>
            </div>

            {users.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                <p>No users found</p>
              </div>
            ) : (
              users.map(user => (
                <div key={user.id} style={userCardStyle}>
                  <div style={userInfoStyle}>
                    <div style={userNameStyle}>
                      {user.name}
                      {user.is_admin && (
                        <span style={{ marginLeft: '10px', fontSize: '16px' }}>👑</span>
                      )}
                    </div>
                    <div style={userEmailStyle}>{user.email}</div>
                    <div style={userMetaStyle}>
                      ID: {user.id} | Joined: {new Date(user.created_at).toLocaleDateString()}
                    </div>
                  </div>

                  <div style={roleControlsStyle}>
                    <div style={user.is_admin ? adminBadgeStyle : userBadgeStyle}>
                      {user.is_admin ? '👑 ADMIN' : '👤 USER'}
                    </div>

                    <select
                      value={user.role || 'user'}
                      onChange={(e) => updateUserRole(user.id, e.target.value)}
                      style={selectStyle}
                      disabled={user.id === 1} // Prevent changing the first admin
                    >
                      <option value="user">👤 Regular User</option>
                      <option value="admin">👑 Administrator</option>
                    </select>

                    {user.id === 1 && (
                      <div style={{
                        fontSize: '11px',
                        color: '#dc3545',
                        fontWeight: '600',
                        padding: '4px 8px',
                        backgroundColor: '#f8d7da',
                        borderRadius: '4px'
                      }}>
                        SYSTEM ADMIN
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}

            <div style={{
              marginTop: '30px',
              padding: '20px',
              backgroundColor: '#fff3cd',
              borderRadius: '8px',
              border: '1px solid #ffc107'
            }}>
              <h3 style={{ color: '#856404', marginTop: 0 }}>⚠️ Admin Guidelines</h3>
              <ul style={{ color: '#856404', fontSize: '14px', lineHeight: '1.6' }}>
                <li>The first registered user (ID: 1) is the system administrator and cannot be demoted</li>
                <li>Admin users can view and manage all incidents in the system</li>
                <li>Admin users can update incident statuses and manage user roles</li>
                <li>Regular users can only view and manage their own incidents</li>
                <li>Use admin privileges responsibly and only when necessary</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;