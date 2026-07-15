import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import './App.css';

// Global Components
import Layout from './components/Layout';

// Public Pages
import Batches from './pages/public/Batches';
import CheckAttendance from './pages/public/CheckAttendance';
import FeeStructure from './pages/public/FeeStructure';
import Timetable from './pages/public/Timetable';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ContentManager from './pages/admin/ContentManager';
import BatchManager from './pages/admin/BatchManager';
import StaffManager from './pages/admin/StaffManager';
import StudentManager from './pages/admin/StudentManager';
import AppSettings from './pages/admin/AppSettings';
import FeeManager from './pages/admin/FeeManager';

// Staff Pages
import StaffDashboard from './pages/staff/StaffDashboard';
import AttendancePanel from './pages/staff/AttendancePanel';
import StaffStudentManager from './pages/staff/StaffStudentManager';
import TimetableManager from './pages/staff/TimetableManager';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';

const ProtectedRoute = ({ children, requiredRole }) => {
  const role = localStorage.getItem('role');
  
  if (!role) {
    return <Navigate to="/login" />;
  }
  
  if (role !== requiredRole) {
    return <Navigate to={role === 'admin' ? "/admin" : role === 'teacher' ? "/staff" : "/student"} />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes with Layout */}
        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/batches" element={<Batches />} />
        <Route path="/check-attendance" element={<CheckAttendance />} />
        
        {/* Student/Public specific UI Routes (Mobile App Simulator wrapper) */}
        <Route path="/fee-structure" element={<FeeStructure />} />
        <Route path="/timetable" element={<Timetable />} />
        
        {/* Auth Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Protected Admin Routes */}
        <Route path="/admin/*" element={
          <ProtectedRoute requiredRole="admin">
            <Routes>
              <Route path="/" element={<AdminDashboard />} />
              <Route path="/content" element={<ContentManager />} />
              <Route path="/batches" element={<BatchManager />} />
              <Route path="/staff" element={<StaffManager />} />
              <Route path="/students" element={<StudentManager />} />
              <Route path="/settings" element={<AppSettings />} />
              <Route path="/fees" element={<FeeManager />} />
            </Routes>
          </ProtectedRoute>
        } />

        {/* Protected Staff Routes */}
        <Route path="/staff/*" element={
          <ProtectedRoute requiredRole="teacher">
            <Routes>
              <Route path="/" element={<StaffDashboard />} />
              <Route path="/attendance" element={<AttendancePanel />} />
              <Route path="/students" element={<StaffStudentManager />} />
              <Route path="/timetable" element={<TimetableManager />} />
            </Routes>
          </ProtectedRoute>
        } />
        
        {/* Protected Student Routes */}
        <Route path="/student/*" element={
          <ProtectedRoute requiredRole="student">
            <Routes>
              <Route path="/" element={<StudentDashboard />} />
            </Routes>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
