import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { UserPlus, Loader2 } from 'lucide-react';

const Signup = () => {
  const navigate = useNavigate();
  const [batches, setBatches] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    batchId: '',
    section: 'A',
    rollNumber: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'batches'));
      const batchData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setBatches(batchData);
      if (batchData.length > 0) {
        setFormData(prev => ({ ...prev, batchId: batchData[0].id }));
      }
    } catch (err) {
      console.error("Error fetching batches:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!formData.batchId) {
        setError('Please select a class/batch.');
        setLoading(false);
        return;
      }
      
      const batchRef = batches.find(b => b.id === formData.batchId);
      
      const newStudentData = {
        ...formData,
        batchName: batchRef ? batchRef.name : '',
        createdAt: new Date().toISOString()
      };
      
      const docRef = await addDoc(collection(db, 'students'), newStudentData);
      
      localStorage.setItem('role', 'student');
      localStorage.setItem('studentId', docRef.id);
      
      navigate('/student');
    } catch (err) {
      setError('Failed to create account. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container flex-center animate-fade-in" style={{ minHeight: '90vh', padding: '40px 20px' }}>
      <div className="glass-panel" style={{ maxWidth: '500px', width: '100%', padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'inline-flex', padding: '16px', background: '#e0f2fe', borderRadius: '50%', marginBottom: '16px' }}>
            <UserPlus size={48} color="var(--primary-color)" />
          </div>
          <h2 style={{ color: 'var(--primary-color)' }}>Create Account</h2>
          <p className="text-muted">Register as a Student</p>
        </div>

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #f87171', color: '#b91c1c', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2" style={{ gap: '16px' }}>
            <div className="input-group" style={{ marginBottom: '0' }}>
              <label>Full Name</label>
              <input 
                type="text" 
                className="input-field"
                placeholder="Student Name" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            
            <div className="input-group" style={{ marginBottom: '0' }}>
              <label>Roll Number</label>
              <input 
                type="text" 
                className="input-field"
                placeholder="e.g. 101" 
                value={formData.rollNumber}
                onChange={(e) => setFormData({...formData, rollNumber: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="input-group" style={{ marginTop: '16px' }}>
            <label>Email Address</label>
            <input 
              type="email" 
              className="input-field"
              placeholder="Email for login" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>

          <div className="input-group">
            <label>Set Password</label>
            <input 
              type="password" 
              className="input-field"
              placeholder="Create a password" 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>

          <div className="grid grid-cols-2" style={{ gap: '16px', marginBottom: '24px' }}>
            <div className="input-group" style={{ marginBottom: '0' }}>
              <label>Class / Batch</label>
              <select 
                className="input-field"
                value={formData.batchId}
                onChange={(e) => setFormData({...formData, batchId: e.target.value})}
                required
              >
                {batches.length === 0 && <option value="">Loading...</option>}
                {batches.map(batch => (
                  <option key={batch.id} value={batch.id}>{batch.name}</option>
                ))}
              </select>
            </div>
            
            <div className="input-group" style={{ marginBottom: '0' }}>
              <label>Section</label>
              <select 
                className="input-field"
                value={formData.section}
                onChange={(e) => setFormData({...formData, section: e.target.value})}
              >
                <option value="A">Section A</option>
                <option value="B">Section B</option>
                <option value="C">Section C</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginBottom: '16px' }} disabled={loading}>
            {loading ? <Loader2 className="animate-spin" size={20} /> : <UserPlus size={20} />}
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>

          <div style={{ textAlign: 'center' }}>
            <p className="text-muted" style={{ fontSize: '0.9rem' }}>
              Already have an account? <Link to="/login" style={{ color: 'var(--primary-color)', fontWeight: 600, textDecoration: 'none' }}>Login</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
