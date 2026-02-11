import api from './api';

export const incidentService = {
  // Get all incidents
  getAllIncidents: () => {
    return api.get('/incidents');
  },

  // Get incident by ID
  getIncidentById: (id) => {
    return api.get(`/incidents/${id}`);
  },

  // Create new incident
  createIncident: (incidentData) => {
    return api.post('/incidents', incidentData);
  },

  // Update incident
  updateIncident: (id, incidentData) => {
    return api.put(`/incidents/${id}`, incidentData);
  },

  // Delete incident
  deleteIncident: (id) => {
    return api.delete(`/incidents/${id}`);
  },

  // Get incident statistics
  getIncidentStats: () => {
    return api.get('/incidents/stats');
  },

  // Update incident status (admin only)
  updateIncidentStatus: (id, status) => {
    return api.put(`/incidents/${id}`, { status });
  },

  // Get incidents by type
  getIncidentsByType: (type) => {
    return api.get(`/incidents?type=${type}`);
  },

  // Get incidents by status
  getIncidentsByStatus: (status) => {
    return api.get(`/incidents?status=${status}`);
  }
};