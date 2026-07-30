import React from 'react';
import { X, Code2, Server, Database, MapPin, Cpu, ShieldCheck, Zap } from 'lucide-react';

export const TechStackModal = ({ onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content glass-panel"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '620px',
          background: '#0b1120',
          border: '1px solid rgba(6, 182, 212, 0.4)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.9)'
        }}
      >
        <button
          onClick={onClose}
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Code2 size={24} color="#fff" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc' }}>
              Technical Architecture Highlights
            </h2>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              Full-Stack Lost & Found Management System (Resume Feature Showcase)
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
          
          <div style={{ padding: '14px', background: 'rgba(15, 23, 42, 0.7)', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <Code2 size={16} /> Frontend Architecture
            </h4>
            <ul style={{ fontSize: '0.78rem', color: '#cbd5e1', paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <li>React 18 + Vite modern build tool</li>
              <li>Context API state management</li>
              <li>Custom Glassmorphism UI tokens</li>
              <li>Responsive mobile-first layout</li>
            </ul>
          </div>

          <div style={{ padding: '14px', background: 'rgba(15, 23, 42, 0.7)', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#a5b4fc', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <Server size={16} /> Backend Architecture
            </h4>
            <ul style={{ fontSize: '0.78rem', color: '#cbd5e1', paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <li>Node.js & Express RESTful API</li>
              <li>Socket.IO real-time web sockets</li>
              <li>JWT (JSON Web Token) Auth</li>
              <li>RBAC (Role Based Access Control)</li>
            </ul>
          </div>

          <div style={{ padding: '14px', background: 'rgba(15, 23, 42, 0.7)', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#6ee7b7', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <MapPin size={16} /> GIS & Geo-Location
            </h4>
            <ul style={{ fontSize: '0.78rem', color: '#cbd5e1', paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <li>React-Leaflet GIS Map engine</li>
              <li>CartoDB Dark Matter tile layer</li>
              <li>Dynamic glowing marker popups</li>
              <li>Coordinate auto-centering</li>
            </ul>
          </div>

          <div style={{ padding: '14px', background: 'rgba(15, 23, 42, 0.7)', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f43f5e', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <Database size={16} /> DualStore DB & AI Match
            </h4>
            <ul style={{ fontSize: '0.78rem', color: '#cbd5e1', paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <li>MongoDB Atlas / DualStore memory fallback</li>
              <li>NLP Levenshtein item matching engine</li>
              <li>Claim ownership verification algorithm</li>
              <li>Environment variable (.env) support</li>
            </ul>
          </div>

        </div>

        <div style={{
          padding: '12px 16px',
          background: 'rgba(99, 102, 241, 0.1)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          borderRadius: '12px',
          fontSize: '0.8rem',
          color: '#a5b4fc',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <Zap size={20} color="#6366f1" style={{ flexShrink: 0 }} />
          <span>
            <strong>Resume Tip:</strong> You can add this project as a <em>Full-Stack Lost & Found Platform with Real-Time Sockets, Leaflet GIS, and AI Matching</em> under Projects on your resume!
          </span>
        </div>

      </div>
    </div>
  );
};
