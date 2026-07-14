import React from 'react';
import { Upload, Users, BookOpen, LogOut, GraduationCap, Briefcase } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <div>
      <header className="app-header">
        <h2 className="text-gradient">School Admin</h2>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <button onClick={handleLogout} className="btn btn-secondary">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </header>

      <main className="container animate-fade-in">
        <h1 style={{ marginBottom: '32px' }}>Dashboard Overview</h1>
        
        <div className="grid grid-cols-4">
          <Link to="/admin/content" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="glass-card">
              <Upload size={32} color="var(--primary-color)" style={{ marginBottom: '16px' }} />
              <h3>Content Manager</h3>
              <p className="text-muted">Upload Notes & Videos</p>
            </div>
          </Link>
          
          <Link to="/admin/batches" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="glass-card">
              <BookOpen size={32} color="var(--success-color)" style={{ marginBottom: '16px' }} />
              <h3>Batch Manager</h3>
              <p className="text-muted">Create Classes/Batches</p>
            </div>
          </Link>
          
          <Link to="/admin/staff" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="glass-card">
              <Briefcase size={32} color="var(--primary-hover)" style={{ marginBottom: '16px' }} />
              <h3>Staff Manager</h3>
              <p className="text-muted">Register Teachers</p>
            </div>
          </Link>

          <Link to="/admin/students" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="glass-card">
              <GraduationCap size={32} color="var(--danger-color)" style={{ marginBottom: '16px' }} />
              <h3>Student Manager</h3>
              <p className="text-muted">Register Students</p>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
};
export default AdminDashboard;
