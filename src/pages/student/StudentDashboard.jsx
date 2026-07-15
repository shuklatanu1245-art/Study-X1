import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Menu, Bell, BookOpen, ClipboardCheck, BookText, 
  Calendar, FileText, CreditCard, Receipt, Megaphone,
  Home, User, MessageSquare, Settings, ChevronRight 
} from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      const studentId = localStorage.getItem('studentId');
      if (!studentId) return;
      try {
        const studentDoc = await getDoc(doc(db, 'students', studentId));
        if (studentDoc.exists()) {
          setStudent({ id: studentDoc.id, ...studentDoc.data() });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('role');
    localStorage.removeItem('studentId');
    navigate('/login');
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '40px', color: '#fff' }}>Loading...</div>;
  if (!student) return <div style={{ textAlign: 'center', padding: '40px', color: '#fff' }}>Error loading student profile.</div>;

  return (
    <div className="mobile-app-container animate-fade-in">
      {/* HEADER */}
      <header className="mobile-app-header">
        <div className="logo-container">
          <Menu size={24} style={{ cursor: 'pointer' }} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ background: 'var(--primary-color)', padding: '4px', borderRadius: '4px' }}>
                <BookOpen size={16} color="#0c1b33" />
              </div>
              <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 600 }}>StudyX</h2>
            </div>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#cbd5e1' }}>Learning Today, Leading Tomorrow</p>
          </div>
        </div>
        <div style={{ position: 'relative', cursor: 'pointer' }}>
          <Bell size={24} />
          <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: '#ef4444', color: 'white', fontSize: '10px', width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>3</span>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="mobile-app-main">
        {/* Greeting Section */}
        <div className="greeting-card">
          <div>
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>Good Morning,</p>
            <h2 style={{ margin: 0, color: '#0f172a', fontSize: '1.5rem', fontWeight: 700 }}>{student.name}</h2>
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>Roll No: {student.rollNumber}</p>
          </div>
          <div className="avatar">
            <User size={32} color="#94a3b8" />
          </div>
        </div>

        {/* Hero Banner */}
        <div className="app-banner">
          <img src="/school_banner.jpg" alt="School Campus" />
          <div className="app-banner-overlay">
            <p style={{ margin: 0, color: '#1e293b', fontWeight: 600, fontSize: '0.9rem' }}>Welcome to</p>
            <h2 style={{ margin: 0, color: '#0f172a', fontSize: '1.4rem', fontWeight: 800, marginBottom: '8px' }}>StudyX Academy</h2>
            <p style={{ margin: 0, color: '#475569', fontSize: '0.8rem', maxWidth: '60%' }}>A Great Place to Learn and Grow</p>
          </div>
        </div>

        {/* Quick Access Title */}
        <h3 style={{ fontSize: '1rem', color: '#0f172a', marginBottom: '16px', fontWeight: 700 }}>Quick Access</h3>
        
        {/* Quick Access Grid */}
        <div className="quick-access-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
          <Link to="/check-attendance" className="qa-card qa-purple">
            <div className="qa-icon-wrap"><ClipboardCheck size={24} /></div>
            <span>Attendance</span>
          </Link>
          
          <Link to="/batches" className="qa-card qa-green">
            <div className="qa-icon-wrap"><BookText size={24} /></div>
            <span>Homework</span>
          </Link>

          <Link to="/timetable" className="qa-card qa-blue">
            <div className="qa-icon-wrap"><Calendar size={24} /></div>
            <span>Timetable</span>
          </Link>

          <Link to="/fee-structure" className="qa-card qa-pink">
            <div className="qa-icon-wrap"><CreditCard size={24} /></div>
            <span>Fee Structure</span>
          </Link>
        </div>

        {/* Announcements */}
        <div className="announcement-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Megaphone size={20} color="#3b82f6" />
            <span style={{ fontSize: '0.9rem', color: '#334155', fontWeight: 500 }}>No new announcements</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', color: '#64748b', fontSize: '0.85rem', cursor: 'pointer' }}>
            View All <ChevronRight size={16} />
          </div>
        </div>
      </main>

      {/* BOTTOM NAVIGATION */}
      <nav className="bottom-nav">
        <button className="nav-item active">
          <Home size={24} />
          <span>Home</span>
        </button>
        <button className="nav-item">
          <User size={24} />
          <span>Profile</span>
        </button>
        <button className="nav-item">
          <MessageSquare size={24} />
          <span>Messages</span>
        </button>
        <div className="nav-item" style={{ position: 'relative' }}>
          <Bell size={24} />
          <span style={{ position: 'absolute', top: '-4px', right: '4px', background: '#ef4444', color: 'white', fontSize: '10px', width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>3</span>
          <span>Notifications</span>
        </div>
        <button className="nav-item" onClick={handleLogout}>
          <Settings size={24} />
          <span>Logout</span>
        </button>
      </nav>
    </div>
  );
};

export default StudentDashboard;
