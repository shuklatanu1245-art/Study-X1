import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import './App.css';

// Global Components
import Layout from './components/Layout';

// Public Pages
import Home from './pages/public/Home';
import Batches from './pages/public/Batches';
import CheckAttendance from './pages/public/CheckAttendance'; // New

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ContentManager from './pages/admin/ContentManager';
import BatchManager from './pages/admin/BatchManager'; // New
import StaffManager from './pages/admin/StaffManager'; // New
import StudentManager from './pages/admin/StudentManager'; // New

// Staff Pages
import StaffDashboard from './pages/staff/StaffDashboard'; // New
import AttendancePanel from './pages/staff/AttendancePanel'; // New

const ProtectedRoute = ({ children, requiredRole }) => {
  const role = localStorage.getItem('role');
  
  if (!role) {
    return <Navigate to="/login" />;
  }
  
  if (role !== requiredRole) {
    return <Navigate to={role === 'admin' ? "/admin" : "/staff"} />;
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
        <Route path="/check-attendance" element={<Layout><CheckAttendance /></Layout>} />
        
        {/* Staff & Admin Login */}
        <Route path="/login" element={<Login />} />
        
        {/* Protected Admin Routes */}
        <Route path="/admin/*" element={
          <ProtectedRoute requiredRole="admin">
            <Routes>
              <Route path="/" element={<AdminDashboard />} />
              <Route path="/content" element={<ContentManager />} />
              <Route path="/batches" element={<BatchManager />} />
              <Route path="/staff" element={<StaffManager />} />
              <Route path="/students" element={<StudentManager />} />
            </Routes>
          </ProtectedRoute>
        } />

        {/* Protected Staff Routes */}
        <Route path="/staff/*" element={
          <ProtectedRoute requiredRole="teacher">
            <Routes>
              <Route path="/" element={<StaffDashboard />} />
              <Route path="/attendance" element={<AttendancePanel />} />
            </Routes>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
