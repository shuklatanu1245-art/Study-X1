import React from 'react';
import { LogOut, CalendarCheck, Users, Calendar, Megaphone, MessageSquare } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const StaffDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('role');
    localStorage.removeItem('teacherId');
    navigate('/login');
  };

  return (
    <div>
      <header className="app-header">
        <h2 className="text-gradient">Staff Dashboard</h2>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <button onClick={handleLogout} className="btn btn-secondary">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </header>

      <main className="container animate-fade-in">
        <h1 style={{ marginBottom: '32px' }}>Welcome, Teacher</h1>
        
        <div className="grid grid-cols-4">
          <Link to="/staff/attendance" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="glass-card">
              <CalendarCheck size={32} color="var(--primary-color)" style={{ marginBottom: '16px' }} />
              <h3>Mark Attendance</h3>
              <p className="text-muted">Record daily attendance for your batches</p>
            </div>
          </Link>
          
          <Link to="/staff/students" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="glass-card">
              <Users size={32} color="var(--success-color)" style={{ marginBottom: '16px' }} />
              <h3>Manage Students</h3>
              <p className="text-muted">Register students who haven't signed up</p>
            </div>
          </Link>
          
          <Link to="/staff/timetable" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="glass-card">
              <Calendar size={32} color="#3b82f6" style={{ marginBottom: '16px' }} />
              <h3>Manage Timetable</h3>
              <p className="text-muted">Upload timetable image</p>
            </div>
          </Link>
          <Link to="/staff/announcements" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="glass-card">
              <Megaphone size={32} color="#f59e0b" style={{ marginBottom: '16px' }} />
              <h3>Announcements</h3>
              <p className="text-muted">Broadcast notices</p>
            </div>
          </Link>

          <Link to="/staff/messages" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="glass-card">
              <MessageSquare size={32} color="#8b5cf6" style={{ marginBottom: '16px' }} />
              <h3>Messages</h3>
              <p className="text-muted">Reply to doubts</p>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
};
export default StaffDashboard;
