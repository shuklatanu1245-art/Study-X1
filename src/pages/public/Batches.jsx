import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { PlayCircle, FileText, Loader2 } from 'lucide-react';

const Batches = () => {
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContents = async () => {
      try {
        const q = query(collection(db, 'contents'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setContents(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchContents();
  }, []);

  return (
    <div className="container animate-fade-in" style={{ padding: '40px 24px' }}>
      <div style={{ marginBottom: '40px' }}>
        <h1 className="hero-title" style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Our Study Material</h1>
        <p className="text-muted" style={{ fontSize: '1.1rem' }}>Access all the lectures and notes uploaded by the admin.</p>
      </div>

      {loading ? (
        <div className="flex-center" style={{ height: '300px' }}>
          <Loader2 className="animate-spin" size={40} color="var(--primary-color)" />
        </div>
      ) : contents.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px' }}>
          <h3>No study material available yet</h3>
          <p className="text-muted">Please check back later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3">
          {contents.map(item => (
            <div key={item.id} className="glass-card" onClick={() => window.open(item.url, '_blank')}>
              <div className="batch-image">
                {item.type === 'video' ? (
                  <PlayCircle size={64} color="rgba(255,255,255,0.5)" />
                ) : (
                  <FileText size={64} color="rgba(255,255,255,0.5)" />
                )}
              </div>
              <div style={{ marginTop: 'auto' }}>
                <span className="badge">{item.subject}</span>
                <h3 style={{ margin: '8px 0', fontSize: '1.2rem' }}>{item.title}</h3>
                <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--success-color)', fontWeight: 'bold' }}>Free</span>
                  <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>View Details</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Batches;
