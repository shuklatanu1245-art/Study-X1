import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import './App.css';

// Global Components
import Layout from './components/Layout';

// Public Pages
import Home from './pages/public/Home';
import Batches from './pages/public/Batches';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ContentManager from './pages/admin/ContentManager';

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
        {/* Public Routes with Layout */}
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/batches" element={<Layout><Batches /></Layout>} />
        
        {/* Admin Login */}
        <Route path="/admin-login" element={<Login />} />
        
        {/* Protected Admin Routes (No public layout) */}
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
