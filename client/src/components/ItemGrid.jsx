import React from 'react';
import { useItems } from '../context/ItemContext';
import { ItemCard } from './ItemCard';
import { SearchX, Sparkles } from 'lucide-react';

export const ItemGrid = () => {
  const { items, loading, search } = useItems();

  if (loading) {
    return (
      <div style={{ margin: '0 20px 40px 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
        {[1, 2, 3, 4, 5, 6].map(n => (
          <div key={n} className="glass-panel" style={{ height: '380px', borderRadius: '20px', opacity: 0.5 }} />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div style={{ margin: '40px 20px', textAlign: 'center', padding: '60px 20px' }} className="glass-panel">
        <SearchX size={48} color="#64748b" style={{ marginBottom: '16px' }} />
        <h3 style={{ fontSize: '1.4rem', color: '#cbd5e1', marginBottom: '8px' }}>No items match your search filters</h3>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Try clearing keywords or switching category filters.</p>
      </div>
    );
  }

  return (
    <div style={{ margin: '0 20px 40px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc' }}>
          Recent Lost & Found Reports ({items.length})
        </h3>
        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Sorted by Latest Date</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
        {items.map(item => (
          <ItemCard key={item._id} item={item} />
        ))}
      </div>
    </div>
  );
};
