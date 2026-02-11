import api from './api';

export const userService = {
  // Register a new user
  register: (userData) => {
    return api.post('/users/register', userData);
  },

  // Login user
  login: (credentials) => {
    return api.post('/users/login', credentials);
  },

  // Get current user profile
  getCurrentUser: () => {
    return api.get('/users/me');
  },

  // Update user profile
  updateProfile: (userData) => {
    return api.put('/users/profile', userData);
  },

  // Get all users (admin only)
  getAllUsers: () => {
    return api.get('/admin/users');
  },

  // Update user role (admin only)
  updateUserRole: (userId, role) => {
    return api.patch(`/admin/users/${userId}/role`, { role });
  },

  // Delete user (admin only)
  deleteUser: (userId) => {
    return api.delete(`/users/${userId}`);
  },

  // Email verification
  verifyEmail: (token) => {
    return api.post('/users/verify-email', { token });
  },

  // Resend verification email
  resendVerification: (email) => {
    return api.post('/users/resend-verification', { email });
  }
};