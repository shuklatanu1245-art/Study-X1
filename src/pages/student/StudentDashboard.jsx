import React, { useState, useEffect } from 'react';
import { LogOut, CalendarCheck, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const studentId = localStorage.getItem('studentId');
      if (!studentId) return;

      try {
        // Fetch Student Info
        const studentDoc = await getDoc(doc(db, 'students', studentId));
        if (studentDoc.exists()) {
          const studData = { id: studentDoc.id, ...studentDoc.data() };
          setStudent(studData);

          // Fetch Attendance
          const aQuery = query(collection(db, 'attendance'), where('batchId', '==', studData.batchId));
          const aSnap = await getDocs(aQuery);
          
          const records = aSnap.docs.map(d => d.data())
            .sort((a, b) => new Date(b.date) - new Date(a.date));
          
          setAttendance(records);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('role');
    localStorage.removeItem('studentId');
    navigate('/login');
  };

  return (
    <div>
      <header className="app-header">
        <h2 className="text-gradient">Student Profile</h2>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <button onClick={handleLogout} className="btn btn-secondary">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </header>

      <main className="container animate-fade-in" style={{ maxWidth: '800px' }}>
        {loading ? (
          <p>Loading...</p>
        ) : student ? (
          <>
            <div className="glass-panel" style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h1 style={{ margin: 0, marginBottom: '8px' }}>Welcome, {student.name}</h1>
                <p className="text-muted">Roll No: {student.rollNumber}</p>
              </div>
              <Link to="/batches" className="btn btn-primary">Go to Study Material</Link>
            </div>

            <h2 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CalendarCheck color="var(--primary-color)" /> My Attendance
            </h2>

            {attendance.length === 0 ? (
              <div className="glass-panel text-center">
                <p className="text-muted">No attendance records found.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {attendance.map((record, index) => {
                  const status = record.records[student.id];
                  if (!status) return null;

                  return (
                    <div key={index} className="glass-card" style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4 style={{ margin: 0 }}>{new Date(record.date).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}</h4>
                      
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
          </>
        ) : (
          <p>Error loading student data.</p>
        )}
      </main>
    </div>
  );
};

export default StudentDashboard;
