import React, { useState } from 'react';
import { useItems } from '../context/ItemContext';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Navigation, Layers, MapPin, Eye, User } from 'lucide-react';

// Tile Layer options
const TILE_LAYERS = {
  dark: {
    name: 'CartoDB Dark Matter',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>'
  },
  osm: {
    name: 'OpenStreetMap Standard',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors'
  },
  satellite: {
    name: 'Esri World Imagery',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri'
  }
};

// Create custom glowing Leaflet HTML markers
const createCustomIcon = (type, isSelected) => {
  const isLost = type === 'lost';
  const color = isLost ? '#f43f5e' : '#10b981';
  const glow = isLost ? 'rgba(244, 63, 94, 0.6)' : 'rgba(16, 185, 129, 0.6)';
  const scale = isSelected ? 'scale(1.25)' : 'scale(1)';

  return L.divIcon({
    className: 'custom-leaflet-pin',
    html: `
      <div style="
        position: relative;
        width: 38px;
        height: 38px;
        transform: ${scale};
        transition: transform 0.25s ease;
      ">
        <div style="
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: ${color};
          opacity: 0.35;
          animation: pulsePin 2s infinite ease-in-out;
        "></div>
        <div style="
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: ${color};
          border: 2px solid #ffffff;
          box-shadow: 0 0 16px ${glow};
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 2px;
        ">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
        </div>
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    popupAnchor: [0, -20]
  });
};

// Helper component to center map on selection
const RecenterMap = ({ center }) => {
  const map = useMap();
  if (center) {
    map.flyTo(center, 15, { duration: 1.2 });
  }
  return null;
};

const LOCATION_PRESETS = [
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
  if (match) return { lat: match.lat, lng: match.lng };

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

export const InteractiveMap = () => {
  const { items, setSelectedItem, setActiveModal } = useItems();
  const [activeTile, setActiveTile] = useState('dark');
  const [selectedMapItem, setSelectedMapItem] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [locationQuery, setLocationQuery] = useState('');
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [targetPin, setTargetPin] = useState(null);

  const defaultCenter = [37.7749, -122.4194];

  const filteredItems = items.filter(item => {
    if (filterType === 'all') return true;
    return item.type === filterType;
  });

  const locationSuggestions = LOCATION_PRESETS.filter(p =>
    p.address.toLowerCase().includes(locationQuery.toLowerCase())
  );

  const handleSelectLocation = (preset) => {
    setLocationQuery(preset.address);
    setTargetPin({ lat: preset.lat, lng: preset.lng, address: preset.address });
    setShowLocationSuggestions(false);
  };

  const handleLocationInputChange = (val) => {
    setLocationQuery(val);
    if (val.trim()) {
      const coords = getCoordinatesForAddress(val);
      setTargetPin({ lat: coords.lat, lng: coords.lng, address: val });
    } else {
      setTargetPin(null);
    }
  };

  return (
    <div style={{ margin: '0 20px 32px 20px' }}>
      <div className="glass-panel" style={{ padding: '24px', borderRadius: '24px' }}>
        
        {/* Map Header Controls */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '20px'
        }}>
          <div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Navigation size={24} color="#06b6d4" /> Real-Time Leaflet GIS Lost & Found Map
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '2px' }}>
              GPS location markers for user-reported lost and found items
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Location Mention / Search Bar with Autocomplete Suggestions */}
            <div style={{ position: 'relative', width: '280px' }}>
              <div style={{ position: 'relative' }}>
                <MapPin size={16} color="#38bdf8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Mention location to point pin..."
                  value={locationQuery}
                  onChange={(e) => handleLocationInputChange(e.target.value)}
                  onFocus={() => setShowLocationSuggestions(true)}
                  style={{
                    paddingLeft: '36px',
                    paddingRight: '12px',
                    fontSize: '0.82rem',
                    borderRadius: '12px',
                    background: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid rgba(56, 189, 248, 0.4)'
                  }}
                />
              </div>

              {/* Suggestions Dropdown */}
              {showLocationSuggestions && locationQuery && (
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
                    zIndex: 1000,
                    maxHeight: '180px',
                    overflowY: 'auto',
                    padding: '6px'
                  }}
                >
                  <p style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, padding: '4px 8px', textTransform: 'uppercase' }}>
                    📍 Mentioned Location Suggestions
                  </p>
                  {locationSuggestions.length > 0 ? (
                    locationSuggestions.map((preset, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleSelectLocation(preset)}
                        style={{
                          padding: '8px 10px',
                          borderRadius: '8px',
                          fontSize: '0.8rem',
                          color: '#f8fafc',
                          cursor: 'pointer',
                          background: locationQuery === preset.address ? 'rgba(99, 102, 241, 0.25)' : 'transparent',
                          marginBottom: '2px'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'}
                        onMouseOut={(e) => e.currentTarget.style.background = locationQuery === preset.address ? 'rgba(99, 102, 241, 0.25)' : 'transparent'}
                      >
                        📍 {preset.address}
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: '8px', fontSize: '0.78rem', color: '#94a3b8' }}>
                      Pointing pin to: "{locationQuery}"
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Filter Toggle */}
            <div style={{ display: 'flex', background: 'rgba(15, 23, 42, 0.8)', borderRadius: '12px', padding: '3px', border: '1px solid var(--border-glass)' }}>
              <button
                onClick={() => setFilterType('all')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  background: filterType === 'all' ? 'rgba(99, 102, 241, 0.3)' : 'transparent',
                  color: filterType === 'all' ? '#a5b4fc' : '#94a3b8',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                All ({items.length})
              </button>
              <button
                onClick={() => setFilterType('lost')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  background: filterType === 'lost' ? 'rgba(244, 63, 94, 0.3)' : 'transparent',
                  color: filterType === 'lost' ? '#fda4af' : '#94a3b8',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Lost 🔴
              </button>
              <button
                onClick={() => setFilterType('found')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  background: filterType === 'found' ? 'rgba(16, 185, 129, 0.3)' : 'transparent',
                  color: filterType === 'found' ? '#6ee7b7' : '#94a3b8',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Found 🟢
              </button>
            </div>

            {/* Tile Layer Switcher */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Layers size={16} color="#06b6d4" />
              <select
                value={activeTile}
                onChange={(e) => setActiveTile(e.target.value)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '10px',
                  fontSize: '0.8rem',
                  background: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid var(--border-glass)',
                  color: '#f8fafc',
                  cursor: 'pointer'
                }}
              >
                <option value="dark">🌙 Dark GIS Map</option>
                <option value="osm">🗺️ OpenStreetMap</option>
                <option value="satellite">🛰️ Satellite View</option>
              </select>
            </div>
          </div>
        </div>

        {/* Real Leaflet Map Container */}
        <div style={{ position: 'relative', height: '520px', borderRadius: '20px', overflow: 'hidden', border: '1px solid var(--border-glass)' }}>
          <MapContainer
            center={defaultCenter}
            zoom={14}
            scrollWheelZoom={true}
            style={{ height: '100%', width: '100%', zIndex: 1 }}
          >
            <TileLayer
              url={TILE_LAYERS[activeTile].url}
              attribution={TILE_LAYERS[activeTile].attribution}
            />

            {targetPin && (
              <RecenterMap center={[targetPin.lat, targetPin.lng]} />
            )}

            {selectedMapItem?.location?.lat && !targetPin && (
              <RecenterMap center={[selectedMapItem.location.lat, selectedMapItem.location.lng]} />
            )}

            {/* Mentioned Location Direct Pin */}
            {targetPin && (
              <Marker
                position={[targetPin.lat, targetPin.lng]}
                icon={L.divIcon({
                  className: 'custom-target-pin',
                  html: `
                    <div style="
                      width: 44px;
                      height: 44px;
                      border-radius: 50%;
                      background: #06b6d4;
                      border: 3px solid #ffffff;
                      box-shadow: 0 0 24px rgba(6, 182, 212, 0.9);
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      animation: pulsePin 1.5s infinite ease-in-out;
                    ">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                    </div>
                  `,
                  iconSize: [44, 44],
                  iconAnchor: [22, 22],
                  popupAnchor: [0, -22]
                })}
              >
                <Popup>
                  <div style={{ color: '#0f172a', padding: '6px', fontWeight: 700, fontSize: '0.85rem' }}>
                    📍 Mentioned Location:<br />
                    <span style={{ color: '#0284c7', fontSize: '0.8rem' }}>{targetPin.address}</span>
                  </div>
                </Popup>
              </Marker>
            )}

            {filteredItems.map((item, index) => {
              const lat = item.location?.lat || (37.7749 + (index * 0.0025 - 0.003));
              const lng = item.location?.lng || (-122.4194 + (index * 0.0035 - 0.004));

              return (
                <Marker
                  key={item._id}
                  position={[lat, lng]}
                  icon={createCustomIcon(item.type, selectedMapItem?._id === item._id)}
                  eventHandlers={{
                    click: () => setSelectedMapItem(item)
                  }}
                >
                  <Popup className="leaflet-custom-popup">
                    <div style={{ width: '230px', color: '#0f172a', padding: '4px' }}>
                      {item.images && item.images[0] && (
                        <img
                          src={item.images[0]}
                          alt={item.title}
                          style={{ width: '100%', height: '110px', objectFit: 'cover', borderRadius: '8px', marginBottom: '8px' }}
                        />
                      )}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          background: item.type === 'lost' ? '#fee2e2' : '#d1fae5',
                          color: item.type === 'lost' ? '#991b1b' : '#065f46'
                        }}>
                          {item.type}
                        </span>
                        <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                          {item.category}
                        </span>
                      </div>
                      <h4 style={{ fontSize: '0.92rem', fontWeight: 700, margin: '2px 0 4px 0', color: '#0f172a' }}>
                        {item.title}
                      </h4>

                      {/* Display Reporter Name */}
                      <p style={{ fontSize: '0.75rem', color: '#4338ca', fontWeight: 600, marginBottom: '4px' }}>
                        👤 Reported by: {item.reporter?.name || 'User'}
                      </p>

                      {/* Display Location Entered by User */}
                      <p style={{ fontSize: '0.78rem', color: '#0284c7', fontWeight: 700, marginBottom: '10px' }}>
                        📍 {item.location?.address || 'Main Campus'}
                      </p>

                      <button
                        onClick={() => {
                          setSelectedItem(item);
                          setActiveModal('claim');
                        }}
                        style={{
                          width: '100%',
                          padding: '8px',
                          borderRadius: '8px',
                          border: 'none',
                          background: item.type === 'lost' ? '#f43f5e' : '#10b981',
                          color: '#ffffff',
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}
                      >
                        <Eye size={14} /> View Details / Claim
                      </button>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>

      </div>
    </div>
  );
};
