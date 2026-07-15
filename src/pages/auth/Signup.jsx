import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GraduationCap, Loader2 } from 'lucide-react';
import { collection, addDoc, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '../../config/firebase';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [batchId, setBatchId] = useState('');
  
  const [batches, setBatches] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  
  const navigate = useNavigate();

  useEffect(() => {
    // If logged in, redirect
    if (localStorage.getItem('role')) {
      const role = localStorage.getItem('role');
      navigate(role === 'admin' ? '/admin' : role === 'teacher' ? '/staff' : '/student');
    }

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
    fetchBatches();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (!batchId) {
      setError('Please select your Class / Section');
      setLoading(false);
      return;
    }

    try {
      // Check if email already exists
      const checkEmail = await getDocs(query(collection(db, 'students'), where('email', '==', email)));
      if (!checkEmail.empty) {
        setError('This email is already registered.');
        setLoading(false);
        return;
      }

      // Add to Firestore
      const docRef = await addDoc(collection(db, 'students'), {
        name,
        email,
        password,
        rollNumber,
        batchId,
        role: 'student',
        createdAt: new Date().toISOString()
      });

      // Auto-login
      localStorage.setItem('role', 'student');
      localStorage.setItem('studentId', docRef.id);
      
      navigate('/student');
    } catch (err) {
      console.error(err);
      setError('An error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-center" style={{ minHeight: '100vh', padding: '24px' }}>
      <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '500px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
            <div style={{ background: 'var(--glass-bg)', padding: '16px', borderRadius: '50%' }}>
              <GraduationCap size={40} color="var(--primary-color)" />
            </div>
          </div>
          <h2>Student Registration</h2>
          <p className="text-muted">Create an account to track your attendance and study material</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.2)', color: 'var(--danger-color)', padding: '12px', borderRadius: '8px', marginBottom: '24px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2" style={{ gap: '0 16px' }}>
            <div className="input-group" style={{ gridColumn: 'span 2' }}>
              <label>Full Name</label>
              <input type="text" className="input-field" required value={name} onChange={e => setName(e.target.value)} placeholder="Student Name" />
            </div>
            
            <div className="input-group">
              <label>Email Address</label>
              <input type="email" className="input-field" required value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
            </div>
            
            <div className="input-group">
              <label>Password</label>
              <input type="password" className="input-field" required value={password} onChange={e => setPassword(e.target.value)} placeholder="Create Password" />
            </div>

            <div className="input-group">
              <label>Roll Number</label>
              <input type="text" className="input-field" required value={rollNumber} onChange={e => setRollNumber(e.target.value)} placeholder="e.g. 10A-45" />
            </div>

            <div className="input-group">
              <label>Class & Section</label>
              <select className="input-field" value={batchId} onChange={e => setBatchId(e.target.value)} required style={{ appearance: 'none', background: 'rgba(15, 23, 42, 0.6)' }} disabled={fetching}>
                <option value="" disabled>{fetching ? 'Loading classes...' : 'Select Class'}</option>
                {batches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '16px' }} disabled={loading}>
            {loading ? <Loader2 size={20} className="animate-spin" /> : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', color: 'var(--text-muted)' }}>
          Already registered? <Link to="/login" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: 'bold' }}>Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
