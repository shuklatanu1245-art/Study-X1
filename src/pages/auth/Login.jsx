import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { UserCircle, Lock, Loader2 } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'student'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (formData.role === 'admin') {
        if (formData.email === 'devshukla1245@gmail.com' && formData.password === 'admin123') {
          localStorage.setItem('role', 'admin');
          navigate('/admin');
        } else {
          setError('Invalid admin credentials');
        }
      } 
      else if (formData.role === 'teacher') {
        const q = query(
          collection(db, 'staff'),
          where('email', '==', formData.email),
          where('password', '==', formData.password)
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          localStorage.setItem('role', 'teacher');
          localStorage.setItem('teacherId', querySnapshot.docs[0].id);
          navigate('/staff');
        } else {
          setError('Invalid teacher credentials');
        }
      }
      else {
        const q = query(
          collection(db, 'students'),
          where('email', '==', formData.email),
          where('password', '==', formData.password)
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          localStorage.setItem('role', 'student');
          localStorage.setItem('studentId', querySnapshot.docs[0].id);
          navigate('/student');
        } else {
          setError('Invalid student credentials');
        }
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container flex-center animate-fade-in" style={{ minHeight: '80vh' }}>
      <div className="glass-panel" style={{ maxWidth: '400px', width: '100%', padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'inline-flex', padding: '16px', background: '#e0f2fe', borderRadius: '50%', marginBottom: '16px' }}>
            <UserCircle size={48} color="var(--primary-color)" />
          </div>
          <h2 style={{ color: 'var(--primary-color)' }}>Welcome Back</h2>
          <p className="text-muted">Login to your account to continue</p>
        </div>

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #f87171', color: '#b91c1c', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Login As</label>
            <select 
              className="input-field"
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher / Staff</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="input-group">
            <label>Email Address</label>
            <input 
              type="email" 
              className="input-field"
              placeholder="Enter your email" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>

          <div className="input-group" style={{ marginBottom: '32px' }}>
            <label>Password</label>
            <input 
              type="password" 
              className="input-field"
              placeholder="Enter your password" 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Lock size={20} />}
            {loading ? 'Logging in...' : 'Login Securely'}
          </button>
          
          {formData.role === 'student' && (
             <div style={{ textAlign: 'center', marginTop: '24px' }}>
                <p className="text-muted" style={{ fontSize: '0.9rem' }}>
                  Don't have an account? <Link to="/signup" style={{ color: 'var(--primary-color)', fontWeight: 600, textDecoration: 'none' }}>Sign Up</Link>
                </p>
             </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
