import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Briefcase, ArrowLeft, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const StaffManager = () => {
  const [staff, setStaff] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const fetchStaff = async () => {
    try {
      const q = query(collection(db, 'teachers'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      setStaff(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'teachers'), {
        name,
        email,
        password,
        role: 'teacher',
        createdAt: new Date().toISOString()
      });
      setName('');
      setEmail('');
      setPassword('');
      fetchStaff();
    } catch (err) {
      alert('Failed to register staff');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <header className="app-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link to="/admin" style={{ color: 'var(--text-color)' }}><ArrowLeft /></Link>
          <h2>Manage Staff</h2>
        </div>
      </header>
      
      <main className="container animate-fade-in">
        <div className="grid grid-cols-2" style={{ gap: '32px' }}>
          
          <div className="glass-panel" style={{ height: 'fit-content' }}>
            <h3 style={{ marginBottom: '24px' }}>Register New Teacher</h3>
            <form onSubmit={handleCreate}>
              <div className="input-group">
                <label>Full Name</label>
                <input type="text" required className="input-field" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div className="input-group">
                <label>Login Email</label>
                <input type="email" required className="input-field" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div className="input-group">
                <label>Login Password</label>
                <input type="text" required className="input-field" value={password} onChange={e => setPassword(e.target.value)} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '16px' }} disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : 'Register Teacher'}
              </button>
            </form>
          </div>

          <div>
            <h3 style={{ marginBottom: '24px' }}>Registered Teachers</h3>
            {fetching ? (
              <Loader2 className="animate-spin" />
            ) : staff.length === 0 ? (
              <p className="text-muted">No teachers registered yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {staff.map(s => (
                  <div key={s.id} className="glass-card" style={{ flexDirection: 'row', alignItems: 'center', gap: '16px' }}>
                    <Briefcase color="var(--primary-hover)" />
                    <div>
                      <h4 style={{ margin: 0 }}>{s.name}</h4>
                      <span className="text-muted" style={{ fontSize: '0.9rem' }}>{s.email}</span>
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
export default StaffManager;
