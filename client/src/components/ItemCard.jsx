import React from 'react';
import { useItems } from '../context/ItemContext';
import { MapPin, Calendar, Sparkles, MessageSquare, ShieldAlert, User } from 'lucide-react';

export const ItemCard = ({ item }) => {
  const { setSelectedItem, setActiveModal, getAIMatches } = useItems();

  const isLost = item.type === 'lost';

  const handleAIMatchClick = async (e) => {
    e.stopPropagation();
    setSelectedItem(item);
    await getAIMatches(item._id);
    setActiveModal('aiMatch');
  };

  const handleClaimClick = (e) => {
    e.stopPropagation();
    setSelectedItem(item);
    setActiveModal('claim');
  };

  const handleChatClick = (e) => {
    e.stopPropagation();
    setSelectedItem(item);
    setActiveModal('chat');
  };

  return (
    <div className="glass-panel" style={{
      borderRadius: '20px',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      position: 'relative'
    }}>
      {/* Image Container */}
      <div style={{ position: 'relative', height: '200px', width: '100%', overflow: 'hidden' }}>
        <img
          src={item.images && item.images.length > 0 ? item.images[0] : "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80"}
          alt={item.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.06)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        />

        {/* Top Badges */}
        <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '8px' }}>
          <span className={isLost ? 'badge badge-lost' : 'badge badge-found'}>
            {item.type}
          </span>
          <span style={{
            background: 'rgba(15, 23, 42, 0.85)',
            color: '#cbd5e1',
            padding: '4px 10px',
            borderRadius: '20px',
            fontSize: '0.75rem',
            fontWeight: 600,
            border: '1px solid var(--border-glass)'
          }}>
            {item.category}
          </span>
        </div>

        {/* AI Vector Match Badge */}
        <button
          onClick={handleAIMatchClick}
          className="badge badge-ai pulse-glow"
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            cursor: 'pointer',
            border: 'none',
            boxShadow: '0 4px 12px rgba(6, 182, 212, 0.4)'
          }}
          title="Run AI Matcher algorithm to find matching lost/found reports"
        >
          <Sparkles size={12} /> AI Match
        </button>
      </div>

      {/* Card Content */}
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc', marginBottom: '6px', lineHeight: 1.3 }}>
          {item.title}
        </h3>

        <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '14px', flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {item.description}
        </p>

        {/* User Info & Entered Location */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          padding: '10px 12px',
          background: 'rgba(15, 23, 42, 0.6)',
          borderRadius: '12px',
          border: '1px solid var(--border-glass)',
          marginBottom: '16px'
        }}>
          {/* Real User Name of Reporter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {item.reporter?.avatar ? (
              <img src={item.reporter.avatar} alt={item.reporter.name} style={{ width: '20px', height: '20px', borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              <User size={16} color="#a5b4fc" />
            )}
            <span style={{ fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 600 }}>
              Posted by: <strong style={{ color: '#f8fafc' }}>{item.reporter?.name || 'User'}</strong>
            </span>
          </div>

          {/* Location Entered by User */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={16} color="#06b6d4" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              📍 {item.location?.address || 'Main Campus'}
            </span>
          </div>

          {/* Date */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={14} color="#6366f1" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              {new Date(item.dateReported || Date.now()).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
        </div>

        {/* Card Actions */}
        <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
          <button className="btn-primary" style={{ flex: 1, padding: '10px 14px', fontSize: '0.85rem' }} onClick={handleClaimClick}>
            <ShieldAlert size={16} /> Claim & Verify
          </button>
          <button className="btn-secondary" style={{ padding: '10px', borderRadius: '10px' }} onClick={handleChatClick} title="Open Socket.IO Chat with Finder/Owner">
            <MessageSquare size={16} color="#38bdf8" />
          </button>
        </div>

      </div>
    </div>
  );
};
