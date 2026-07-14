import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { BookOpen, ArrowLeft, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const BatchManager = () => {
  const [batches, setBatches] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const fetchBatches = async () => {
    try {
      const q = query(collection(db, 'batches'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      setBatches(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'batches'), {
        name,
        description,
        createdAt: new Date().toISOString()
      });
      setName('');
      setDescription('');
      fetchBatches();
    } catch (err) {
      alert('Failed to create batch');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <header className="app-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link to="/admin" style={{ color: 'var(--text-color)' }}><ArrowLeft /></Link>
          <h2>Manage Batches</h2>
        </div>
      </header>
      
      <main className="container animate-fade-in">
        <div className="grid grid-cols-2" style={{ gap: '32px' }}>
          
          {/* Create Form */}
          <div className="glass-panel" style={{ height: 'fit-content' }}>
            <h3 style={{ marginBottom: '24px' }}>Create New Batch</h3>
            <form onSubmit={handleCreate}>
              <div className="input-group">
                <label>Batch Name (e.g. Class 10 A)</label>
                <input type="text" required className="input-field" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div className="input-group">
                <label>Description</label>
                <input type="text" required className="input-field" value={description} onChange={e => setDescription(e.target.value)} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '16px' }} disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : 'Create Batch'}
              </button>
            </form>
          </div>

          {/* List */}
          <div>
            <h3 style={{ marginBottom: '24px' }}>Existing Batches</h3>
            {fetching ? (
              <Loader2 className="animate-spin" />
            ) : batches.length === 0 ? (
              <p className="text-muted">No batches created yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {batches.map(b => (
                  <div key={b.id} className="glass-card" style={{ flexDirection: 'row', alignItems: 'center', gap: '16px' }}>
                    <BookOpen color="var(--primary-color)" />
                    <div>
                      <h4 style={{ margin: 0 }}>{b.name}</h4>
                      <span className="text-muted" style={{ fontSize: '0.9rem' }}>{b.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
};
export default BatchManager;
