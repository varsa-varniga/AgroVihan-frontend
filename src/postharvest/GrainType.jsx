// src/components/GrainType.jsx
import React, { useState } from 'react';
import { ShoppingCart, CheckCircle, Filter } from 'lucide-react';

export default function GrainType() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedGrain, setSelectedGrain] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const grainListings = [
    {
      id: 1,
      farmer: 'Kumar S.',
      grain: 'Wheat',
      quantity: 100,
      unit: 'quintal',
      price: 2250,
      location: 'Erode',
      contact: '9876543225',
      available: true,
      image: '🌾',
      type: 'grain'
    },
    {
      id: 2,
      farmer: 'Ramesh G.',
      grain: 'Rice',
      quantity: 2500,
      unit: 'gram',
      price: 45,
      location: 'Sathy',
      contact: '9876543226',
      available: true,
      image: '🍚',
      type: 'grain'
    },
    {
      id: 3,
      farmer: 'Priya M.',
      grain: 'Maize',
      quantity: 50,
      unit: 'quintal',
      price: 1800,
      location: 'Coimbatore',
      contact: '9876543227',
      available: true,
      image: '🌽',
      type: 'grain'
    },
    {
      id: 4,
      farmer: 'Ravi K.',
      grain: 'Pulses',
      quantity: 30000,
      unit: 'gram',
      price: 60,
      location: 'Gobichettipalayam',
      contact: '9876543228',
      available: true,
      image: '🫘',
      type: 'pulses'
    },
    {
      id: 5,
      farmer: 'Suresh P.',
      grain: 'Wheat',
      quantity: 75,
      unit: 'quintal',
      price: 2200,
      location: 'Erode',
      contact: '9876543229',
      available: true,
      image: '🌾',
      type: 'grain'
    }
  ];

  const filteredGrains = grainListings.filter(grain => {
    const matchesFilter = filter === 'all' || grain.type === filter;
    const matchesSearch = grain.grain.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         grain.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleGrainBuy = (grain) => {
    setSelectedGrain(grain);
    setShowConfirm(true);
  };

  const grainTypes = [
    { id: 'all', name: 'All Grains', emoji: '🌾' },
    { id: 'grain', name: 'Cereals', emoji: '🌾' },
    { id: 'pulses', name: 'Pulses', emoji: '🫘' }
  ];

  return (
    <>
      {/* Filters and Search */}
      <div style={{ 
        background: 'white', 
        borderRadius: '1rem', 
        padding: '1.5rem', 
        marginBottom: '2rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <Filter size={20} color="#6b7280" />
          <h3 style={{ margin: 0, color: '#374151', fontWeight: 'bold' }}>Filters</h3>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Search */}
          <input
            type="text"
            placeholder="Search grains or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '0.75rem 1rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              flex: '1',
              minWidth: '250px',
              fontSize: '0.875rem'
            }}
          />

          {/* Grain Type Filters */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {grainTypes.map(type => (
              <button
                key={type.id}
                onClick={() => setFilter(type.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  borderRadius: '2rem',
                  border: '1px solid #d1d5db',
                  background: filter === type.id ? '#fef3c7' : 'white',
                  color: filter === type.id ? '#b45309' : '#374151',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  fontSize: '0.875rem'
                }}
              >
                <span>{type.emoji}</span>
                {type.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grain Listings */}
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.5rem'
          }}
        >
          {filteredGrains.map((grain) => (
            <div
              key={grain.id}
              style={{
                background: 'linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%)',
                borderRadius: '0.75rem',
                border: '2px solid #fcd34d',
                overflow: 'hidden',
                transition: 'all 0.3s',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
              }}
            >
              <div style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{grain.image}</div>
                    <h3 style={{ fontWeight: 'bold', fontSize: '1.125rem', color: '#1f2937' }}>
                      {grain.grain}
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>
                      Farmer: {grain.farmer}
                    </p>
                  </div>
                  <span style={{ 
                    backgroundColor: grain.available ? '#dcfce7' : '#fecaca', 
                    color: grain.available ? '#15803d' : '#dc2626', 
                    padding: '0.5rem 0.75rem', 
                    borderRadius: '0.5rem', 
                    fontSize: '0.75rem', 
                    fontWeight: 'bold', 
                    whiteSpace: 'nowrap' 
                  }}>
                    {grain.available ? '✓ Available' : '✗ Sold'}
                  </span>
                </div>
                <div style={{ 
                  backgroundColor: 'white', 
                  borderRadius: '0.5rem', 
                  padding: '1rem', 
                  marginBottom: '1rem', 
                  border: '1px solid #d1d5db' 
                }}>
                  <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 'bold', color: '#4b5563' }}>Quantity:</span> {grain.quantity} {grain.unit}
                  </p>
                  <p style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#16a34a', marginBottom: '0.5rem' }}>
                    ₹{grain.price} per unit
                  </p>
                  <p style={{ fontSize: '0.875rem', color: '#4b5563', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 'bold' }}>Location:</span> {grain.location}
                  </p>
                  <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>
                    <span style={{ fontWeight: 'bold' }}>Contact:</span> {grain.contact}
                  </p>
                </div>
                <button
                  onClick={() => handleGrainBuy(grain)}
                  disabled={!grain.available}
                  style={{
                    width: '100%',
                    background: grain.available 
                      ? 'linear-gradient(90deg, #b45309 0%, #ea580c 100%)'
                      : '#9ca3af',
                    color: 'white',
                    fontWeight: 'bold',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    cursor: grain.available ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.3s',
                    opacity: grain.available ? 1 : 0.6
                  }}
                  onMouseEnter={(e) => {
                    if (grain.available) {
                      e.currentTarget.style.opacity = '0.9';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (grain.available) {
                      e.currentTarget.style.opacity = '1';
                    }
                  }}
                >
                  <ShoppingCart size={18} />
                  {grain.available ? 'Buy Now' : 'Sold Out'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredGrains.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '4rem', 
            background: 'white', 
            borderRadius: '1rem',
            border: '2px dashed #d1d5db'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🌾</div>
            <h3 style={{ color: '#374151', marginBottom: '0.5rem' }}>No grains found</h3>
            <p style={{ color: '#6b7280' }}>Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Purchase Confirmation Modal */}
      {showConfirm && selectedGrain && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            padding: '1rem'
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '1rem',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)',
              maxWidth: '32rem',
              width: '100%',
              padding: '2rem',
              textAlign: 'center'
            }}
          >
            <CheckCircle color="#22c55e" style={{ margin: '0 auto', marginBottom: '1rem' }} size={56} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>
              Order Confirmed!
            </h2>
            <div style={{ 
              background: '#f8fafc', 
              borderRadius: '0.5rem', 
              padding: '1.5rem', 
              marginBottom: '1.5rem',
              textAlign: 'left'
            }}>
              <p style={{ margin: '0.5rem 0', color: '#374151' }}>
                <strong>Grain:</strong> {selectedGrain.grain}
              </p>
              <p style={{ margin: '0.5rem 0', color: '#374151' }}>
                <strong>Farmer:</strong> {selectedGrain.farmer}
              </p>
              <p style={{ margin: '0.5rem 0', color: '#374151' }}>
                <strong>Quantity:</strong> {selectedGrain.quantity} {selectedGrain.unit}
              </p>
              <p style={{ margin: '0.5rem 0', color: '#374151' }}>
                <strong>Price:</strong> ₹{selectedGrain.price} per unit
              </p>
              <p style={{ margin: '0.5rem 0', color: '#374151' }}>
                <strong>Total:</strong> ₹{selectedGrain.quantity * selectedGrain.price}
              </p>
              <p style={{ margin: '1rem 0 0 0', padding: '0.75rem', background: '#dcfce7', borderRadius: '0.375rem', color: '#15803d' }}>
                ✓ Your grain will be delivered to the collection center
              </p>
            </div>
            <button
              onClick={() => setShowConfirm(false)}
              style={{
                width: '100%',
                background: 'linear-gradient(90deg, #16a34a 0%, #059669 100%)',
                color: 'white',
                fontWeight: 'bold',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => (e.target.style.opacity = '0.9')}
              onMouseLeave={(e) => (e.target.style.opacity = '1')}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </>
  );
}