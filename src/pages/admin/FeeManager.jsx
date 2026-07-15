import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { uploadToCloudinary } from '../../utils/cloudinary';
import { UploadCloud, Save, Loader2, CheckCircle, Image as ImageIcon } from 'lucide-react';

const FeeManager = () => {
  const [feeImage, setFeeImage] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFeeStructure();
  }, []);

  const fetchFeeStructure = async () => {
    try {
      const docRef = doc(db, 'settings', 'fees');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists() && docSnap.data().imageUrl) {
        setFeeImage(docSnap.data().imageUrl);
      }
    } catch (err) {
      console.error('Error fetching fee settings:', err);
    } finally {
      setLoading(false);
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
    if (!file && !feeImage) {
      setError('Please select an image first.');
      return;
    }

    setUploading(true);
    setMessage('');
    setError('');

    try {
      // 1. Fetch Cloudinary config
      const configRef = doc(db, 'settings', 'cloudinary');
      const configSnap = await getDoc(configRef);
      
      if (!configSnap.exists() || !configSnap.data().cloudName || !configSnap.data().uploadPreset) {
        throw new Error('Cloudinary config is missing. Please set it up in App Settings first.');
      }

      const { cloudName, uploadPreset } = configSnap.data();

      // 2. Upload to Cloudinary if new file
      let finalUrl = feeImage;
      if (file) {
        finalUrl = await uploadToCloudinary(file, cloudName, uploadPreset);
      }

      // 3. Save URL to database
      await setDoc(doc(db, 'settings', 'fees'), { imageUrl: finalUrl, updatedAt: new Date().toISOString() });
      
      setFeeImage(finalUrl);
      setFile(null);
      setMessage('Fee Structure successfully updated!');
      setTimeout(() => setMessage(''), 3000);
      
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to upload fee structure.');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
        <UploadCloud size={32} color="var(--primary-color)" />
        <h2 style={{ margin: 0 }}>Manage Fee Structure</h2>
      </div>

      <div className="glass-panel" style={{ maxWidth: '700px' }}>
        <p className="text-muted" style={{ marginBottom: '24px' }}>
          Upload an image of your school's fee structure. This will be visible to all students in their dashboard.
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
          <div className="input-group" style={{ marginBottom: '24px' }}>
            <label>Select Image File</label>
            <input 
              type="file" 
              accept="image/*"
              className="input-field"
              onChange={handleFileChange}
              style={{ padding: '8px', background: '#f8fafc' }}
            />
          </div>

          {(preview || feeImage) && (
            <div style={{ marginBottom: '24px', border: '1px solid var(--glass-border)', borderRadius: '12px', overflow: 'hidden' }}>
              <div style={{ background: '#f1f5f9', padding: '12px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--glass-border)' }}>
                <ImageIcon size={18} color="#64748b" />
                <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600 }}>Preview</span>
              </div>
              <img 
                src={preview || feeImage} 
                alt="Fee Structure Preview" 
                style={{ width: '100%', maxHeight: '500px', objectFit: 'contain', display: 'block', background: '#fff' }}
              />
            </div>
          )}

          <button type="submit" className="btn btn-primary" disabled={uploading}>
            {uploading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            {uploading ? 'Uploading...' : 'Save & Publish'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FeeManager;
