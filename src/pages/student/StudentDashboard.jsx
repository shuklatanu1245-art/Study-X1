import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Menu, Bell, BookOpen, ClipboardCheck, BookText, 
  Calendar, CreditCard, Megaphone,
  Home, User, MessageSquare, Settings, ChevronRight, Loader2, Send
} from 'lucide-react';
import { doc, getDoc, collection, query, orderBy, getDocs, addDoc, where } from 'firebase/firestore';
import { db } from '../../config/firebase';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('home');

  // New states for Messages & Notifications
  const [announcements, setAnnouncements] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    const fetchStudentData = async () => {
      const studentId = localStorage.getItem('studentId');
      if (!studentId) return;
      
      try {
        // Fetch Student Profile
        const studentDoc = await getDoc(doc(db, 'students', studentId));
        if (studentDoc.exists()) {
          const studentData = { id: studentDoc.id, ...studentDoc.data() };
          setStudent(studentData);
          
          // Fetch Announcements
          const aQuery = query(collection(db, 'announcements'), orderBy('createdAt', 'desc'));
          const aSnap = await getDocs(aQuery);
          setAnnouncements(aSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

          // Fetch Messages
          const mQuery = query(collection(db, 'messages'), where('studentId', '==', studentId));
          const mSnap = await getDocs(mQuery);
          const msgs = mSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          // sort locally since we used a where clause and need composite index if we orderBy
          msgs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setMessages(msgs);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudentData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('role');
    localStorage.removeItem('studentId');
    navigate('/login');
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setSendingMessage(true);
    try {
      const msgData = {
        studentId: student.id,
        studentName: student.name,
        batchId: student.batchId || '',
        message: newMessage,
        reply: '',
        createdAt: new Date().toISOString()
      };
      
      const docRef = await addDoc(collection(db, 'messages'), msgData);
      setMessages([{ id: docRef.id, ...msgData }, ...messages]);
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Failed to send message.');
    } finally {
      setSendingMessage(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '40px', color: '#fff' }}>Loading...</div>;
  if (!student) return <div style={{ textAlign: 'center', padding: '40px', color: '#fff' }}>Error loading student profile.</div>;

  const unreadAnnouncements = announcements.length > 0; // Simple unread indicator logic

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
        <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setActiveTab('notifications')}>
          <Bell size={24} />
          {unreadAnnouncements && (
            <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: '#ef4444', color: 'white', fontSize: '10px', width: '10px', height: '10px', borderRadius: '50%' }}></span>
          )}
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="mobile-app-main">
        {activeTab === 'home' && (
          <>
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

            {/* Announcements Preview */}
            {announcements.length > 0 && (
              <div className="announcement-bar" onClick={() => setActiveTab('notifications')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, overflow: 'hidden' }}>
                  <Megaphone size={20} color="#3b82f6" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: '0.9rem', color: '#334155', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {announcements[0].title}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', color: '#64748b', fontSize: '0.85rem', cursor: 'pointer', flexShrink: 0 }}>
                  View All <ChevronRight size={16} />
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'profile' && (
          <div className="animate-fade-in" style={{ padding: '20px 0' }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div style={{ display: 'inline-flex', padding: '24px', background: '#e2e8f0', borderRadius: '50%', marginBottom: '16px' }}>
                <User size={64} color="#64748b" />
              </div>
              <h2 style={{ margin: 0, color: '#0f172a' }}>{student.name}</h2>
              <p style={{ margin: 0, color: '#64748b' }}>Student Profile</p>
            </div>

            <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9', marginBottom: '16px' }}>
                <span style={{ color: '#64748b' }}>Email</span>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>{student.email}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9', marginBottom: '16px' }}>
                <span style={{ color: '#64748b' }}>Roll Number</span>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>{student.rollNumber}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9', marginBottom: '16px' }}>
                <span style={{ color: '#64748b' }}>Class/Batch</span>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>{student.batchName || 'Not Assigned'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Section</span>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>{student.section || 'A'}</span>
              </div>
            </div>

            <button className="btn btn-secondary" style={{ width: '100%', padding: '16px', background: '#fef2f2', color: '#dc2626', borderColor: '#fecaca', display: 'flex', justifyContent: 'center', gap: '8px' }} onClick={handleLogout}>
              <Settings size={20} /> Logout from Account
            </button>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="animate-fade-in" style={{ padding: '10px 0', display: 'flex', flexDirection: 'column', height: '100%' }}>
            <h3 style={{ margin: '0 0 16px 0', color: '#0f172a' }}>Ask a Doubt / Message</h3>
            
            <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
              <input 
                type="text" 
                className="input-field" 
                style={{ flex: 1, margin: 0, borderRadius: '24px', padding: '12px 20px' }}
                placeholder="Type your message to teachers..." 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-primary" style={{ borderRadius: '50%', width: '48px', height: '48px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }} disabled={sendingMessage}>
                {sendingMessage ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
              </button>
            </form>

            <div style={{ flex: 1, overflowY: 'auto' }}>
              {messages.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#94a3b8', padding: '40px 0' }}>
                  <MessageSquare size={48} color="#cbd5e1" style={{ marginBottom: '12px' }} />
                  <p style={{ margin: 0 }}>No messages yet.<br/>Send a message to your teachers!</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {messages.map(msg => (
                    <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {/* Student Message Bubble */}
                      <div style={{ alignSelf: 'flex-end', background: 'var(--primary-color)', color: 'white', padding: '12px 16px', borderRadius: '16px 16px 0 16px', maxWidth: '85%' }}>
                        <p style={{ margin: 0, fontSize: '0.95rem' }}>{msg.message}</p>
                        <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.7)', marginTop: '4px', display: 'block', textAlign: 'right' }}>
                          {new Date(msg.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      
                      {/* Teacher Reply Bubble */}
                      {msg.reply && (
                        <div style={{ alignSelf: 'flex-start', background: '#f1f5f9', color: '#0f172a', padding: '12px 16px', borderRadius: '16px 16px 16px 0', maxWidth: '85%', border: '1px solid #e2e8f0' }}>
                          <p style={{ margin: 0, fontSize: '0.95rem' }}>{msg.reply}</p>
                          <span style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '4px', display: 'block' }}>
                            Reply from Teacher
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="animate-fade-in" style={{ padding: '10px 0' }}>
            <h3 style={{ margin: '0 0 16px 0', color: '#0f172a' }}>School Announcements</h3>
            
            {announcements.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#94a3b8', padding: '40px 0' }}>
                <Bell size={48} color="#cbd5e1" style={{ marginBottom: '12px' }} />
                <p style={{ margin: 0 }}>No new announcements from the school.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {announcements.map(ann => (
                  <div key={ann.id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '4px', background: 'var(--primary-color)' }}></div>
                    <h4 style={{ margin: '0 0 8px 0', color: '#0f172a', fontSize: '1.05rem' }}>{ann.title}</h4>
                    <p style={{ margin: 0, color: '#475569', fontSize: '0.9rem', lineHeight: '1.5' }}>{ann.content}</p>
                    <span style={{ display: 'block', marginTop: '12px', fontSize: '0.75rem', color: '#94a3b8' }}>
                      {new Date(ann.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* BOTTOM NAVIGATION */}
      <nav className="bottom-nav">
        <button className={`nav-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>
          <Home size={24} />
          <span>Home</span>
        </button>
        <button className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
          <User size={24} />
          <span>Profile</span>
        </button>
        <button className={`nav-item ${activeTab === 'messages' ? 'active' : ''}`} onClick={() => setActiveTab('messages')}>
          <MessageSquare size={24} />
          <span>Messages</span>
        </button>
        <button className={`nav-item ${activeTab === 'notifications' ? 'active' : ''}`} onClick={() => setActiveTab('notifications')} style={{ position: 'relative' }}>
          <Bell size={24} />
          {unreadAnnouncements && activeTab !== 'notifications' && (
            <span style={{ position: 'absolute', top: '-4px', right: '4px', background: '#ef4444', color: 'white', fontSize: '10px', width: '10px', height: '10px', borderRadius: '50%' }}></span>
          )}
          <span>Notifs</span>
        </button>
        <button className="nav-item" onClick={handleLogout}>
          <Settings size={24} />
          <span>Logout</span>
        </button>
      </nav>
    </div>
  );
};

export default StudentDashboard;
