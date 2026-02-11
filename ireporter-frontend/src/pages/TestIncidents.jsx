import React, { useState, useEffect } from 'react';
import { incidentService } from '../services/incidentService';
import { useAuth } from '../context/AuthContext';

const TestIncidents = () => {
  const { user, isAdmin } = useAuth();
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const testFetch = async () => {
      try {
        console.log('TestIncidents: Starting fetch...');
        console.log('TestIncidents: Current user:', user);
        console.log('TestIncidents: Is admin:', isAdmin());
        
        const response = await incidentService.getAllIncidents();
        console.log('TestIncidents: Raw response:', response);
        
        const data = response.data || response;
        console.log('TestIncidents: Extracted data:', data);
        
        if (Array.isArray(data)) {
          setIncidents(data);
          console.log('TestIncidents: Set incidents:', data);
        } else {
          throw new Error('Response is not an array');
        }
        
      } catch (err) {
        console.error('TestIncidents: Error:', err);
        console.error('TestIncidents: Error response:', err.response);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      testFetch();
    }
  }, [user, isAdmin]);

  if (loading) {
    return <div style={{ padding: '20px' }}>Loading...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        <h2>Error:</h2>
        <p>{error}</p>
        <p>Check browser console for details</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Test Incidents Page</h1>
      <div>
        <h3>User Info:</h3>
        <pre>{JSON.stringify(user, null, 2)}</pre>
      </div>
      <div>
        <h3>Is Admin: {isAdmin() ? 'Yes' : 'No'}</h3>
      </div>
      <div>
        <h3>Incidents ({incidents.length}):</h3>
        {incidents.length === 0 ? (
          <p>No incidents found</p>
        ) : (
          <ul>
            {incidents.map((incident, index) => (
              <li key={incident.id || index} style={{ marginBottom: '10px' }}>
                <strong>{incident.title}</strong> - {incident.status}
                <br />
                <small>User ID: {incident.user_id} | Type: {incident.type}</small>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TestIncidents;