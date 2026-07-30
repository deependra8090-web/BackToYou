import React, { useState } from 'react';
import { useItems } from '../context/ItemContext';
import { useAuth } from '../context/AuthContext';
import { X, UploadCloud, Image as ImageIcon, Trash2, MapPin, User, Check } from 'lucide-react';

// Location presets with direct exact GPS coordinates
export const LOCATION_PRESETS = [
  { address: "Central Library, 2nd Floor Quiet Zone", lat: 37.7749, lng: -122.4194 },
  { address: "Science Block Auditorium & Labs", lat: 37.7780, lng: -122.4150 },
  { address: "Student Cafeteria & Dining Lounge", lat: 37.7735, lng: -122.4210 },
  { address: "Sports Complex & Indoor Gymnasium", lat: 37.7710, lng: -122.4175 },
  { address: "Tech Park Innovation Hub (Building A)", lat: 37.7765, lng: -122.4240 },
  { address: "Engineering Block B, Computer Labs", lat: 37.7792, lng: -122.4128 },
  { address: "Main Campus Entrance & Bus Terminal", lat: 37.7720, lng: -122.4140 },
  { address: "Student Center & Recreation Plaza", lat: 37.7758, lng: -122.4168 }
];

function getCoordinatesForAddress(addressStr) {
  if (!addressStr) return { lat: 37.7749, lng: -122.4194 };
  const match = LOCATION_PRESETS.find(p => p.address.toLowerCase().includes(addressStr.toLowerCase()) || addressStr.toLowerCase().includes(p.address.toLowerCase()));
  if (match) {
    return { lat: match.lat, lng: match.lng };
  }

  let hash = 0;
  for (let i = 0; i < addressStr.length; i++) {
    hash = addressStr.charCodeAt(i) + ((hash << 5) - hash);
  }
  const latOffset = ((hash % 70) / 10000) * 1.2;
  const lngOffset = (((hash >> 2) % 70) / 10000) * 1.2;
  return {
    lat: Number((37.7749 + latOffset).toFixed(6)),
    lng: Number((-122.4194 + lngOffset).toFixed(6))
  };
}

export const ReportItemModal = () => {
  const { setActiveModal, reportItem } = useItems();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Electronics',
    type: 'lost',
    locationAddress: '',
    lat: 37.7749,
    lng: -122.4194,
    images: [],
    proofQuestion: 'Describe distinguishing marks or serial numbers'
  });

  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Location suggestions filter
  const filteredLocationSuggestions = LOCATION_PRESETS.filter(p =>
    p.address.toLowerCase().includes((formData.locationAddress || '').toLowerCase())
  );

  const handleSelectLocationPreset = (preset) => {
    setFormData(prev => ({
      ...prev,
      locationAddress: preset.address,
      lat: preset.lat,
      lng: preset.lng
    }));
    setShowLocationSuggestions(false);
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPG, WEBP, etc.)');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      setImagePreview(base64String);
      setFormData(prev => ({ ...prev, images: [base64String] }));
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    setFormData(prev => ({ ...prev, images: [] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) return;

    setSubmitting(true);

    const coords = getCoordinatesForAddress(formData.locationAddress || 'Main Campus');

    const reporterInfo = user ? {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar
    } : {
      _id: "u_guest_" + Date.now(),
      name: "Guest User",
      email: "guest@backtoyou.com",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80"
    };

    await reportItem({
      title: formData.title,
      description: formData.description,
      category: formData.category,
      type: formData.type,
      location: {
        address: formData.locationAddress || 'Main Campus',
        lat: formData.lat || coords.lat,
        lng: formData.lng || coords.lng
      },
      reporter: reporterInfo,
      images: formData.images.length > 0 ? formData.images : ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80"],
      proofQuestions: [formData.proofQuestion]
    });

    setSubmitting(false);
    setActiveModal(null);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '600px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc' }}>
              Report Lost / Found Item
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              {user ? `Reporting as: ${user.name} (${user.email})` : 'Enter details of the item.'}
            </p>
          </div>
          <button onClick={() => setActiveModal(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          {/* Type Toggle */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, type: 'lost' }))}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '10px',
                border: 'none',
                background: formData.type === 'lost' ? 'linear-gradient(135deg, #f43f5e, #e11d48)' : 'rgba(244, 63, 94, 0.1)',
                color: formData.type === 'lost' ? '#fff' : '#fda4af',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Lost Item 🔴
            </button>

            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, type: 'found' }))}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '10px',
                border: 'none',
                background: formData.type === 'found' ? 'linear-gradient(135deg, #10b981, #059669)' : 'rgba(16, 185, 129, 0.1)',
                color: formData.type === 'found' ? '#fff' : '#6ee7b7',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Found Item 🟢
            </button>
          </div>

          {/* User Reporter Indicator */}
          {user && (
            <div style={{
              padding: '10px 14px',
              background: 'rgba(99, 102, 241, 0.1)',
              borderRadius: '10px',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <img src={user.avatar} alt={user.name} style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover' }} />
              <span style={{ fontSize: '0.8rem', color: '#a5b4fc', fontWeight: 600 }}>
                Posting as: <strong>{user.name}</strong>
              </span>
            </div>
          )}

          {/* Title */}
          <div>
            <label style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
              Item Name *
            </label>
            <input
              type="text"
              placeholder="e.g. MacBook Pro, Leather Wallet, Blue Backpack"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          {/* Category */}
          <div>
            <label style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
            >
              <option value="Electronics">Electronics</option>
              <option value="ID & Wallet">ID & Wallet</option>
              <option value="Audio & Accessories">Audio & Accessories</option>
              <option value="Keys">Keys</option>
              <option value="Bags & Apparel">Bags & Apparel</option>
            </select>
          </div>

          {/* Location with Auto-Complete Suggestions */}
          <div style={{ position: 'relative' }}>
            <label style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
              Location (Direct Map Pin Location) *
            </label>
            <div style={{ position: 'relative' }}>
              <MapPin size={18} color="#06b6d4" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                value={formData.locationAddress}
                onChange={(e) => {
                  const val = e.target.value;
                  const newCoords = getCoordinatesForAddress(val);
                  setFormData(prev => ({
                    ...prev,
                    locationAddress: val,
                    lat: newCoords.lat,
                    lng: newCoords.lng
                  }));
                  setShowLocationSuggestions(true);
                }}
                onFocus={() => setShowLocationSuggestions(true)}
                placeholder="Type or pick a location (e.g. Central Library, Science Block...)"
                style={{ paddingLeft: '42px' }}
                required
              />
            </div>
            {formData.locationAddress && (
              <div style={{ marginTop: '4px', fontSize: '0.74rem', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                <MapPin size={12} color="#38bdf8" /> Map Pin dynamically set to: {formData.lat}, {formData.lng}
              </div>
            )}

            {/* Location Auto-Complete Dropdown */}
            {showLocationSuggestions && (
              <div
                className="glass-panel"
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: '100%',
                  marginTop: '4px',
                  background: '#0f172a',
                  border: '1px solid var(--border-glow)',
                  borderRadius: '12px',
                  zIndex: 200,
                  maxHeight: '180px',
                  overflowY: 'auto',
                  padding: '6px'
                }}
              >
                <p style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, padding: '4px 8px', textTransform: 'uppercase' }}>
                  📍 Suggested Locations (Auto-Plots Map Pin)
                </p>
                {filteredLocationSuggestions.length > 0 ? (
                  filteredLocationSuggestions.map((preset, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleSelectLocationPreset(preset)}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '8px',
                        fontSize: '0.82rem',
                        color: '#f8fafc',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: formData.locationAddress === preset.address ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                        marginBottom: '2px'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'}
                      onMouseOut={(e) => e.currentTarget.style.background = formData.locationAddress === preset.address ? 'rgba(99, 102, 241, 0.2)' : 'transparent'}
                    >
                      <span>📍 {preset.address}</span>
                      {formData.locationAddress === preset.address && <Check size={14} color="#6366f1" />}
                    </div>
                  ))
                ) : (
                  <div style={{ padding: '8px 12px', fontSize: '0.8rem', color: '#94a3b8' }}>
                    Using custom location: "{formData.locationAddress}"
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
              Description *
            </label>
            <textarea
              rows={3}
              placeholder="Provide color, brand, condition, and location details..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              required
            />
          </div>

          {/* Direct File Image Upload */}
          <div>
            <label style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
              Upload Item Photo (From File)
            </label>

            {imagePreview ? (
              <div style={{ position: 'relative', width: '100%', height: '150px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-glow)' }}>
                <img src={imagePreview} alt="Uploaded item preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button
                  type="button"
                  onClick={removeImage}
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: 'rgba(244, 63, 94, 0.85)',
                    border: 'none',
                    color: '#fff',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Trash2 size={14} /> Remove Image
                </button>
              </div>
            ) : (
              <label style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '20px',
                borderRadius: '12px',
                background: 'rgba(15, 23, 42, 0.8)',
                border: '2px dashed var(--border-glow)',
                cursor: 'pointer',
                transition: 'all 0.25s ease'
              }}>
                <UploadCloud size={28} color="#06b6d4" />
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>
                    Click to browse and upload photo file
                  </p>
                  <p style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                    Supports PNG, JPG, JPEG, WEBP files
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  style={{ display: 'none' }}
                />
              </label>
            )}
          </div>

          {/* Verification Question */}
          <div>
            <label style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
              Verification Security Question
            </label>
            <input
              type="text"
              value={formData.proofQuestion}
              onChange={(e) => setFormData(prev => ({ ...prev, proofQuestion: e.target.value }))}
              placeholder="Question to verify claimant ownership"
            />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
            <button type="button" className="btn-secondary" onClick={() => setActiveModal(null)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
