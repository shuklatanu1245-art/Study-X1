import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Users, ArrowLeft, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const StaffStudentManager = () => {
  const [students, setStudents] = useState([]);
  const [batches, setBatches] = useState([]);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [batchId, setBatchId] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      const bSnapshot = await getDocs(query(collection(db, 'batches'), orderBy('createdAt', 'desc')));
      setBatches(bSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      
      const sSnapshot = await getDocs(query(collection(db, 'students'), orderBy('createdAt', 'desc')));
      setStudents(sSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!batchId) return alert('Please select a batch');
    
    setLoading(true);
    setError('');

    try {
      // Check if email already exists
      const checkEmail = await getDocs(query(collection(db, 'students'), where('email', '==', email)));
      if (!checkEmail.empty) {
        setError('This email is already registered.');
        setLoading(false);
        return;
      }

      await addDoc(collection(db, 'students'), {
        name,
        email,
        password,
        rollNumber,
        batchId,
        role: 'student',
        createdAt: new Date().toISOString()
      });
      setName('');
      setEmail('');
      setPassword('');
      setRollNumber('');
      fetchData();
    } catch (err) {
      setError('Failed to register student');
    } finally {
      setLoading(false);
    }
  };

  const getBatchName = (id) => {
    const b = batches.find(batch => batch.id === id);
    return b ? b.name : 'Unknown Batch';
  };

  return (
    <div>
      <header className="app-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link to="/staff" style={{ color: 'var(--text-color)' }}><ArrowLeft /></Link>
          <h2>Manage Students</h2>
        </div>
      </header>
      
      <main className="container animate-fade-in">
        <div className="grid grid-cols-2" style={{ gap: '32px' }}>
          
          <div className="glass-panel" style={{ height: 'fit-content' }}>
            <h3 style={{ marginBottom: '24px' }}>Manually Register Student</h3>
            
            {error && <div style={{ color: 'var(--danger-color)', marginBottom: '16px' }}>{error}</div>}

            <form onSubmit={handleCreate}>
              <div className="input-group">
                <label>Student Name</label>
                <input type="text" required className="input-field" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div className="input-group">
                <label>Email Address</label>
                <input type="email" required className="input-field" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div className="input-group">
                <label>Password</label>
                <input type="text" required className="input-field" value={password} onChange={e => setPassword(e.target.value)} />
              </div>
              <div className="input-group">
                <label>Roll Number</label>
                <input type="text" required className="input-field" value={rollNumber} onChange={e => setRollNumber(e.target.value)} />
              </div>
              <div className="input-group">
                <label>Select Batch</label>
                <select className="input-field" value={batchId} onChange={e => setBatchId(e.target.value)} required style={{ appearance: 'none', background: 'rgba(15, 23, 42, 0.6)' }}>
                  <option value="" disabled>Select a Batch</option>
                  {batches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
              
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '16px' }} disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : 'Register Student'}
              </button>
            </form>
          </div>

          <div>
            <h3 style={{ marginBottom: '24px' }}>Registered Students</h3>
            {fetching ? (
              <Loader2 className="animate-spin" />
            ) : students.length === 0 ? (
              <p className="text-muted">No students registered yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {students.map(s => (
                  <div key={s.id} className="glass-card" style={{ flexDirection: 'row', alignItems: 'center', gap: '16px' }}>
                    <Users color="var(--success-color)" />
                    <div>
                      <h4 style={{ margin: 0 }}>{s.name} <span style={{ fontWeight: 'normal', color: 'var(--primary-color)' }}>({s.rollNumber})</span></h4>
                      <span className="text-muted" style={{ fontSize: '0.9rem' }}>{getBatchName(s.batchId)}</span>
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
export default StaffStudentManager;
