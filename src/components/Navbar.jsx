import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

const Navbar = () => {
  const role = localStorage.getItem('role');
  
  const getDashboardLink = () => {
    if (role === 'admin') return '/admin';
    if (role === 'teacher') return '/staff';
    if (role === 'student') return '/student';
    return '/login';
  };

  return (
    <nav className="navbar">
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
        <div style={{ background: 'var(--primary-color)', padding: '8px', borderRadius: '8px', display: 'flex' }}>
          <BookOpen size={24} color="var(--bg-color)" />
        </div>
        <h2 style={{ margin: 0, color: 'var(--text-color)' }}>StudyX</h2>
      </Link>
      
      <div className="nav-links">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/batches" className="nav-link">Batches</Link>
        <Link to="/check-attendance" className="nav-link">Attendance</Link>
      </div>
      
      <div>
        {role ? (
          <Link to={getDashboardLink()} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
            Dashboard
          </Link>
        ) : (
          <div style={{ display: 'flex', gap: '12px' }}>
            <Link to="/login" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
              Login
            </Link>
            <Link to="/signup" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
