import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Upload, Users, BookOpen, LogOut } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div>
      <header className="app-header">
        <h2 className="text-gradient">StudyX Admin</h2>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <span className="text-muted">{currentUser?.email}</span>
          <button onClick={handleLogout} className="btn btn-secondary">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </header>

      <main className="container animate-fade-in">
        <h1 style={{ marginBottom: '32px' }}>Dashboard Overview</h1>
        
        <div className="grid grid-cols-3">
          <Link to="/admin/content" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="glass-card">
              <Upload size={32} color="var(--primary-color)" style={{ marginBottom: '16px' }} />
              <h3>Content Manager</h3>
              <p className="text-muted">Upload Notes, Videos & PDFs</p>
            </div>
          </Link>
          
          <div className="glass-card">
            <BookOpen size={32} color="var(--success-color)" style={{ marginBottom: '16px' }} />
            <h3>Quiz Builder</h3>
            <p className="text-muted">Create and manage tests</p>
          </div>
          
          <div className="glass-card">
            <Users size={32} color="var(--danger-color)" style={{ marginBottom: '16px' }} />
            <h3>Student Manager</h3>
            <p className="text-muted">View enrolled students</p>
          </div>
        </div>
      </main>
    </div>
  );
};
export default AdminDashboard;
