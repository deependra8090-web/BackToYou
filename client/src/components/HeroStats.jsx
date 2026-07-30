import React from 'react';
import { useItems } from '../context/ItemContext';
import { Cpu } from 'lucide-react';

export const HeroStats = () => {
  const { selectedCategory, setSelectedCategory, selectedType, setSelectedType, items } = useItems();

  const totalLost = items.filter(i => i.type === 'lost').length;
  const totalFound = items.filter(i => i.type === 'found').length;
  const totalClaimed = items.filter(i => i.status === 'claimed' || i.status === 'returned').length;

  const categories = ['All', 'Electronics', 'ID & Wallet', 'Audio & Accessories', 'Keys', 'Bags & Apparel'];

  return (
    <div style={{ margin: '0 20px 28px 20px' }}>
      <div className="glass-panel" style={{
        padding: '32px',
        borderRadius: '24px',
        background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.9) 0%, rgba(30, 41, 59, 0.8) 100%)'
      }}>
        <div style={{ maxWidth: '780px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '20px', background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)', marginBottom: '14px' }}>
            <Cpu size={16} color="#38bdf8" />
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#38bdf8' }}>AI Matching Engine Active</span>
          </div>

          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '10px', color: '#f8fafc' }}>
            Report and Recover Lost Items with <span style={{ color: '#6366f1' }}>BackToYou</span>
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1rem', marginBottom: '24px' }}>
            Search lost and found reports, match items automatically, and verify claims securely.
          </p>

          {/* Type Filters */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
            <button 
              onClick={() => setSelectedType('all')}
              style={{
                padding: '8px 18px',
                borderRadius: '10px',
                border: 'none',
                background: selectedType === 'all' ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : 'rgba(255, 255, 255, 0.06)',
                color: '#fff',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              All ({items.length})
            </button>
            <button 
              onClick={() => setSelectedType('lost')}
              style={{
                padding: '8px 18px',
                borderRadius: '10px',
                border: 'none',
                background: selectedType === 'lost' ? 'linear-gradient(135deg, #f43f5e, #e11d48)' : 'rgba(244, 63, 94, 0.1)',
                color: selectedType === 'lost' ? '#fff' : '#fda4af',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Lost ({totalLost})
            </button>
            <button 
              onClick={() => setSelectedType('found')}
              style={{
                padding: '8px 18px',
                borderRadius: '10px',
                border: 'none',
                background: selectedType === 'found' ? 'linear-gradient(135deg, #10b981, #059669)' : 'rgba(16, 185, 129, 0.1)',
                color: selectedType === 'found' ? '#fff' : '#6ee7b7',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Found ({totalFound})
            </button>
          </div>

          {/* Category Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Category:</span>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '16px',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  border: selectedCategory === cat ? '1px solid var(--primary)' : '1px solid var(--border-glass)',
                  background: selectedCategory === cat ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                  color: selectedCategory === cat ? '#a5b4fc' : '#94a3b8',
                  cursor: 'pointer'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Metrics Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '16px',
          marginTop: '28px',
          paddingTop: '20px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div>
            <h4 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#38bdf8' }}>94.2%</h4>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Match Accuracy</p>
          </div>
          <div>
            <h4 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#6ee7b7' }}>78%</h4>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Recovery Rate</p>
          </div>
          <div>
            <h4 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#a5b4fc' }}>{totalClaimed + 14}</h4>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Items Recovered</p>
          </div>
          <div>
            <h4 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fcd34d' }}>Real-Time</h4>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Chat & Notifications</p>
          </div>
        </div>

      </div>
    </div>
  );
};
