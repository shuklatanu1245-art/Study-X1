import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { MessageSquare, Reply, Loader2 } from 'lucide-react';

const MessageManager = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState({});
  const [sendingId, setSendingId] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setMessages(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (msgId) => {
    const text = replyText[msgId];
    if (!text || !text.trim()) return;

    setSendingId(msgId);
    try {
      await updateDoc(doc(db, 'messages', msgId), {
        reply: text
      });
      // Update local state
      setMessages(messages.map(m => m.id === msgId ? { ...m, reply: text } : m));
    } catch (err) {
      console.error(err);
      alert('Failed to send reply.');
    } finally {
      setSendingId(null);
    }
  };

  return (
    <div className="animate-fade-in container" style={{ padding: '40px 24px', maxWidth: '800px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
        <MessageSquare size={32} color="var(--primary-color)" />
        <h2 style={{ margin: 0 }}>Student Messages & Doubts</h2>
      </div>

      {loading ? (
        <p>Loading messages...</p>
      ) : messages.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px' }}>
          <p className="text-muted">No messages from students yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {messages.map(msg => (
            <div key={msg.id} className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px' }}>
                <div>
                  <h4 style={{ margin: '0 0 4px 0' }}>{msg.studentName}</h4>
                  <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Class/Batch ID: {msg.batchId || 'N/A'}</span>
                </div>
                <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                  {new Date(msg.createdAt).toLocaleString()}
                </span>
              </div>
              
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
                <p style={{ margin: 0, color: '#334155', fontWeight: 500 }}>Q: {msg.message}</p>
              </div>

              {msg.reply ? (
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ background: '#e0f2fe', padding: '8px', borderRadius: '50%' }}>
                    <Reply size={16} color="#0284c7" />
                  </div>
                  <div>
                    <h5 style={{ margin: '0 0 4px 0', color: '#0284c7' }}>Your Reply:</h5>
                    <p style={{ margin: 0, color: '#334155' }}>{msg.reply}</p>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '12px' }}>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="Type a reply to the student..." 
                    style={{ margin: 0, flex: 1 }}
                    value={replyText[msg.id] || ''}
                    onChange={(e) => setReplyText({ ...replyText, [msg.id]: e.target.value })}
                  />
                  <button 
                    className="btn btn-primary" 
                    onClick={() => handleReply(msg.id)}
                    disabled={sendingId === msg.id}
                  >
                    {sendingId === msg.id ? <Loader2 size={18} className="animate-spin" /> : 'Send Reply'}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MessageManager;
