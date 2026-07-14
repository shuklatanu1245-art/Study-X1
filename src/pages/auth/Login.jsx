import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Loader2 } from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Check Admin
      if (email === 'devshukla1245@gmail.com' && password === 'Admin@1234') {
        localStorage.setItem('role', 'admin');
        navigate('/admin');
        return;
      }

      // Check Teacher in Firestore
      const q = query(collection(db, 'teachers'), where('email', '==', email), where('password', '==', password));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        localStorage.setItem('role', 'teacher');
        localStorage.setItem('teacherId', snapshot.docs[0].id);
        navigate('/staff');
      } else {
        setError('Invalid credentials.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-center" style={{ minHeight: '100vh', padding: '24px' }}>
      <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
            <div style={{ background: 'var(--glass-bg)', padding: '16px', borderRadius: '50%' }}>
              <BookOpen size={40} color="var(--primary-color)" />
            </div>
          </div>
          <h2>Staff Login</h2>
          <p className="text-muted">Enter credentials to access your dashboard</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.2)', color: 'var(--danger-color)', padding: '12px', borderRadius: '8px', marginBottom: '24px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email Address</label>
            <input 
              type="email" 
              className="input-field" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
          </div>
          
          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              className="input-field" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '16px' }} disabled={loading}>
            {loading ? <Loader2 size={20} className="animate-spin" /> : 'Log In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
