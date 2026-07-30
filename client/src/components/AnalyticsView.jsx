import React, { useEffect, useState } from 'react';
import { BarChart2, TrendingUp, ShieldCheck, PieChart, Users, Cpu } from 'lucide-react';

export const AnalyticsView = () => {
  const [data, setData] = useState({
    totalReported: 28,
    totalLost: 15,
    totalFound: 13,
    totalClaimed: 22,
    recoveryRate: 78,
    activeUsers: 14,
    pendingClaims: 1,
    categoryMetrics: {
      "Electronics": 10,
      "ID & Wallet": 8,
      "Audio & Accessories": 6,
      "Keys": 4
    },
    monthlyTrends: [
      { month: 'Jan', lost: 12, recovered: 9 },
      { month: 'Feb', lost: 19, recovered: 15 },
      { month: 'Mar', lost: 25, recovered: 21 },
      { month: 'Apr', lost: 18, recovered: 16 },
      { month: 'May', lost: 30, recovered: 26 },
      { month: 'Jun', lost: 22, recovered: 19 },
      { month: 'Jul', lost: 28, recovered: 24 }
    ]
  });

  useEffect(() => {
    fetch('/api/admin/analytics')
      .then(r => r.json())
      .then(res => {
        if (res.success && res.analytics) {
          setData(res.analytics);
        }
      })
      .catch(e => console.error(e));
  }, []);

  return (
    <div style={{ margin: '0 20px 40px 20px' }}>
      <div className="glass-panel" style={{ padding: '28px', borderRadius: '24px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <BarChart2 size={26} color="#10b981" /> System Recovery Analytics & Performance Metrics
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              Live platform metrics tracking success recovery rates, category distribution & AI match efficiency
            </p>
          </div>
        </div>

        {/* Top Metric Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          
          <div style={{ padding: '20px', background: 'rgba(15, 23, 42, 0.8)', borderRadius: '16px', border: '1px solid var(--border-glass)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Overall Recovery Rate</span>
              <TrendingUp size={20} color="#10b981" />
            </div>
            <h3 style={{ fontSize: '2rem', fontWeight: 800, color: '#6ee7b7', marginTop: '8px' }}>
              {data.recoveryRate}%
            </h3>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>+5.4% higher than average</p>
          </div>

          <div style={{ padding: '20px', background: 'rgba(15, 23, 42, 0.8)', borderRadius: '16px', border: '1px solid var(--border-glass)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Total Handed Back</span>
              <ShieldCheck size={20} color="#6366f1" />
            </div>
            <h3 style={{ fontSize: '2rem', fontWeight: 800, color: '#a5b4fc', marginTop: '8px' }}>
              {data.totalClaimed}
            </h3>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>Verified owner handovers</p>
          </div>

          <div style={{ padding: '20px', background: 'rgba(15, 23, 42, 0.8)', borderRadius: '16px', border: '1px solid var(--border-glass)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>AI Match Confidence</span>
              <Cpu size={20} color="#38bdf8" />
            </div>
            <h3 style={{ fontSize: '2rem', fontWeight: 800, color: '#38bdf8', marginTop: '8px' }}>
              94.2%
            </h3>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>Vector tag similarity engine</p>
          </div>

          <div style={{ padding: '20px', background: 'rgba(15, 23, 42, 0.8)', borderRadius: '16px', border: '1px solid var(--border-glass)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Active Network Users</span>
              <Users size={20} color="#f59e0b" />
            </div>
            <h3 style={{ fontSize: '2rem', fontWeight: 800, color: '#fcd34d', marginTop: '8px' }}>
              {data.activeUsers}
            </h3>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>Registered students & staff</p>
          </div>

        </div>

        {/* Visual Monthly Trends Bar Chart Simulation */}
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '16px' }}>
          Monthly Recovery & Lost Item Volume Trend
        </h3>
        
        <div style={{
          padding: '24px',
          background: 'rgba(15, 23, 42, 0.6)',
          borderRadius: '16px',
          border: '1px solid var(--border-glass)',
          marginBottom: '32px'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '220px', gap: '16px' }}>
            {data.monthlyTrends.map((t, idx) => (
              <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-end', width: '100%', justifyContent: 'center' }}>
                  {/* Lost items bar */}
                  <div style={{
                    height: `${(t.lost / 35) * 180}px`,
                    width: '18px',
                    background: 'rgba(244, 63, 94, 0.8)',
                    borderRadius: '4px 4px 0 0'
                  }} title={`Lost: ${t.lost}`} />
                  
                  {/* Recovered items bar */}
                  <div style={{
                    height: `${(t.recovered / 35) * 180}px`,
                    width: '18px',
                    background: 'linear-gradient(180deg, #10b981 0%, #059669 100%)',
                    borderRadius: '4px 4px 0 0'
                  }} title={`Recovered: ${t.recovered}`} />
                </div>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '8px' }}>{t.month}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '20px' }}>
            <span style={{ fontSize: '0.8rem', color: '#fda4af', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '12px', height: '12px', background: 'rgba(244, 63, 94, 0.8)', borderRadius: '2px' }}></span> Lost Items Reported
            </span>
            <span style={{ fontSize: '0.8rem', color: '#6ee7b7', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '12px', height: '12px', background: '#10b981', borderRadius: '2px' }}></span> Items Successfully Recovered
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
