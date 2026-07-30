import React from 'react';
import { useItems } from '../context/ItemContext';
import { Sparkles, X, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';

export const AIMatchModal = () => {
  const { selectedItem, aiMatches, setActiveModal, setSelectedItem } = useItems();

  if (!selectedItem) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '720px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.2)', border: '1px solid rgba(6, 182, 212, 0.4)' }}>
              <Sparkles size={20} color="#38bdf8" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f8fafc' }}>
                AI Vector Item Matcher Engine
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                Searching cross-database vector tags, TF-IDF keywords & geolocation proximity
              </p>
            </div>
          </div>
          <button 
            onClick={() => setActiveModal(null)} 
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Target Item Reference Card */}
        <div style={{
          padding: '16px',
          background: 'rgba(15, 23, 42, 0.8)',
          borderRadius: '14px',
          border: '1px solid var(--border-glass)',
          marginBottom: '24px',
          display: 'flex',
          gap: '16px',
          alignItems: 'center'
        }}>
          <img src={selectedItem.images[0]} alt={selectedItem.title} style={{ width: '64px', height: '64px', borderRadius: '10px', objectFit: 'cover' }} />
          <div>
            <span className={selectedItem.type === 'lost' ? 'badge badge-lost' : 'badge badge-found'}>
              Target {selectedItem.type} Item
            </span>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginTop: '4px', color: '#f8fafc' }}>{selectedItem.title}</h4>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Category: {selectedItem.category} • Location: {selectedItem.location.address}</p>
          </div>
        </div>

        {/* AI Matches Results List */}
        <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '14px', color: '#cbd5e1' }}>
          Top High-Confidence Pairings ({aiMatches.length})
        </h4>

        {aiMatches.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 16px', background: 'rgba(15, 23, 42, 0.4)', borderRadius: '12px', border: '1px dashed var(--border-glass)' }}>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>No high-confidence match pairs found above 45% threshold yet.</p>
            <p style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '4px' }}>Our background worker will email you automatically when a new report matches.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '360px', overflowY: 'auto' }}>
            {aiMatches.map(({ matchedItem, matchScore, reason }) => (
              <div key={matchedItem._id} style={{
                padding: '16px',
                background: 'rgba(30, 41, 59, 0.6)',
                borderRadius: '14px',
                border: '1px solid rgba(6, 182, 212, 0.3)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '16px'
              }}>
                <img src={matchedItem.images[0]} alt={matchedItem.title} style={{ width: '60px', height: '60px', borderRadius: '10px', objectFit: 'cover' }} />
                
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span className="badge badge-ai" style={{ fontSize: '0.7rem' }}>
                      {matchScore}% Confidence Match
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#6ee7b7' }}>Verified {matchedItem.type} report</span>
                  </div>
                  <h5 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc' }}>{matchedItem.title}</h5>
                  <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>{reason}</p>
                </div>

                <button 
                  className="btn-primary" 
                  style={{ padding: '8px 14px', fontSize: '0.8rem' }}
                  onClick={() => {
                    setSelectedItem(matchedItem);
                    setActiveModal('claim');
                  }}
                >
                  Initiate Claim <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn-secondary" onClick={() => setActiveModal(null)}>Close AI Matcher</button>
        </div>

      </div>
    </div>
  );
};
