import React, { useState } from 'react';
import { useItems } from '../context/ItemContext';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, X, CheckCircle, UploadCloud, Send, Trash2 } from 'lucide-react';

export const ClaimModal = () => {
  const { selectedItem, setActiveModal, submitClaim } = useItems();
  const { user } = useAuth();
  const [proofText, setProofText] = useState('');
  const [proofImage, setProofImage] = useState('');
  const [proofImagePreview, setProofImagePreview] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  if (!selectedItem) return null;

  // File upload reader for proof image
  const handleProofFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPG, WEBP, etc.)');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      setProofImagePreview(base64String);
      setProofImage(base64String);
    };
    reader.readAsDataURL(file);
  };

  const removeProofImage = () => {
    setProofImagePreview(null);
    setProofImage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!proofText) return;

    await submitClaim({
      itemId: selectedItem._id,
      claimantId: user?._id || "u_user1",
      claimantName: user?.name || "Sarah Chen",
      claimantEmail: user?.email || "sarah.chen@university.edu",
      proofText,
      proofImage: proofImage || selectedItem.images[0]
    });

    setSubmitted(true);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '600px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.2)' }}>
              <ShieldAlert size={20} color="#a5b4fc" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f8fafc' }}>
                Claim Ownership Verification
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                Proof Verification Workflow Engine
              </p>
            </div>
          </div>
          <button onClick={() => setActiveModal(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '36px 16px' }}>
            <CheckCircle size={48} color="#10b981" style={{ marginBottom: '16px' }} />
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#6ee7b7', marginBottom: '8px' }}>
              Claim Verification Submitted!
            </h3>
            <p style={{ color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '24px' }}>
              Your proof of ownership has been sent to the reporter and system administrators. You will be notified via email and chat upon verification.
            </p>
            <button className="btn-primary" onClick={() => setActiveModal(null)}>
              Return to Dashboard
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Item Target Summary */}
            <div style={{ padding: '12px 16px', background: 'rgba(15, 23, 42, 0.8)', borderRadius: '12px', border: '1px solid var(--border-glass)', display: 'flex', gap: '12px', alignItems: 'center' }}>
              <img src={selectedItem.images[0]} alt={selectedItem.title} style={{ width: '56px', height: '56px', borderRadius: '8px', objectFit: 'cover' }} />
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc' }}>{selectedItem.title}</h4>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Reported by: {selectedItem.reporter.name}</p>
              </div>
            </div>

            {/* Proof Question Prompt */}
            {selectedItem.proofQuestions && selectedItem.proofQuestions.length > 0 && (
              <div style={{ padding: '12px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '10px', borderLeft: '4px solid #6366f1' }}>
                <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#38bdf8' }}>Verification Security Question:</p>
                <p style={{ fontSize: '0.85rem', color: '#f8fafc', marginTop: '2px' }}>"{selectedItem.proofQuestions[0]}"</p>
              </div>
            )}

            {/* Detailed Proof Text Input */}
            <div>
              <label style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                Proof of Ownership / Serial Number / Distinguishing Details *
              </label>
              <textarea
                rows={4}
                placeholder="Provide distinct proof (e.g. serial numbers, contents inside, lockscreen wallpaper, purchase receipt, specific scratches or stickers)..."
                value={proofText}
                onChange={(e) => setProofText(e.target.value)}
                required
              />
            </div>

            {/* Photo Proof File Upload */}
            <div>
              <label style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                Upload Proof Document / Receipt Photo (From File)
              </label>

              {proofImagePreview ? (
                <div style={{ position: 'relative', width: '100%', height: '140px', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border-glow)' }}>
                  <img src={proofImagePreview} alt="Proof upload preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button
                    type="button"
                    onClick={removeProofImage}
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      background: 'rgba(244, 63, 94, 0.85)',
                      border: 'none',
                      color: '#fff',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Trash2 size={14} /> Remove File
                  </button>
                </div>
              ) : (
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px',
                  borderRadius: '10px',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '2px dashed var(--border-glass)',
                  cursor: 'pointer'
                }}>
                  <UploadCloud size={24} color="#6366f1" />
                  <div>
                    <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f8fafc' }}>
                      Choose file for proof / receipt
                    </p>
                    <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      Upload PNG, JPG, or receipt photo from your computer
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProofFileChange}
                    style={{ display: 'none' }}
                  />
                </label>
              )}
            </div>

            {/* Submit Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
              <button type="button" className="btn-secondary" onClick={() => setActiveModal(null)}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Submit Claim for Review <Send size={16} />
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
