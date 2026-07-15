import React, { useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { CalendarCheck, Loader2, CheckCircle, XCircle, Search, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CheckAttendance = () => {
  const navigate = useNavigate();
  const [rollNumber, setRollNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [student, setStudent] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!rollNumber) return;
    
    setLoading(true);
    setError('');
    setStudent(null);
    setAttendance([]);

    try {
      // 1. Find Student by Roll Number
      const sQuery = query(collection(db, 'students'), where('rollNumber', '==', rollNumber));
      const sSnap = await getDocs(sQuery);
      
      if (sSnap.empty) {
        setError('No student found with this Roll Number.');
        setLoading(false);
        return;
      }
      
      const studData = { id: sSnap.docs[0].id, ...sSnap.docs[0].data() };
      setStudent(studData);

      // 2. Fetch Attendance for their Batch
      const aQuery = query(collection(db, 'attendance'), where('batchId', '==', studData.batchId));
      const aSnap = await getDocs(aQuery);
      
      // Sort by date descending
      const records = aSnap.docs.map(doc => doc.data())
        .sort((a, b) => new Date(b.date) - new Date(a.date));
      
      setAttendance(records);
    } catch (err) {
      console.error(err);
      setError('An error occurred while fetching attendance.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mobile-app-container animate-fade-in" style={{ backgroundColor: '#fff', minHeight: '100vh' }}>
      <header className="mobile-app-header" style={{ paddingBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <ArrowLeft size={24} style={{ cursor: 'pointer' }} onClick={() => navigate('/student')} />
          <h2 style={{ margin: 0, fontSize: '1.2rem' }}>Attendance</h2>
        </div>
      </header>

      <main style={{ padding: '24px' }}>
        <div className="glass-panel" style={{ marginBottom: '32px' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '16px' }}>
            <div style={{ flex: 1 }}>
              <input 
                type="text" 
                className="input-field" 
                placeholder="Enter Roll Number" 
                value={rollNumber}
                onChange={e => setRollNumber(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ minWidth: '100px' }}>
              {loading ? <Loader2 className="animate-spin" /> : <><Search size={18} /> Check</>}
            </button>
          </form>
          {error && <p style={{ color: 'var(--danger-color)', marginTop: '16px', textAlign: 'center' }}>{error}</p>}
        </div>

        {student && (
          <div className="animate-fade-in">
            <div className="glass-panel" style={{ marginBottom: '24px', background: 'rgba(212, 175, 55, 0.1)', borderColor: 'var(--primary-color)' }}>
              <h3 style={{ margin: 0, color: 'var(--primary-color)' }}>Student: {student.name}</h3>
            </div>
            
            <h3 style={{ marginBottom: '16px', color: '#1e293b' }}>History</h3>
            
            {attendance.length === 0 ? (
              <p className="text-muted">No attendance records found.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {attendance.map((record, index) => {
                  const status = record.records[student.id];
                  
                  if (!status) return null;

                  return (
                    <div key={index} className="glass-card" style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4 style={{ margin: 0, fontSize: '1rem', color: '#1e293b' }}>
                        {new Date(record.date).toLocaleDateString('en-GB', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </h4>
                      
                      {status === 'P' ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--success-color)', fontWeight: 'bold' }}>
                          <CheckCircle size={20} /> Present
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--danger-color)', fontWeight: 'bold' }}>
                          <XCircle size={20} /> Absent
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default CheckAttendance;
