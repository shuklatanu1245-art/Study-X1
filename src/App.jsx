import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import './App.css';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ContentManager from './pages/admin/ContentManager';

// Student Pages
import StudentDashboard from './pages/student/Dashboard';

const AdminRoute = ({ children }) => {
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  
  if (!isAdmin) {
    return <Navigate to="/admin-login" />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Student Dashboard */}
        <Route path="/" element={<StudentDashboard />} />
        
        {/* Admin Login */}
        <Route path="/admin-login" element={<Login />} />
        
        {/* Protected Admin Routes */}
        <Route path="/admin/*" element={
          <AdminRoute>
            <Routes>
              <Route path="/" element={<AdminDashboard />} />
              <Route path="/content" element={<ContentManager />} />
            </Routes>
          </AdminRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
