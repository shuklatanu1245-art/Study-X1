import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { CalendarCheck, ArrowLeft, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const AttendancePanel = () => {
  const [batches, setBatches] = useState([]);
  const [students, setStudents] = useState([]);
  
  const [selectedBatch, setSelectedBatch] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceRecord, setAttendanceRecord] = useState({});
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const bSnapshot = await getDocs(query(collection(db, 'batches'), orderBy('createdAt', 'desc')));
        setBatches(bSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error(err);
      } finally {
        setFetching(false);
      }
    };
    fetchBatches();
  }, []);

  useEffect(() => {
    if (!selectedBatch) return;
    const fetchStudents = async () => {
      setFetching(true);
      try {
        const sSnapshot = await getDocs(query(collection(db, 'students'), where('batchId', '==', selectedBatch)));
        const studs = sSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setStudents(studs);
        
        // Initialize all as present
        const initialRecord = {};
        studs.forEach(s => { initialRecord[s.id] = 'P'; });
        setAttendanceRecord(initialRecord);
      } catch (err) {
        console.error(err);
      } finally {
        setFetching(false);
      }
    };
    fetchStudents();
  }, [selectedBatch]);

  const handleToggle = (studentId) => {
    setAttendanceRecord(prev => ({
      ...prev,
      [studentId]: prev[studentId] === 'P' ? 'A' : 'P'
    }));
  };

  const handleSave = async () => {
    if (students.length === 0) return alert('No students to mark');
    setLoading(true);
    try {
      await addDoc(collection(db, 'attendance'), {
        date,
        batchId: selectedBatch,
        records: attendanceRecord,
        timestamp: new Date().toISOString()
      });
      alert('Attendance saved successfully!');
    } catch (err) {
      alert('Failed to save attendance');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <header className="app-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link to="/staff" style={{ color: 'var(--text-color)' }}><ArrowLeft /></Link>
          <h2>Mark Attendance</h2>
        </div>
      </header>
      
      <main className="container animate-fade-in">
        <div className="glass-panel" style={{ marginBottom: '32px' }}>
          <div className="grid grid-cols-2" style={{ gap: '16px' }}>
            <div className="input-group">
              <label>Select Date</label>
              <input type="date" className="input-field" value={date} onChange={e => setDate(e.target.value)} required />
            </div>
            <div className="input-group">
              <label>Select Batch</label>
              <select className="input-field" value={selectedBatch} onChange={e => setSelectedBatch(e.target.value)} required style={{ appearance: 'none', background: 'rgba(15, 23, 42, 0.6)' }}>
                <option value="" disabled>Select a Batch</option>
                {batches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
          </div>
        </div>

        {selectedBatch && (
          <div className="glass-panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3>Student List</h3>
              <button onClick={handleSave} className="btn btn-primary" disabled={loading || students.length === 0}>
                {loading ? <Loader2 className="animate-spin" /> : 'Save Attendance'}
              </button>
            </div>

            {fetching ? (
              <div className="flex-center" style={{ padding: '40px' }}><Loader2 className="animate-spin" /></div>
            ) : students.length === 0 ? (
              <p className="text-muted" style={{ textAlign: 'center', padding: '40px' }}>No students found in this batch.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {students.map(s => (
                  <div key={s.id} className="glass-card" style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ margin: 0 }}>{s.name}</h4>
                      <span className="text-muted" style={{ fontSize: '0.9rem' }}>Roll No: {s.rollNumber}</span>
                    </div>
                    <button 
                      onClick={() => handleToggle(s.id)}
                      className="btn" 
                      style={{ 
                        background: attendanceRecord[s.id] === 'P' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                        color: attendanceRecord[s.id] === 'P' ? 'var(--success-color)' : 'var(--danger-color)',
                        minWidth: '120px'
                      }}
                    >
                      {attendanceRecord[s.id] === 'P' ? <><CheckCircle size={18} /> Present</> : <><XCircle size={18} /> Absent</>}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};
export default AttendancePanel;
