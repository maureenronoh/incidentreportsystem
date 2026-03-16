import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import { userService } from '../services/userService';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // Load user from localStorage immediately - no waiting for API
  const cachedUser = localStorage.getItem('user');
  const [user, setUser] = useState(cachedUser ? JSON.parse(cachedUser) : null);
  const [loading, setLoading] = useState(false); // Start as false - no blocking

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    // Verify token in background - don't block the UI
    const verifyToken = async () => {
      try {
        const response = await userService.getCurrentUser();
        setUser(response.data);
        localStorage.setItem('user', JSON.stringify(response.data));
      } catch (error) {
        console.error('Token verification failed:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      }
    };

    verifyToken();
  }, []);

  const login = async (email, password) => {
    try {
      console.log('AuthContext: Attempting login for:', email);
      const response = await userService.login({ email, password });
      console.log('AuthContext: Login response:', response);
      
      const { token, user } = response.data;
      
      console.log('AuthContext: Extracted token and user:', { token: token ? 'present' : 'missing', user });
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      
      // Show message about linked incidents
      if (response.data.linked_incidents > 0) {
        setTimeout(() => {
          toast.info(`${response.data.linked_incidents} anonymous incident(s) have been linked to your account!`);
        }, 1000);
      }
      
      console.log('AuthContext: Login successful, user set:', user);
      return { success: true };
    } catch (error) {
      console.error('AuthContext: Login failed:', error);
      console.error('AuthContext: Error response:', error.response);
      return { 
        success: false, 
        error: error.response?.data?.error || error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await userService.register(userData);
      
      // Check if user was auto-logged in (token provided)
      if (response.data.token) {
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        
        // Show message about linked incidents
        if (response.data.linked_incidents > 0) {
          setTimeout(() => {
            toast.info(`${response.data.linked_incidents} anonymous incident(s) have been linked to your account!`);
          }, 1000);
        }
      }
      
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Registration failed:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login';
  };

  const isAdmin = () => {
    return user?.role === 'admin' || user?.is_admin === true;
  };

  const value = {
    user,
    login,
    logout,
    register,
    loading,
    isAuthenticated: !!user,
    isAdmin
  };

  if (loading) {
    return null; // Never blocks - loading is always false now
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};