import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Settings, Save, Loader2, CheckCircle } from 'lucide-react';

const AppSettings = () => {
  const [settings, setSettings] = useState({
    cloudName: '',
    uploadPreset: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const docRef = doc(db, 'settings', 'cloudinary');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setSettings(docSnap.data());
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      await setDoc(doc(db, 'settings', 'cloudinary'), settings);
      setMessage('Settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Error saving settings:', err);
      setMessage('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
        <Settings size={32} color="var(--primary-color)" />
        <h2 style={{ margin: 0 }}>App Settings</h2>
      </div>

      <div className="glass-panel" style={{ maxWidth: '600px' }}>
        <h3 style={{ marginBottom: '24px' }}>Cloudinary Configuration</h3>
        <p className="text-muted" style={{ marginBottom: '24px', fontSize: '0.9rem' }}>
          Enter your Cloudinary details below. This enables direct image uploads for Fee Structures and Timetables.
          Ensure your Upload Preset is set to <strong>Unsigned</strong> in your Cloudinary Dashboard.
        </p>

        {message && (
          <div style={{ padding: '12px', background: '#dcfce7', color: '#166534', borderRadius: '8px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle size={20} />
            {message}
          </div>
        )}

        <form onSubmit={handleSave}>
          <div className="input-group">
            <label>Cloud Name</label>
            <input 
              type="text" 
              className="input-field"
              placeholder="e.g. dxzvw..." 
              value={settings.cloudName}
              onChange={(e) => setSettings({...settings, cloudName: e.target.value})}
              required
            />
          </div>

          <div className="input-group" style={{ marginBottom: '32px' }}>
            <label>Upload Preset (Unsigned)</label>
            <input 
              type="text" 
              className="input-field"
              placeholder="e.g. studyx_preset" 
              value={settings.uploadPreset}
              onChange={(e) => setSettings({...settings, uploadPreset: e.target.value})}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            {saving ? 'Saving...' : 'Save Configuration'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AppSettings;
