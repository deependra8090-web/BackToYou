import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Users, AlertTriangle, CheckCircle, Trash2, Eye, RefreshCw } from 'lucide-react';

export const AdminDashboard = () => {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [claims, setClaims] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [userRes, claimRes, itemRes] = await Promise.all([
        fetch('/api/admin/users').then(r => r.json()),
        fetch('/api/claims?role=admin').then(r => r.json()),
        fetch('/api/items').then(r => r.json())
      ]);

      if (userRes.success) setUsers(userRes.users);
      if (claimRes.success) setClaims(claimRes.claims);
      if (itemRes.success) setItems(itemRes.items);
    } catch (err) {
      console.error("Failed to fetch admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleClaimDecision = async (claimId, status) => {
    try {
      const res = await fetch(`/api/claims/${claimId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        fetchAdminData();
      }
    } catch (err) {
      console.error("Failed to update claim:", err);
    }
  };

  const handleModerationDelete = async (itemId) => {
    if (!window.confirm("Are you sure you want to delete/flag this item as inappropriate?")) return;
    try {
      await fetch(`/api/admin/items/${itemId}`, { method: 'DELETE' });
      fetchAdminData();
    } catch (err) {
      console.error("Failed to delete item:", err);
    }
  };

  return (
    <div style={{ margin: '0 20px 40px 20px' }}>
      <div className="glass-panel" style={{ padding: '28px', borderRadius: '24px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <span className="badge" style={{ background: 'rgba(244, 63, 94, 0.15)', color: '#fda4af', border: '1px solid #f43f5e' }}>
              🛡️ RBAC Protected Admin Console
            </span>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '6px', color: '#f8fafc' }}>
              BackToYou System Control & Moderation
            </h2>
          </div>
          <button className="btn-secondary" onClick={fetchAdminData}>
            <RefreshCw size={16} /> Refresh Metrics
          </button>
        </div>

        {/* Admin Quick Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          <div style={{ padding: '20px', background: 'rgba(15, 23, 42, 0.8)', borderRadius: '16px', border: '1px solid var(--border-glass)' }}>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Total Registered Users</p>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#38bdf8', marginTop: '4px' }}>{users.length}</h3>
          </div>
          <div style={{ padding: '20px', background: 'rgba(15, 23, 42, 0.8)', borderRadius: '16px', border: '1px solid var(--border-glass)' }}>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Pending Claim Reviews</p>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fcd34d', marginTop: '4px' }}>
              {claims.filter(c => c.status === 'pending').length}
            </h3>
          </div>
          <div style={{ padding: '20px', background: 'rgba(15, 23, 42, 0.8)', borderRadius: '16px', border: '1px solid var(--border-glass)' }}>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Active Item Listings</p>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#a5b4fc', marginTop: '4px' }}>{items.length}</h3>
          </div>
        </div>

        {/* Section 1: Pending Claims Moderation Table */}
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px', color: '#cbd5e1' }}>
          Pending Ownership Claims Review
        </h3>
        <div style={{ overflowX: 'auto', marginBottom: '36px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-glass)', color: '#94a3b8' }}>
                <th style={{ padding: '12px' }}>Claimant</th>
                <th style={{ padding: '12px' }}>Item Title</th>
                <th style={{ padding: '12px' }}>Proof Verification Text</th>
                <th style={{ padding: '12px' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {claims.map(claim => (
                <tr key={claim._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '12px', color: '#f8fafc', fontWeight: 600 }}>{claim.claimantName}</td>
                  <td style={{ padding: '12px', color: '#38bdf8' }}>{claim.itemTitle}</td>
                  <td style={{ padding: '12px', color: '#cbd5e1', maxWidth: '280px' }}>{claim.proofText}</td>
                  <td style={{ padding: '12px' }}>
                    <span className={`badge badge-${claim.status}`}>
                      {claim.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>
                    {claim.status === 'pending' ? (
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button 
                          className="btn-primary" 
                          style={{ padding: '6px 12px', fontSize: '0.75rem', background: '#10b981' }}
                          onClick={() => handleClaimDecision(claim._id, 'approved')}
                        >
                          Approve
                        </button>
                        <button 
                          className="btn-secondary" 
                          style={{ padding: '6px 12px', fontSize: '0.75rem', color: '#fda4af' }}
                          onClick={() => handleClaimDecision(claim._id, 'rejected')}
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Processed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Section 2: Items Content Moderation Table */}
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px', color: '#cbd5e1' }}>
          Item Listings Content Moderation
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-glass)', color: '#94a3b8' }}>
                <th style={{ padding: '12px' }}>Title</th>
                <th style={{ padding: '12px' }}>Category</th>
                <th style={{ padding: '12px' }}>Type</th>
                <th style={{ padding: '12px' }}>Reporter</th>
                <th style={{ padding: '12px', textAlign: 'right' }}>Moderate</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '12px', color: '#f8fafc', fontWeight: 600 }}>{item.title}</td>
                  <td style={{ padding: '12px', color: '#cbd5e1' }}>{item.category}</td>
                  <td style={{ padding: '12px' }}>
                    <span className={item.type === 'lost' ? 'badge badge-lost' : 'badge badge-found'}>
                      {item.type}
                    </span>
                  </td>
                  <td style={{ padding: '12px', color: '#94a3b8' }}>{item.reporter.name}</td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>
                    <button 
                      onClick={() => handleModerationDelete(item._id)}
                      style={{ background: 'rgba(244,63,94,0.15)', border: '1px solid #f43f5e', color: '#fda4af', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer' }}
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};
