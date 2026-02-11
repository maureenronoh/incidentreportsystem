import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './mobile.css'; // Mobile-first styles

// Import components
import MobileLayout from './components/MobileLayout';
import HelpButton from './components/HelpButton';

// Import pages
import Login from './pages/Login';
import Register from './pages/Register';
import AnonymousReport from './pages/AnonymousReport';
import Dashboard from './pages/Dashboard';
import CreateIncident from './pages/CreateIncident';
import IncidentList from './pages/IncidentList';
import ViewIncident from './pages/ViewIncident';
import EditIncident from './pages/EditIncident';
import AdminPanel from './pages/AdminPanel';
import TestIncidents from './pages/TestIncidents';
import Help from './pages/Help';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

// Public Route component (redirect to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return !token ? children : <Navigate to="/dashboard" replace />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <MobileLayout>
          <div className="App">
            <Routes>
            {/* Public routes */}
            <Route path="/login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />
            <Route path="/register" element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } />
            <Route path="/report" element={<AnonymousReport />} />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/incidents" element={
              <ProtectedRoute>
                <IncidentList />
              </ProtectedRoute>
            } />
            <Route path="/incidents/create" element={
              <ProtectedRoute>
                <CreateIncident />
              </ProtectedRoute>
            } />
            <Route path="/incidents/:id" element={
              <ProtectedRoute>
                <ViewIncident />
              </ProtectedRoute>
            } />
            <Route path="/incidents/:id/edit" element={
              <ProtectedRoute>
                <EditIncident />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminPanel />
              </ProtectedRoute>
            } />
            <Route path="/test" element={
              <ProtectedRoute>
                <TestIncidents />
              </ProtectedRoute>
            } />
            <Route path="/help" element={
              <ProtectedRoute>
                <Help />
              </ProtectedRoute>
            } />
            
            {/* Default routes */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
          
          <ToastContainer 
            position="top-right" 
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
          
          {/* Global Help Button - Hidden on mobile (using nav instead) */}
          <div className="desktop-only">
            <HelpButton />
          </div>
        </div>
      </MobileLayout>
    </AuthProvider>
  </Router>
  );
}

export default App;