import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { CreditCard, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FeeStructure = () => {
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeeStructure = async () => {
      try {
        const docRef = doc(db, 'settings', 'fees');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().imageUrl) {
          setImageUrl(docSnap.data().imageUrl);
        }
      } catch (err) {
        console.error('Error fetching fee structure:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeeStructure();
  }, []);

  return (
    <div className="mobile-app-container animate-fade-in" style={{ backgroundColor: '#fff', minHeight: '100vh' }}>
      <header className="mobile-app-header" style={{ paddingBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <ArrowLeft size={24} style={{ cursor: 'pointer' }} onClick={() => navigate(-1)} />
          <h2 style={{ margin: 0, fontSize: '1.2rem' }}>Fee Structure</h2>
        </div>
      </header>

      <main style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <div style={{ padding: '12px', background: '#fce7f3', borderRadius: '12px' }}>
            <CreditCard size={28} color="#db2777" />
          </div>
          <div>
            <h3 style={{ margin: 0, color: '#0f172a' }}>School Fees</h3>
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>Installments & details by class</p>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Loading fee structure...</div>
        ) : imageUrl ? (
          <div style={{ border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <img src={imageUrl} alt="Fee Structure" style={{ width: '100%', display: 'block' }} />
          </div>
        ) : (
          <div style={{ padding: '40px', textAlign: 'center', background: '#f8fafc', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
            <p style={{ color: '#64748b' }}>Fee structure has not been uploaded yet.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default FeeStructure;
