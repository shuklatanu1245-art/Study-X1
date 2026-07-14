import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import './App.css';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ContentManager from './pages/admin/ContentManager';

// Student Pages
import StudentDashboard from './pages/student/Dashboard';

const PrivateRoute = ({ children, requiredRole }) => {
  const { currentUser, userRole } = useAuth();
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to={userRole === 'admin' ? "/admin" : "/dashboard"} />;
  }
  
  return children;
};

const RootRedirect = () => {
  const { currentUser, userRole } = useAuth();
  if (!currentUser) return <Navigate to="/login" />;
  return <Navigate to={userRole === 'admin' ? "/admin" : "/dashboard"} />;
};

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        <Route path="/admin/*" element={
          <PrivateRoute requiredRole="admin">
            <Routes>
              <Route path="/" element={<AdminDashboard />} />
              <Route path="/content" element={<ContentManager />} />
            </Routes>
          </PrivateRoute>
        } />
        
        <Route path="/dashboard/*" element={
          <PrivateRoute requiredRole="student">
            <Routes>
              <Route path="/" element={<StudentDashboard />} />
            </Routes>
          </PrivateRoute>
        } />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
