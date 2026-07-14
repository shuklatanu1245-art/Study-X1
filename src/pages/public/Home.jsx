import React from 'react';
import { Link } from 'react-router-dom';
import { PlayCircle, FileText, CheckCircle } from 'lucide-react';

const Home = () => {
  return (
    <div className="container animate-fade-in">
      <section className="hero-section">
        <div className="hero-content">
          <span className="badge">New Batches Available</span>
          <h1 className="hero-title">Crack Your Exams with Top Educators</h1>
          <p className="text-muted" style={{ fontSize: '1.2rem', marginBottom: '32px' }}>
            Get access to live classes, recorded lectures, and premium study material at the most affordable prices.
          </p>
          <div style={{ display: 'flex', gap: '16px' }}>
            <Link to="/batches" className="btn btn-primary" style={{ padding: '16px 32px' }}>Explore Batches</Link>
            <a href="#features" className="btn btn-secondary" style={{ padding: '16px 32px' }}>Know More</a>
          </div>
        </div>
      </section>

      <section id="features" style={{ margin: '80px 0' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2>Why Study With Us?</h2>
          <p className="text-muted">Everything you need to succeed in your journey</p>
        </div>
        
        <div className="grid grid-cols-3">
          <div className="glass-panel" style={{ textAlign: 'center' }}>
            <PlayCircle size={48} color="var(--primary-color)" style={{ marginBottom: '24px' }} />
            <h3>Premium Lectures</h3>
            <p className="text-muted">Learn from the best teachers with high-quality recorded videos.</p>
          </div>
          
          <div className="glass-panel" style={{ textAlign: 'center' }}>
            <FileText size={48} color="var(--success-color)" style={{ marginBottom: '24px' }} />
            <h3>Detailed Notes</h3>
            <p className="text-muted">Get comprehensive PDF notes for every single chapter.</p>
          </div>
          
          <div className="glass-panel" style={{ textAlign: 'center' }}>
            <CheckCircle size={48} color="var(--primary-hover)" style={{ marginBottom: '24px' }} />
            <h3>Test Series</h3>
            <p className="text-muted">Practice with mock tests designed by exam experts.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
