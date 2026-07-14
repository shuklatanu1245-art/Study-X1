import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

const Navbar = () => {
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
        <a href="#study-material" className="nav-link">Study Material</a>
      </div>
      
      <div>
        <Link to="/admin-login" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
          Admin Login
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
