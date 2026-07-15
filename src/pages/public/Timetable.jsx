import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Calendar, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Timetable = () => {
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        const studentId = localStorage.getItem('studentId');
        if (!studentId) {
          setError('You must be logged in as a student to view your timetable.');
          setLoading(false);
          return;
        }

        // 1. Get student's batch ID
        const studentDoc = await getDoc(doc(db, 'students', studentId));
        if (!studentDoc.exists() || !studentDoc.data().batchId) {
          setError('Student profile or class not found.');
          setLoading(false);
          return;
        }

        const batchId = studentDoc.data().batchId;

        // 2. Get timetable for that batch
        const timetableDoc = await getDoc(doc(db, 'timetables', batchId));
        if (timetableDoc.exists() && timetableDoc.data().imageUrl) {
          setImageUrl(timetableDoc.data().imageUrl);
        }
      } catch (err) {
        console.error('Error fetching timetable:', err);
        setError('Failed to load timetable.');
      } finally {
        setLoading(false);
      }
    };

    fetchTimetable();
  }, []);

  return (
    <div className="mobile-app-container animate-fade-in" style={{ backgroundColor: '#fff', minHeight: '100vh' }}>
      <header className="mobile-app-header" style={{ paddingBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <ArrowLeft size={24} style={{ cursor: 'pointer' }} onClick={() => navigate(-1)} />
          <h2 style={{ margin: 0, fontSize: '1.2rem' }}>Class Timetable</h2>
        </div>
      </header>

      <main style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <div style={{ padding: '12px', background: '#e0f2fe', borderRadius: '12px' }}>
            <Calendar size={28} color="#0284c7" />
          </div>
          <div>
            <h3 style={{ margin: 0, color: '#0f172a' }}>Weekly Schedule</h3>
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>Your periods & subjects</p>
          </div>
        </div>

        {error && (
          <div style={{ padding: '12px', background: '#fef2f2', color: '#b91c1c', borderRadius: '8px', marginBottom: '24px' }}>
            {error}
          </div>
        )}

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Loading timetable...</div>
        ) : imageUrl ? (
          <div style={{ border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <img src={imageUrl} alt="Class Timetable" style={{ width: '100%', display: 'block' }} />
          </div>
        ) : !error ? (
          <div style={{ padding: '40px', textAlign: 'center', background: '#f8fafc', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
            <p style={{ color: '#64748b' }}>Timetable has not been uploaded by your teacher yet.</p>
          </div>
        ) : null}
      </main>
    </div>
  );
};

export default Timetable;
