import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Camera, Check, Upload, Sparkles } from 'lucide-react';

const PRESET_AVATARS = [
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80"
];

export const ProfileAvatarModal = ({ onClose }) => {
  const { user, updateAvatar } = useAuth();
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || PRESET_AVATARS[0]);
  const [customFilePreview, setCustomFilePreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      setCustomFilePreview(base64String);
      setSelectedAvatar(base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaving(true);
    await updateAvatar(selectedAvatar);
    setSaving(false);
    setSuccessMessage('Profile picture updated successfully!');
    setTimeout(() => {
      if (onClose) onClose();
    }, 1200);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content glass-panel"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '460px',
          background: '#0d1322',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          padding: '28px'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Camera size={20} color="#fff" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc' }}>
                Select Profile Picture
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                Customize how you appear across BackToYou
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'rgba(255, 255, 255, 0.05)', border: 'none', color: '#94a3b8', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div style={{
            padding: '10px',
            borderRadius: '10px',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            color: '#6ee7b7',
            fontSize: '0.82rem',
            textAlign: 'center',
            marginBottom: '16px'
          }}>
            ✓ {successMessage}
          </div>
        )}

        {/* Current Active Avatar Preview */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <img
              src={selectedAvatar}
              alt="Selected Avatar Preview"
              style={{
                width: '96px',
                height: '96px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid #6366f1',
                boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)'
              }}
            />
            <div style={{
              position: 'absolute',
              bottom: '0',
              right: '0',
              background: '#06b6d4',
              borderRadius: '50%',
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.5)'
            }}>
              <Sparkles size={14} color="#fff" />
            </div>
          </div>
          <p style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '8px', fontWeight: 600 }}>
            {user?.name}'s Profile Avatar
          </p>
        </div>

        {/* Upload Custom Image Option */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>
            Upload Custom Photo
          </label>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '12px',
            borderRadius: '12px',
            background: 'rgba(99, 102, 241, 0.1)',
            border: '1px dashed rgba(99, 102, 241, 0.4)',
            color: '#a5b4fc',
            fontWeight: 600,
            fontSize: '0.85rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}>
            <Upload size={18} />
            Browse & Upload Photo File
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </label>
        </div>

        {/* Preset Gallery */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '10px' }}>
            Or Choose from Preset Avatars
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
            {PRESET_AVATARS.map((url, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setSelectedAvatar(url);
                  setCustomFilePreview(null);
                }}
                style={{
                  position: 'relative',
                  cursor: 'pointer',
                  borderRadius: '50%',
                  padding: '3px',
                  border: selectedAvatar === url ? '2px solid #06b6d4' : '2px solid transparent',
                  transition: 'all 0.2s ease'
                }}
              >
                <img
                  src={url}
                  alt={`Avatar Preset ${idx + 1}`}
                  style={{
                    width: '100%',
                    height: '60px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    opacity: selectedAvatar === url ? 1 : 0.65
                  }}
                />
                {selectedAvatar === url && (
                  <div style={{
                    position: 'absolute',
                    top: '2px',
                    right: '2px',
                    background: '#10b981',
                    borderRadius: '50%',
                    width: '18px',
                    height: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Check size={12} color="#fff" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button
            type="button"
            className="btn-secondary"
            onClick={onClose}
            style={{ fontSize: '0.85rem' }}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={handleSave}
            disabled={saving}
            style={{ fontSize: '0.85rem' }}
          >
            {saving ? 'Saving...' : 'Save Profile Picture'}
          </button>
        </div>

      </div>
    </div>
  );
};
