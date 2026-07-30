import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useItems } from '../context/ItemContext';
import { useSocket } from '../context/SocketContext';
import { ProfileAvatarModal } from './ProfileAvatarModal';
import { Search, MapPin, Bell, PlusCircle, ShieldCheck, Sparkles, BarChart2, LogIn, UserPlus, LogOut, Camera } from 'lucide-react';

export const Navbar = ({ currentTab, setCurrentTab }) => {
  const { user, openAuthModal, logout, switchRole, isAdmin } = useAuth();
  const { search, setSearch, setActiveModal } = useItems();
  const { unreadCount, setUnreadCount } = useSocket();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  return (
    <nav className="glass-panel" style={{ position: 'sticky', top: '16px', zIndex: 100, margin: '0 20px 24px 20px', padding: '12px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => setCurrentTab('explore')}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(99, 102, 241, 0.4)'
          }}>
            <Sparkles size={24} color="#ffffff" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>
              BackToYou
            </h1>
            <p style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>Smart Lost & Found Engine</p>
          </div>
        </div>

        {/* Global Search Bar */}
        <div style={{ flex: 1, maxWidth: '380px', position: 'relative' }}>
          <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search lost & found items or locations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '42px', borderRadius: '24px' }}
          />
        </div>

        {/* Main Navigation Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button 
            className={`btn-secondary ${currentTab === 'explore' ? 'active' : ''}`}
            onClick={() => setCurrentTab('explore')}
            style={{ border: currentTab === 'explore' ? '1px solid var(--primary)' : '' }}
          >
            Explore
          </button>
          
          <button 
            className={`btn-secondary ${currentTab === 'map' ? 'active' : ''}`}
            onClick={() => setCurrentTab('map')}
            style={{ border: currentTab === 'map' ? '1px solid var(--secondary)' : '' }}
          >
            <MapPin size={16} color="#06b6d4" /> Leaflet Map
          </button>

          <button 
            className={`btn-secondary ${currentTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setCurrentTab('analytics')}
            style={{ border: currentTab === 'analytics' ? '1px solid var(--accent-green)' : '' }}
          >
            <BarChart2 size={16} color="#10b981" /> Analytics
          </button>

          {isAdmin && (
            <button 
              className={`btn-secondary ${currentTab === 'admin' ? 'active' : ''}`}
              onClick={() => setCurrentTab('admin')}
              style={{ border: '1px solid #f43f5e', color: '#fda4af', background: 'rgba(244, 63, 94, 0.1)' }}
            >
              <ShieldCheck size={16} color="#f43f5e" /> Admin Console
            </button>
          )}
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button className="btn-primary" onClick={() => setActiveModal('report')}>
            <PlusCircle size={18} /> Report Item
          </button>

          {/* Notifications */}
          <div style={{ position: 'relative' }}>
            <button 
              className="btn-secondary" 
              style={{ padding: '10px', borderRadius: '50%' }}
              onClick={() => {
                setShowNotifications(!showNotifications);
                setUnreadCount(0);
              }}
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  background: '#f43f5e',
                  color: '#fff',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  fontSize: '0.7rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700
                }}>
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="glass-panel" style={{
                position: 'absolute',
                right: 0,
                top: '50px',
                width: '300px',
                padding: '16px',
                zIndex: 1000,
                background: '#111827'
              }}>
                <h4 style={{ marginBottom: '10px', fontSize: '0.9rem', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Notifications</span>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Recent</span>
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '240px', overflowY: 'auto' }}>
                  <div style={{ padding: '8px 12px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '8px', borderLeft: '3px solid #6366f1' }}>
                    <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#a5b4fc' }}>AI Match Found</p>
                    <p style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>94% similarity match detected for reported item.</p>
                  </div>
                  <div style={{ padding: '8px 12px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', borderLeft: '3px solid #10b981' }}>
                    <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#6ee7b7' }}>Claim Filed</p>
                    <p style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>A claim verification was submitted.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Authentication Controls / User Avatar */}
          {user ? (
            <div style={{ position: 'relative' }}>
              <div
                onClick={() => setShowUserMenu(!showUserMenu)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  padding: '4px 10px',
                  borderRadius: '24px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-glass)'
                }}
              >
                <img 
                  src={user.avatar} 
                  alt={user.name}
                  style={{ width: '34px', height: '34px', borderRadius: '50%', border: `2px solid ${isAdmin ? '#f43f5e' : 'var(--primary)'}`, objectFit: 'cover' }}
                />
                <div style={{ textAlign: 'left', display: 'none', minWidth: '80px' }} className="user-nav-details">
                  <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f8fafc', margin: 0, lineHeight: 1.2 }}>{user.name}</p>
                  <span style={{ fontSize: '0.65rem', color: isAdmin ? '#fda4af' : '#a5b4fc', fontWeight: 600, textTransform: 'uppercase' }}>
                    {user.role}
                  </span>
                </div>
              </div>

              {/* User Dropdown Menu */}
              {showUserMenu && (
                <div
                  className="glass-panel"
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: '48px',
                    width: '240px',
                    padding: '12px',
                    zIndex: 1000,
                    background: '#0f172a',
                    border: '1px solid var(--border-glow)'
                  }}
                >
                  <div style={{ padding: '8px', borderBottom: '1px solid var(--border-glass)', marginBottom: '8px' }}>
                    <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>{user.name}</p>
                    <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{user.email}</p>
                    <span style={{
                      display: 'inline-block',
                      marginTop: '4px',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      background: isAdmin ? 'rgba(244, 63, 94, 0.2)' : 'rgba(99, 102, 241, 0.2)',
                      color: isAdmin ? '#fda4af' : '#a5b4fc'
                    }}>
                      ROLE: {user.role.toUpperCase()}
                    </span>
                  </div>

                  {/* Change Profile Picture Action */}
                  <button
                    onClick={() => {
                      setShowAvatarModal(true);
                      setShowUserMenu(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: 'none',
                      background: 'rgba(99, 102, 241, 0.15)',
                      color: '#a5b4fc',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '6px'
                    }}
                  >
                    <Camera size={14} color="#a5b4fc" /> Change Profile Picture
                  </button>

                  {/* Switch Role Quick Action */}
                  <button
                    onClick={() => {
                      switchRole(isAdmin ? 'user' : 'admin');
                      setShowUserMenu(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: 'none',
                      background: 'rgba(255, 255, 255, 0.05)',
                      color: '#cbd5e1',
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '6px'
                    }}
                  >
                    <ShieldCheck size={14} color={isAdmin ? '#6ee7b7' : '#f43f5e'} />
                    Switch to {isAdmin ? 'User Mode' : 'Admin Mode'}
                  </button>

                  <button
                    onClick={() => {
                      logout();
                      setShowUserMenu(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: 'none',
                      background: 'rgba(244, 63, 94, 0.15)',
                      color: '#fda4af',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <LogOut size={14} /> Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                className="btn-secondary"
                onClick={() => openAuthModal('login', 'user')}
                style={{ fontSize: '0.85rem' }}
              >
                <LogIn size={16} /> Sign In
              </button>
              <button
                className="btn-primary"
                onClick={() => openAuthModal('register', 'user')}
                style={{ fontSize: '0.85rem' }}
              >
                <UserPlus size={16} /> Register
              </button>
            </div>
          )}

        </div>

      </div>

      {showAvatarModal && <ProfileAvatarModal onClose={() => setShowAvatarModal(false)} />}
    </nav>
  );
};
