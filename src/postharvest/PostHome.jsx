// src/postharvest/PostHome.jsx
import React, { useState } from 'react';
import Alerts from './Alerts';
import MandiPrice from './MandiPrice';
import NearbyTransport from './NearbyTransport';
import GrainType from './GrainType';
import Aggregator from './Aggregator';
import { AlertTriangle, TrendingUp, Truck, Wheat, Home, Shield, Users } from 'lucide-react';

export default function PostHome() {
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'alerts':
        return <Alerts />;
      case 'mandi':
        return <MandiPrice />;
      case 'transport':
        return <NearbyTransport />;
      case 'grains':
        return <GrainType />;

      case 'aggregator':
        return <Aggregator />;

     case 'home':
      default:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <Alerts />
            <MandiPrice />
            <Aggregator />
          </div>
        )
    }
  };

  const navItems = [
    //{ id: 'home', label: 'Dashboard', icon: Home, color: '#6366F1', gradient: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)' },
    { id: 'alerts', label: 'Grain Health', icon: Shield, color: '#EF4444', gradient: 'linear-gradient(135deg, #EF4444 0%, #F97316 100%)' },
    { id: 'mandi', label: 'Mandi Prices', icon: TrendingUp, color: '#10B981', gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)' },
    { id: 'transport', label: 'Transport', icon: Truck, color: '#3B82F6', gradient: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)' },
    { id: 'grains', label: 'Grain Market', icon: Wheat, color: '#F59E0B', gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' },
    { id: 'aggregator', label: 'Aggregator', icon: Home, color: '#6366F1', gradient: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)' },

  ];

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      padding: '1rem'
    }}>
      {/* Navigation Bar */}
      <div
        style={{
          background: 'white',
          borderRadius: '1rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          padding: '1.5rem 2rem',
          marginBottom: '2rem',
          border: '1px solid #e2e8f0'
        }}
      >
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          {/* Logo Section */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
            }}>
              <Wheat size={24} color="white" />
            </div>
            <div>
              <h1
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  margin: 0
                }}
              >
                Post-Harvest Hub
              </h1>
              <p style={{ 
                color: '#6B7280', 
                fontSize: '0.875rem',
                margin: 0,
                fontWeight: '500'
              }}>
                Smart Grain Management & Trading
              </p>
            </div>
          </div>
          
          {/* Navigation Items */}
          <div style={{ 
            display: 'flex', 
            gap: '0.5rem',
            flexWrap: 'wrap'
          }}>
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1rem',
                    borderRadius: '0.75rem',
                    border: 'none',
                    background: isActive ? item.gradient : 'transparent',
                    color: isActive ? 'white' : '#64748b',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: isActive ? `0 4px 12px ${item.color}40` : 'none',
                    transform: isActive ? 'translateY(-1px)' : 'translateY(0)',
                    position: 'relative',
                    fontSize: '0.875rem'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = '#f8fafc';
                      e.currentTarget.style.color = item.color;
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#64748b';
                      e.currentTarget.style.boxShadow = 'none';
                    }
                  }}
                >
                  <IconComponent size={18} />
                  <span style={{ whiteSpace: 'nowrap' }}>
                    {item.label}
                  </span>
                  
                  {/* Active indicator */}
                  {isActive && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '6px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '16px',
                        height: '2px',
                        background: 'rgba(255, 255, 255, 0.9)',
                        borderRadius: '1px'
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Status Section */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem',
            padding: '0.5rem 1rem',
            background: '#f0fdf4',
            borderRadius: '0.75rem',
            border: '1px solid #dcfce7'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              background: '#10B981',
              borderRadius: '50%',
              animation: 'pulse 2s infinite'
            }} />
            <span style={{ 
              fontSize: '0.875rem', 
              fontWeight: '600',
              color: '#166534'
            }}>
              Live
            </span>
            <Users size={16} color="#16a34a" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto',
        animation: 'fadeIn 0.3s ease-in'
      }}>
        {renderContent()}
      </div>

      {/* Global Styles */}
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
}