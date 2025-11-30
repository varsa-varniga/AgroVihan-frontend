// src/postharvest/NearbyTransport.jsx
import React, { useState } from 'react';
import { MapPin, Truck, CheckCircle, Phone, Navigation, MessageCircle } from 'lucide-react';

export default function NearbyTransport() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');

  const nearbyTransporters = [
    {
      id: 1,
      name: 'Ravi Transport',
      distance: 2.3,
      location: 'Erode',
      phone: '9876543210',
      vehicle: 'Truck (10T)',
      costPerKm: 15,
      rating: 4.5
    },
    {
      id: 2,
      name: 'Sathy Logistics',
      distance: 3.1,
      location: 'Sathy',
      phone: '9876543211',
      vehicle: 'Mini Truck (5T)',
      costPerKm: 12,
      rating: 4.8
    },
    {
      id: 3,
      name: 'Coimbatore Carriers',
      distance: 5.2,
      location: 'Coimbatore',
      phone: '9876543212',
      vehicle: 'Truck (15T)',
      costPerKm: 18,
      rating: 4.2
    },
    {
      id: 4,
      name: 'Gobi Transport',
      distance: 4.5,
      location: 'Gobichettipalayam',
      phone: '9876543213',
      vehicle: 'Tractor (2T)',
      costPerKm: 8,
      rating: 4.6
    },
    {
      id: 5,
      name: 'Express Movers',
      distance: 6.1,
      location: 'Coimbatore',
      phone: '9876543214',
      vehicle: 'Truck (12T)',
      costPerKm: 16,
      rating: 4.3
    },
    {
      id: 6,
      name: 'Local Carriers',
      distance: 1.8,
      location: 'Erode',
      phone: '9876543215',
      vehicle: 'Auto (1T)',
      costPerKm: 6,
      rating: 4.9
    },
    {
      id: 7,
      name: 'Fast Delivery',
      distance: 3.5,
      location: 'Sathy',
      phone: '9876543216',
      vehicle: 'Mini Truck (4T)',
      costPerKm: 11,
      rating: 4.4
    },
    {
      id: 8,
      name: 'Premium Logistics',
      distance: 7.2,
      location: 'Coimbatore',
      phone: '9876543217',
      vehicle: 'Truck (20T)',
      costPerKm: 20,
      rating: 4.7
    },
    {
      id: 9,
      name: 'Green Transport',
      distance: 2.8,
      location: 'Erode',
      phone: '9876543218',
      vehicle: 'Mini Truck (6T)',
      costPerKm: 13,
      rating: 4.5
    },
    {
      id: 10,
      name: 'Village Express',
      distance: 4.2,
      location: 'Gobichettipalayam',
      phone: '9876543219',
      vehicle: 'Truck (8T)',
      costPerKm: 10,
      rating: 4.6
    }
  ];

  const handleTransportBook = (transporter) => {
    const estimatedCost = (transporter.distance * transporter.costPerKm).toFixed(2);
    setConfirmMessage(
      `Booking confirmed for ${transporter.name}!\n\nEstimated Cost: ₹${estimatedCost}\nDelivery Time: ~${Math.ceil(transporter.distance * 10)} minutes\nVehicle: ${transporter.vehicle}\n\nYou will receive a confirmation call shortly.`
    );
    setShowConfirm(true);
  };

  const handleCall = (phoneNumber) => {
    alert(`Calling ${phoneNumber}...\n\n(This is a demo - in a real app, this would dial the number)`);
  };

  const handleWhatsApp = (transporter) => {
    const message = `Hello ${transporter.name}! I would like to book your ${transporter.vehicle} for transport. Please share availability.`;
    alert(`Opening WhatsApp for ${transporter.phone}...\n\nMessage: "${message}"\n\n(This is a demo - in a real app, this would open WhatsApp)`);
  };

  const handleRoute = (transporter) => {
    alert(`Opening navigation to ${transporter.name} in ${transporter.location}...\n\nDistance: ${transporter.distance}km\n\n(This is a demo - in a real app, this would open maps)`);
  };

  return (
    <>
      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto', 
        padding: '2rem 1.5rem',
        backgroundColor: 'white',
        borderRadius: '1rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        border: '1px solid #e5e7eb'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: 'bold', 
            color: '#1e40af',
            marginBottom: '0.5rem'
          }}>
            Nearby Transport
          </h1>
          <p style={{ 
            color: '#4b5563', 
            fontSize: '1.125rem',
            marginBottom: '1rem'
          }}>
            Available in: Erode • Sathy • Coimbatore • Gobichettipalayam ({nearbyTransporters.length} Transporters)
          </p>
          <div style={{ 
            height: '2px', 
            background: 'linear-gradient(90deg, transparent 0%, #3b82f6 50%, transparent 100%)',
            margin: '1rem 0'
          }} />
        </div>

        {/* Transporters List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {nearbyTransporters.map((transporter) => (
            <div
              key={transporter.id}
              style={{
                padding: '1.5rem',
                borderRadius: '0.75rem',
                border: '1px solid #e5e7eb',
                backgroundColor: '#fafafa',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f0f9ff';
                e.currentTarget.style.borderColor = '#3b82f6';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#fafafa';
                e.currentTarget.style.borderColor = '#e5e7eb';
              }}
            >
              {/* Transporter Header */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                marginBottom: '1rem'
              }}>
                <h3 style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: 'bold', 
                  color: '#1e40af',
                  margin: 0
                }}>
                  {transporter.name}
                </h3>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  fontSize: '0.875rem',
                  color: '#4b5563'
                }}>
                  <MapPin size={16} />
                  <span>{transporter.location}</span>
                </div>
              </div>

              {/* Transporter Details */}
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '0.75rem',
                marginBottom: '1.5rem'
              }}>
                <div>
                  <p style={{ 
                    fontSize: '0.875rem', 
                    color: '#4b5563',
                    margin: '0 0 0.25rem 0'
                  }}>
                    <strong style={{color: '#1e40af'}}>Distance:</strong> {transporter.distance}km away
                  </p>
                  <p style={{ 
                    fontSize: '0.875rem', 
                    color: '#4b5563',
                    margin: '0 0 0.25rem 0'
                  }}>
                    <strong style={{color: '#1e40af'}}>Vehicle:</strong> {transporter.vehicle}
                  </p>
                  <p style={{ 
                    fontSize: '0.875rem', 
                    color: '#4b5563',
                    margin: 0
                  }}>
                    <strong style={{color: '#1e40af'}}>Rate:</strong> ₹{transporter.costPerKm}/km
                  </p>
                </div>
                <div>
                  <p style={{ 
                    fontSize: '0.875rem', 
                    color: '#4b5563',
                    margin: '0 0 0.25rem 0'
                  }}>
                    <strong style={{color: '#1e40af'}}>Est. Cost:</strong> ₹{(transporter.distance * transporter.costPerKm).toFixed(0)}
                  </p>
                  <p style={{ 
                    fontSize: '0.875rem', 
                    color: '#4b5563',
                    margin: 0
                  }}>
                    <strong style={{color: '#1e40af'}}>Phone:</strong> {transporter.phone}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ 
                display: 'flex', 
                gap: '0.75rem',
                borderTop: '1px solid #e5e7eb',
                paddingTop: '1rem'
              }}>
                <button
                  onClick={() => handleTransportBook(transporter)}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1rem',
                    backgroundColor: '#1e40af',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#2563eb';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#1e40af';
                  }}
                >
                  <Truck size={16} />
                  Book Transport
                </button>
                
                <button
                  onClick={() => handleCall(transporter.phone)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1rem',
                    backgroundColor: 'transparent',
                    color: '#1e40af',
                    border: '1px solid #3b82f6',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#dbeafe';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <Phone size={16} />
                  Call
                </button>
                
                <button
                  onClick={() => handleWhatsApp(transporter)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1rem',
                    backgroundColor: 'transparent',
                    color: '#1e40af',
                    border: '1px solid #3b82f6',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#dbeafe';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <MessageCircle size={16} />
                  WhatsApp
                </button>
                
                <button
                  onClick={() => handleRoute(transporter)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1rem',
                    backgroundColor: 'transparent',
                    color: '#1e40af',
                    border: '1px solid #3b82f6',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#dbeafe';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <Navigation size={16} />
                  Route
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
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
            <CheckCircle color="#16a34a" style={{ margin: '0 auto', marginBottom: '1rem' }} size={48} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#16a34a', marginBottom: '1rem' }}>Booking Confirmed!</h2>
            <p style={{ color: '#374151', whiteSpace: 'pre-line', marginBottom: '1.5rem', lineHeight: '1.6' }}>
              {confirmMessage}
            </p>
            <button
              onClick={() => setShowConfirm(false)}
              style={{
                width: '100%',
                backgroundColor: '#16a34a',
                color: 'white',
                fontWeight: 'bold',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = '#22c55e')}
              onMouseLeave={(e) => (e.target.style.backgroundColor = '#16a34a')}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
}