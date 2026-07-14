import React, { useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { CalendarCheck, Loader2, CheckCircle, XCircle, Search } from 'lucide-react';

const CheckAttendance = () => {
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
    <div className="container animate-fade-in" style={{ padding: '40px 24px', maxWidth: '800px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <CalendarCheck size={48} color="var(--primary-color)" style={{ marginBottom: '16px' }} />
        <h1 className="hero-title" style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Parent Portal</h1>
        <p className="text-muted" style={{ fontSize: '1.1rem' }}>Enter your child's Roll Number to check their daily attendance.</p>
      </div>

      <div className="glass-panel" style={{ marginBottom: '32px' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '16px' }}>
          <div style={{ flex: 1 }}>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Enter Roll Number (e.g. 10A-45)" 
              value={rollNumber}
              onChange={e => setRollNumber(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ minWidth: '150px' }}>
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
          
          <h3 style={{ marginBottom: '16px' }}>Attendance History</h3>
          
          {attendance.length === 0 ? (
            <p className="text-muted">No attendance records found for this student's class.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {attendance.map((record, index) => {
                const status = record.records[student.id]; // 'P' or 'A' or undefined
                
                if (!status) return null; // Student was not in the list that day

                return (
                  <div key={index} className="glass-card" style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{new Date(record.date).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}</h4>
                    
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
    </div>
  );
};
export default CheckAttendance;
