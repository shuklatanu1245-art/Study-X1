import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Megaphone, Trash2, Send, Loader2, CheckCircle } from 'lucide-react';

const AnnouncementsManager = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const q = query(collection(db, 'announcements'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setAnnouncements(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePost = async (e) => {
    e.preventDefault();
    if (!title || !content) return;
    
    setSending(true);
    try {
      const newAnn = {
        title,
        content,
        createdAt: new Date().toISOString(),
        authorRole: localStorage.getItem('role') || 'Admin'
      };
      const docRef = await addDoc(collection(db, 'announcements'), newAnn);
      setAnnouncements([{ id: docRef.id, ...newAnn }, ...announcements]);
      setTitle('');
      setContent('');
      setMessage('Announcement broadcasted successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
      alert('Failed to post announcement.');
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this announcement?')) return;
    try {
      await deleteDoc(doc(db, 'announcements', id));
      setAnnouncements(announcements.filter(a => a.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="animate-fade-in container" style={{ padding: '40px 24px', maxWidth: '800px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
        <Megaphone size={32} color="var(--primary-color)" />
        <h2 style={{ margin: 0 }}>Broadcast Announcements</h2>
      </div>

      <div className="glass-panel" style={{ marginBottom: '32px' }}>
        <h3 style={{ marginBottom: '16px' }}>New Announcement</h3>
        {message && (
          <div style={{ padding: '12px', background: '#dcfce7', color: '#166534', borderRadius: '8px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle size={20} />
            {message}
          </div>
        )}
        <form onSubmit={handlePost}>
          <div className="input-group">
            <label>Title / Subject</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="e.g., Tomorrow is a Holiday" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              required 
            />
          </div>
          <div className="input-group" style={{ marginBottom: '24px' }}>
            <label>Message Content</label>
            <textarea 
              className="input-field" 
              placeholder="Write the full announcement here..." 
              rows="4" 
              value={content} 
              onChange={e => setContent(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={sending}>
            {sending ? <Loader2 className="animate-spin" /> : <Send size={20} />}
            {sending ? 'Broadcasting...' : 'Broadcast to All Students'}
          </button>
        </form>
      </div>

      <h3>Recent Announcements</h3>
      {loading ? (
        <p>Loading...</p>
      ) : announcements.length === 0 ? (
        <p className="text-muted">No announcements made yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {announcements.map(ann => (
            <div key={ann.id} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '1.1rem' }}>{ann.title}</h4>
                <p style={{ margin: '0 0 12px 0', color: '#475569' }}>{ann.content}</p>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  Posted on {new Date(ann.createdAt).toLocaleDateString()}
                </span>
              </div>
              <button 
                onClick={() => handleDelete(ann.id)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '8px' }}
                title="Delete Announcement"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AnnouncementsManager;
