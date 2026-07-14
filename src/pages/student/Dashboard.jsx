import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { BookOpen, PlayCircle, FileText } from 'lucide-react';

const Dashboard = () => {
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
    <div>
      <header className="app-header">
        <h2 className="text-gradient">StudyX</h2>
      </header>

      <main className="container animate-fade-in">
        <div className="flex-between" style={{ marginBottom: '32px' }}>
          <h1>Learning Hub</h1>
          <div style={{ padding: '8px 16px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', color: 'var(--primary-color)', fontWeight: '600' }}>
            Available Courses: {contents.length}
          </div>
        </div>

        {loading ? (
          <div className="flex-center" style={{ height: '200px' }}>
            <div className="text-muted">Loading contents...</div>
          </div>
        ) : contents.length === 0 ? (
          <div className="glass-panel" style={{ textAlign: 'center', padding: '48px' }}>
            <BookOpen size={48} color="var(--text-muted)" style={{ marginBottom: '16px', display: 'inline-block' }} />
            <h3>No content available yet</h3>
            <p className="text-muted">Teachers haven't uploaded anything.</p>
          </div>
        ) : (
          <div className="grid grid-cols-3">
            {contents.map(item => (
              <div key={item.id} className="glass-card" onClick={() => window.open(item.url, '_blank')}>
                {item.type === 'video' ? (
                  <PlayCircle size={32} color="var(--primary-color)" style={{ marginBottom: '16px' }} />
                ) : (
                  <FileText size={32} color="var(--success-color)" style={{ marginBottom: '16px' }} />
                )}
                <h3>{item.title}</h3>
                <p className="text-muted" style={{ marginTop: 'auto', paddingTop: '16px' }}>{item.subject}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
export default Dashboard;
