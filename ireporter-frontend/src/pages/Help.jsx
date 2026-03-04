import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Help = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('getting-started');

  const helpSections = {
    'getting-started': {
      title: '🚀 Getting Started',
      content: [
        {
          subtitle: 'Welcome to iReporter',
          items: [
            'iReporter is a platform for reporting incidents like corruption and infrastructure issues',
            'You can report two types of incidents: Red Flags (corruption) and Interventions (infrastructure)',
            'Track the status of your reports from submission to resolution'
          ]
        },
        {
          subtitle: 'First Steps',
          items: [
            '1. Register for an account with your email',
            '2. Verify your email address (if email verification is enabled)',
            '3. Login to access your dashboard',
            '4. Start reporting incidents that need attention'
          ]
        }
      ]
    },
    'dashboard': {
      title: '📊 Dashboard Guide',
      content: [
        {
          subtitle: 'Overview',
          items: [
            'Your dashboard shows a summary of all your incident reports',
            'View statistics: total incidents, pending, investigating, and resolved',
            'Quick access to all major features through action buttons'
          ]
        },
        {
          subtitle: 'Statistics Cards',
          items: [
            '📊 Total Incidents - All incidents you\'ve reported',
            '⏳ Pending - Incidents waiting for admin review',
            '🔍 Investigating - Incidents currently being looked into',
            '✅ Resolved - Successfully completed incidents',
            '❌ Rejected - Incidents that couldn\'t be processed'
          ]
        },
        {
          subtitle: 'Quick Actions',
          items: [
            'Report New Incident - Create a new incident report',
            'View All Incidents - See your complete incident history',
            'Admin Panel - Access administrative features (admin users only)',
            'Logout - Securely sign out of your account'
          ]
        }
      ]
    },
    'reporting': {
      title: '📝 Reporting Incidents',
      content: [
        {
          subtitle: 'Types of Incidents',
          items: [
            '🚩 Red Flag - Corruption, bribery, embezzlement, or misconduct',
            '🔧 Intervention - Infrastructure problems, public service issues'
          ]
        },
        {
          subtitle: 'Creating a Report',
          items: [
            'Title - Brief, descriptive title of the incident',
            'Type - Select Red Flag or Intervention',
            'Location - Specific location where the incident occurred',
            'Description - Detailed explanation of what happened'
          ]
        },
        {
          subtitle: 'Writing Good Reports',
          items: [
            'Be specific and factual in your description',
            'Include dates, times, and locations',
            'Mention any witnesses or evidence',
            'Use professional, clear language',
            'Avoid accusations without evidence'
          ]
        },
        {
          subtitle: 'After Submission',
          items: [
            'Your report starts with "Pending" status',
            'Administrators will review and investigate',
            'Status updates: Pending → Investigating → Resolved/Rejected',
            'You can edit your report until it\'s resolved'
          ]
        }
      ]
    },
    'managing': {
      title: '📋 Managing Your Reports',
      content: [
        {
          subtitle: 'Viewing Your Incidents',
          items: [
            'Access all your reports from the "View All Incidents" button',
            'Filter by type (Red Flag or Intervention)',
            'Filter by status (Pending, Investigating, Resolved, Rejected)',
            'See creation date and current status for each report'
          ]
        },
        {
          subtitle: 'Incident Actions',
          items: [
            '👁️ View - See complete incident details',
            '✏️ Edit - Modify your report (available until resolved)',
            '🗑️ Delete - Remove your report (use carefully)',
            'Status updates are handled by administrators'
          ]
        },
        {
          subtitle: 'Status Meanings',
          items: [
            'Pending - Report submitted, waiting for review',
            'Investigating - Administrators are looking into the issue',
            'Resolved - Issue has been addressed and closed',
            'Rejected - Report couldn\'t be processed (with reason)'
          ]
        }
      ]
    },
    'admin': {
      title: '👑 Admin Features',
      content: [
        {
          subtitle: 'Admin Responsibilities',
          items: [
            'Review and investigate all incident reports',
            'Update incident statuses as investigations progress',
            'Manage user accounts and permissions',
            'Ensure system security and data integrity'
          ]
        },
        {
          subtitle: 'User Management',
          items: [
            'View all registered users',
            'Promote users to admin or demote to regular user',
            'Monitor user activity and registration dates',
            'Handle user-related issues and requests'
          ]
        },
        {
          subtitle: 'Incident Management',
          items: [
            'See all incidents from all users',
            'Update status: Pending → Investigating → Resolved/Rejected',
            'Edit or delete any incident if necessary',
            'Provide feedback and updates to reporters'
          ]
        },
        {
          subtitle: 'System Overview',
          items: [
            'Monitor system-wide statistics',
            'Track incident resolution rates',
            'Identify trends and patterns',
            'Generate reports for stakeholders'
          ]
        }
      ]
    },
    'account': {
      title: '👤 Account Management',
      content: [
        {
          subtitle: 'Registration',
          items: [
            'Use a valid email address for account creation',
            'Choose a strong password (minimum 6 characters)',
            'The first registered user automatically becomes an admin',
            'Verify your email if email verification is enabled'
          ]
        },
        {
          subtitle: 'Login & Security',
          items: [
            'Always logout when using shared computers',
            'Don\'t share your login credentials',
            'Report suspicious activity to administrators',
            'Contact admin if you forget your password'
          ]
        },
        {
          subtitle: 'Email Verification',
          items: [
            'Check your inbox after registration',
            'Click the verification link to activate your account',
            'Verification links expire in 24 hours',
            'Request a new verification email if needed'
          ]
        }
      ]
    },
    'troubleshooting': {
      title: '🔧 Troubleshooting',
      content: [
        {
          subtitle: 'Common Issues',
          items: [
            'Can\'t login? Check your email and password',
            'Email not verified? Check spam folder for verification email',
            'Forgot password? Contact system administrator',
            'Page not loading? Refresh browser or clear cache'
          ]
        },
        {
          subtitle: 'Technical Problems',
          items: [
            'Browser compatibility: Use modern browsers (Chrome, Firefox, Safari)',
            'JavaScript must be enabled',
            'Clear browser cache if experiencing issues',
            'Disable ad blockers if forms aren\'t working'
          ]
        },
        {
          subtitle: 'Getting Support',
          items: [
            'Contact your system administrator for account issues',
            'Report bugs to the development team',
            'Check this help section for common solutions',
            'Provide detailed information when reporting problems'
          ]
        }
      ]
    }
  };

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
    overflow: 'hidden'
  };

  const headerStyle = {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '30px',
    textAlign: 'center'
  };

  const titleStyle = {
    fontSize: '32px',
    fontWeight: 'bold',
    margin: '0 0 10px 0'
  };

  const subtitleStyle = {
    fontSize: '16px',
    opacity: 0.9,
    margin: 0
  };

  const contentStyle = {
    display: 'flex',
    minHeight: '600px',
    flexDirection: window.innerWidth <= 768 ? 'column' : 'row'
  };

  const sidebarStyle = {
    width: window.innerWidth <= 768 ? '100%' : '300px',
    backgroundColor: '#f8f9fa',
    borderRight: window.innerWidth <= 768 ? 'none' : '1px solid #e9ecef',
    borderBottom: window.innerWidth <= 768 ? '1px solid #e9ecef' : 'none',
    padding: '20px 0',
    display: 'flex',
    flexDirection: window.innerWidth <= 768 ? 'row' : 'column',
    overflowX: window.innerWidth <= 768 ? 'auto' : 'visible',
    gap: window.innerWidth <= 768 ? '10px' : '0'
  };

  const mainContentStyle = {
    flex: 1,
    padding: window.innerWidth <= 768 ? '20px' : '30px'
  };

  const menuItemStyle = {
    padding: window.innerWidth <= 768 ? '10px 15px' : '12px 20px',
    cursor: 'pointer',
    borderLeft: window.innerWidth <= 768 ? 'none' : '4px solid transparent',
    borderBottom: window.innerWidth <= 768 ? '3px solid transparent' : 'none',
    transition: 'all 0.3s',
    fontSize: '14px',
    color: '#555',
    whiteSpace: window.innerWidth <= 768 ? 'nowrap' : 'normal',
    minWidth: window.innerWidth <= 768 ? 'auto' : 'unset',
    textAlign: window.innerWidth <= 768 ? 'center' : 'left'
  };

  const activeMenuItemStyle = {
    ...menuItemStyle,
    backgroundColor: '#e3f2fd',
    borderLeftColor: window.innerWidth <= 768 ? 'transparent' : '#2196f3',
    borderBottomColor: window.innerWidth <= 768 ? '#2196f3' : 'transparent',
    color: '#1976d2',
    fontWeight: '600'
  };

  const sectionTitleStyle = {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '30px'
  };

  const subsectionStyle = {
    marginBottom: '30px'
  };

  const subsectionTitleStyle = {
    fontSize: '20px',
    fontWeight: '600',
    color: '#2196f3',
    marginBottom: '15px',
    borderBottom: '2px solid #e3f2fd',
    paddingBottom: '8px'
  };

  const listStyle = {
    listStyle: 'none',
    padding: 0,
    margin: 0
  };

  const listItemStyle = {
    padding: '8px 0',
    color: '#555',
    lineHeight: '1.6',
    borderBottom: '1px solid #f0f0f0'
  };

  const backButtonStyle = {
    position: 'absolute',
    top: '20px',
    left: '20px',
    padding: '10px 20px',
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600'
  };

  const currentSection = helpSections[activeSection];

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={headerStyle}>
          <button
            style={backButtonStyle}
            onClick={() => navigate('/dashboard')}
          >
            ← Back to Dashboard
          </button>
          <h1 style={titleStyle}>❓ iReporter Help Center</h1>
          <p style={subtitleStyle}>Everything you need to know about using iReporter</p>
        </div>

        <div style={contentStyle}>
          <div style={sidebarStyle}>
            {Object.entries(helpSections).map(([key, section]) => (
              <div
                key={key}
                style={activeSection === key ? activeMenuItemStyle : menuItemStyle}
                onClick={() => setActiveSection(key)}
              >
                {section.title}
              </div>
            ))}
          </div>

          <div style={mainContentStyle}>
            <h2 style={sectionTitleStyle}>{currentSection.title}</h2>
            
            {currentSection.content.map((subsection, index) => (
              <div key={index} style={subsectionStyle}>
                <h3 style={subsectionTitleStyle}>{subsection.subtitle}</h3>
                <ul style={listStyle}>
                  {subsection.items.map((item, itemIndex) => (
                    <li key={itemIndex} style={listItemStyle}>
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div style={{
              marginTop: '40px',
              padding: '20px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <h4 style={{ color: '#333', marginBottom: '10px' }}>Need More Help?</h4>
              <p style={{ color: '#666', margin: 0 }}>
                Contact your system administrator or report issues to the development team.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;