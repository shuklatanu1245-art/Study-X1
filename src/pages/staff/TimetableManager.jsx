import React, { useState, useEffect } from 'react';
import { collection, doc, getDoc, setDoc, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { uploadToCloudinary } from '../../utils/cloudinary';
import { UploadCloud, Save, Loader2, CheckCircle, Image as ImageIcon, Calendar } from 'lucide-react';

const TimetableManager = () => {
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  
  const [currentImage, setCurrentImage] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBatches();
  }, []);

  useEffect(() => {
    if (selectedBatch) {
      fetchTimetableForBatch(selectedBatch);
    } else {
      setCurrentImage('');
      setPreview('');
      setFile(null);
    }
  }, [selectedBatch]);

  const fetchBatches = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'batches'));
      const batchData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBatches(batchData);
      if (batchData.length > 0) setSelectedBatch(batchData[0].id);
    } catch (err) {
      console.error("Error fetching batches:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTimetableForBatch = async (batchId) => {
    try {
      const docRef = doc(db, 'timetables', batchId);
      const docSnap = await getDoc(docRef);
      setPreview('');
      setFile(null);
      if (docSnap.exists() && docSnap.data().imageUrl) {
        setCurrentImage(docSnap.data().imageUrl);
      } else {
        setCurrentImage('');
      }
    } catch (err) {
      console.error('Error fetching timetable:', err);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!selectedBatch) {
      setError('Please select a class first.');
      return;
    }
    if (!file && !currentImage) {
      setError('Please select an image first.');
      return;
    }

    setUploading(true);
    setMessage('');
    setError('');

    try {
      let finalUrl = currentImage;
      if (file) {
        const configRef = doc(db, 'settings', 'cloudinary');
        const configSnap = await getDoc(configRef);
        
        if (!configSnap.exists() || !configSnap.data().cloudName || !configSnap.data().uploadPreset) {
          throw new Error('Cloudinary config is missing. Contact Admin to set up App Settings.');
        }

        const { cloudName, uploadPreset } = configSnap.data();
        finalUrl = await uploadToCloudinary(file, cloudName, uploadPreset);
      }

      await setDoc(doc(db, 'timetables', selectedBatch), { 
        imageUrl: finalUrl, 
        updatedAt: new Date().toISOString() 
      });
      
      setCurrentImage(finalUrl);
      setFile(null);
      setMessage('Timetable successfully updated for this class!');
      setTimeout(() => setMessage(''), 3000);
      
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to upload timetable.');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading classes...</div>;

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
        <Calendar size={32} color="var(--primary-color)" />
        <h2 style={{ margin: 0 }}>Manage Timetable</h2>
      </div>

      <div className="glass-panel" style={{ maxWidth: '700px' }}>
        <p className="text-muted" style={{ marginBottom: '24px' }}>
          Select a class and upload their weekly timetable image.
        </p>

        {error && (
          <div style={{ padding: '12px', background: '#fef2f2', color: '#b91c1c', borderRadius: '8px', marginBottom: '24px' }}>
            {error}
          </div>
        )}
        
        {message && (
          <div style={{ padding: '12px', background: '#dcfce7', color: '#166534', borderRadius: '8px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle size={20} />
            {message}
          </div>
        )}

        <form onSubmit={handleSave}>
          <div className="input-group">
            <label>Select Class / Batch</label>
            <select 
              className="input-field" 
              value={selectedBatch} 
              onChange={(e) => setSelectedBatch(e.target.value)}
              required
            >
              <option value="" disabled>Select a class...</option>
              {batches.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>

          <div className="input-group" style={{ marginBottom: '24px' }}>
            <label>Select Timetable Image</label>
            <input 
              type="file" 
              accept="image/*"
              className="input-field"
              onChange={handleFileChange}
              style={{ padding: '8px', background: '#f8fafc' }}
            />
          </div>

          {(preview || currentImage) && (
            <div style={{ marginBottom: '24px', border: '1px solid var(--glass-border)', borderRadius: '12px', overflow: 'hidden' }}>
              <div style={{ background: '#f1f5f9', padding: '12px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--glass-border)' }}>
                <ImageIcon size={18} color="#64748b" />
                <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600 }}>Preview</span>
              </div>
              <img 
                src={preview || currentImage} 
                alt="Timetable Preview" 
                style={{ width: '100%', maxHeight: '500px', objectFit: 'contain', display: 'block', background: '#fff' }}
              />
            </div>
          )}

          <button type="submit" className="btn btn-primary" disabled={uploading || !selectedBatch}>
            {uploading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            {uploading ? 'Uploading...' : 'Save Timetable'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TimetableManager;
