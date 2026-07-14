import React, { useState } from 'react';
import { uploadToCloudinary } from '../../services/cloudinary';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { UploadCloud, CheckCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const ContentManager = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    try {
      const url = await uploadToCloudinary(file);
      await addDoc(collection(db, 'contents'), {
        title,
        subject,
        url,
        type: file.type.includes('video') ? 'video' : 'document',
        createdAt: new Date().toISOString()
      });
      setSuccess(true);
      setTitle('');
      setSubject('');
      setFile(null);
    } catch (err) {
      alert('Upload failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <header className="app-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link to="/admin" style={{ color: 'var(--text-color)' }}><ArrowLeft /></Link>
          <h2>Upload Content</h2>
        </div>
      </header>
      
      <main className="container flex-center animate-fade-in">
        <div className="glass-panel" style={{ width: '100%', maxWidth: '600px' }}>
          {success && (
            <div style={{ background: 'rgba(16, 185, 129, 0.2)', color: 'var(--success-color)', padding: '16px', borderRadius: '8px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle /> Successfully uploaded and saved to Cloudinary!
            </div>
          )}
          
          <form onSubmit={handleUpload}>
            <div className="input-group">
              <label>Content Title</label>
              <input type="text" required className="input-field" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Physics Chapter 1" />
            </div>
            
            <div className="input-group">
              <label>Subject</label>
              <input type="text" required className="input-field" value={subject} onChange={e => setSubject(e.target.value)} placeholder="e.g. Physics" />
            </div>
            
            <div className="input-group">
              <label>File (Video/PDF/Image)</label>
              <div style={{ border: '2px dashed var(--glass-border)', padding: '32px', textAlign: 'center', borderRadius: '12px', background: 'rgba(0,0,0,0.2)' }}>
                <input type="file" required onChange={e => setFile(e.target.files[0])} style={{ marginBottom: '16px', color: 'white' }} />
                <p className="text-muted">Cloudinary handles secure uploads</p>
              </div>
            </div>
            
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '24px' }} disabled={loading || !file}>
              {loading ? <Loader2 className="animate-spin" /> : <><UploadCloud /> Upload to Cloud</>}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};
export default ContentManager;
