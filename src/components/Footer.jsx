import React from 'react';
import { BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container" style={{ padding: 0 }}>
        <div className="grid grid-cols-4" style={{ marginBottom: '40px' }}>
          <div style={{ gridColumn: 'span 2' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <BookOpen size={24} color="var(--primary-color)" />
              <h2 style={{ margin: 0 }}>StudyX</h2>
            </div>
            <p className="text-muted" style={{ maxWidth: '400px' }}>
              Providing the best education at the most affordable prices. India's top teachers are here to help you crack your dream exams.
            </p>
          </div>
          
          <div>
            <h3 style={{ marginBottom: '16px' }}>Company</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <a href="#" className="text-muted" style={{ textDecoration: 'none' }}>About Us</a>
              <a href="#" className="text-muted" style={{ textDecoration: 'none' }}>Contact Us</a>
              <a href="#" className="text-muted" style={{ textDecoration: 'none' }}>Careers</a>
            </div>
          </div>
          
          <div>
            <h3 style={{ marginBottom: '16px' }}>Quick Links</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link to="/batches" className="text-muted" style={{ textDecoration: 'none' }}>Batches</Link>
              <a href="#" className="text-muted" style={{ textDecoration: 'none' }}>PW Store</a>
              <a href="#" className="text-muted" style={{ textDecoration: 'none' }}>Library</a>
            </div>
          </div>
        </div>
        
        <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          © {new Date().getFullYear()} StudyX. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
