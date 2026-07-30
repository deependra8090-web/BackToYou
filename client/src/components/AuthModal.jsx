import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, ShieldCheck, UserCheck, Lock, Mail, User, Sparkles, ArrowRight, Camera, UploadCloud } from 'lucide-react';

const PRESET_AVATARS = [
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
];

export const AuthModal = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalTab,
    authModalRole,
    login,
    register,
    user
  } = useAuth();

  const [tab, setTab] = useState(authModalTab || 'login');
  const [role, setRole] = useState(authModalRole || 'user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState(PRESET_AVATARS[0]);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isAuthModalOpen && user) return null;

  // Handle uploading user profile photo file
  const handleAvatarFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      setAvatarPreview(base64String);
      setAvatar(base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    if (tab === 'login') {
      if (!email.trim() || !password.trim()) {
        setErrorMsg('Please enter both email and password.');
        setLoading(false);
        return;
      }
      const res = await login(email, password, role);
      if (!res.success) setErrorMsg(res.message);
    } else {
      if (!name.trim() || !email.trim() || !password.trim()) {
        setErrorMsg('Please fill in all required fields.');
        setLoading(false);
        return;
      }
      const res = await register(name, email, password, role, avatar);
      if (!res.success) setErrorMsg(res.message);
    }

    setLoading(false);
  };

  // Quick 1-click recruiter demo accounts
  const handleQuickDemo = async (demoRole) => {
    setErrorMsg('');
    setLoading(true);
    if (demoRole === 'admin') {
      await login('admin@backtoyou.com', 'admin123', 'admin');
    } else {
      await login('user@university.edu', 'user123', 'user');
    }
    setLoading(false);
  };

  return (
    <div className="modal-overlay" onClick={user ? closeAuthModal : null}>
      <div
        className="modal-content glass-panel"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '480px',
          background: '#0e1628',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.85)',
          padding: '32px'
        }}
      >
        {/* Close Button (only if user logged in) */}
        {user && (
          <button
            onClick={closeAuthModal}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: 'none',
              color: '#94a3b8',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={18} />
          </button>
        )}

        {/* Modal Header */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            background: role === 'admin'
              ? 'linear-gradient(135deg, #f43f5e 0%, #be123c 100%)'
              : 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px auto',
            boxShadow: role === 'admin'
              ? '0 4px 20px rgba(244, 63, 94, 0.4)'
              : '0 4px 20px rgba(99, 102, 241, 0.4)'
          }}>
            {role === 'admin' ? <ShieldCheck size={26} color="#fff" /> : <Sparkles size={26} color="#fff" />}
          </div>

          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#f8fafc' }}>
            {tab === 'login' ? (role === 'admin' ? 'Admin Portal Sign In' : 'Sign In to BackToYou') : 'Create User Account'}
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '4px' }}>
            Please sign in or register to access lost & found listings
          </p>
        </div>

        {/* Role Switcher Pills */}
        <div style={{
          display: 'flex',
          background: 'rgba(15, 23, 42, 0.8)',
          borderRadius: '12px',
          padding: '4px',
          marginBottom: '18px',
          border: '1px solid var(--border-glass)'
        }}>
          <button
            type="button"
            onClick={() => setRole('user')}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: '8px',
              border: 'none',
              background: role === 'user' ? 'rgba(99, 102, 241, 0.25)' : 'transparent',
              color: role === 'user' ? '#a5b4fc' : '#94a3b8',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <UserCheck size={16} /> User / Student
          </button>
          <button
            type="button"
            onClick={() => setRole('admin')}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: '8px',
              border: 'none',
              background: role === 'admin' ? 'rgba(244, 63, 94, 0.25)' : 'transparent',
              color: role === 'admin' ? '#fda4af' : '#94a3b8',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <ShieldCheck size={16} /> System Admin
          </button>
        </div>

        {/* Tab Switcher (Login / Register) */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-glass)', marginBottom: '18px' }}>
          <button
            type="button"
            onClick={() => { setTab('login'); setErrorMsg(''); }}
            style={{
              flex: 1,
              padding: '10px',
              background: 'none',
              border: 'none',
              borderBottom: tab === 'login' ? `2px solid ${role === 'admin' ? '#f43f5e' : '#6366f1'}` : '2px solid transparent',
              color: tab === 'login' ? '#f8fafc' : '#64748b',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer'
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setTab('register'); setErrorMsg(''); }}
            style={{
              flex: 1,
              padding: '10px',
              background: 'none',
              border: 'none',
              borderBottom: tab === 'register' ? `2px solid ${role === 'admin' ? '#f43f5e' : '#6366f1'}` : '2px solid transparent',
              color: tab === 'register' ? '#f8fafc' : '#64748b',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer'
            }}
          >
            Register
          </button>
        </div>

        {/* Error Banner */}
        {errorMsg && (
          <div style={{
            padding: '10px 14px',
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid rgba(244, 63, 94, 0.4)',
            borderRadius: '10px',
            color: '#fda4af',
            fontSize: '0.8rem',
            marginBottom: '16px'
          }}>
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {tab === 'register' && (
            <>
              {/* Profile Picture Upload & Picker Section */}
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '8px', display: 'block' }}>
                  Select Profile Picture (Upload File or Choose Avatar)
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                  <img
                    src={avatarPreview || avatar}
                    alt="Selected profile"
                    style={{
                      width: '54px',
                      height: '54px',
                      borderRadius: '50%',
                      border: '2px solid var(--primary)',
                      objectFit: 'cover',
                      boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)'
                    }}
                  />
                  <label style={{
                    padding: '8px 14px',
                    borderRadius: '10px',
                    background: 'rgba(99, 102, 241, 0.15)',
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                    color: '#a5b4fc',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <Camera size={16} /> Browse Photo File
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarFileChange}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>

                {/* Preset Avatars */}
                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                  {PRESET_AVATARS.map((imgUrl, idx) => (
                    <img
                      key={idx}
                      src={imgUrl}
                      alt={`Avatar option ${idx + 1}`}
                      onClick={() => { setAvatar(imgUrl); setAvatarPreview(null); }}
                      style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        border: avatar === imgUrl && !avatarPreview ? '2px solid #06b6d4' : '1px solid transparent',
                        opacity: avatar === imgUrl && !avatarPreview ? 1 : 0.6,
                        objectFit: 'cover'
                      }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px', display: 'block' }}>
                  Full Name *
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={18} color="#64748b" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    placeholder="e.g. Alex Johnson"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ paddingLeft: '42px' }}
                    required
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px', display: 'block' }}>
              Email Address *
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} color="#64748b" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                placeholder={role === 'admin' ? 'admin@backtoyou.com' : 'user@university.edu'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '42px' }}
                required
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px', display: 'block' }}>
              Password *
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="#64748b" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '42px' }}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '12px',
              border: 'none',
              background: role === 'admin'
                ? 'linear-gradient(135deg, #f43f5e 0%, #be123c 100%)'
                : 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              color: '#fff',
              fontSize: '0.95rem',
              fontWeight: 700,
              cursor: 'pointer',
              marginTop: '6px',
              boxShadow: role === 'admin' ? '0 4px 20px rgba(244, 63, 94, 0.4)' : '0 4px 20px rgba(99, 102, 241, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            {loading ? 'Processing...' : (tab === 'login' ? `Sign In as ${role === 'admin' ? 'Admin' : 'User'}` : 'Create Account')}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        {/* 1-Click Quick Access */}
        <div style={{ marginTop: '20px', paddingTop: '14px', borderTop: '1px dashed var(--border-glass)' }}>
          <p style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', fontWeight: 700, textAlign: 'center', marginBottom: '10px' }}>
            ⚡ Quick Demo Sign In
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <button
              type="button"
              onClick={() => handleQuickDemo('user')}
              style={{
                padding: '9px',
                borderRadius: '10px',
                background: 'rgba(99, 102, 241, 0.1)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                color: '#a5b4fc',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              👤 Quick User Access
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              style={{
                padding: '9px',
                borderRadius: '10px',
                background: 'rgba(244, 63, 94, 0.1)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                color: '#fda4af',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              🛡️ Quick Admin Access
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
