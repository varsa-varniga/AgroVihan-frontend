// src/postharvest/Alerts.jsx
import React from 'react';
import { AlertCircle, Bell, Lightbulb } from 'lucide-react';

export default function Alerts() {
  const alerts = [
    {
      id: 1,
      type: 'HIGH_MOISTURE',
      message: 'High spoilage risk',
      severity: 'critical',
      temp: 32,
      humidity: 78,
      moisture: 16,
      timestamp: new Date(),
      suggestions: [
        'Increase ventilation immediately',
        'Use dehumidifiers in storage area',
        'Spread grains to reduce moisture',
        'Check for mold formation'
      ]
    },
    {
      id: 2,
      type: 'HIGH_TEMP',
      message: 'Reduce temperature',
      severity: 'warning',
      temp: 36,
      humidity: 65,
      moisture: 12,
      timestamp: new Date(Date.now() - 300000),
      suggestions: [
        'Improve air circulation',
        'Use cooling fans',
        'Monitor temperature hourly',
        'Consider relocating grains'
      ]
    }
  ];

  return (
    <div
      style={{
        backgroundColor: 'white',
        borderRadius: '1rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        padding: '1.5rem',
        border: '1px solid #e5e7eb'
      }}
    >
      <h2
        style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: '#1f2937',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}
      >
        <AlertCircle color="#dc2626" size={28} />
        IoT Grain Health
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {alerts.map(alert => (
          <div
            key={alert.id}
            style={{
              padding: '1.25rem',
              borderRadius: '0.75rem',
              border: `1px solid ${alert.severity === 'critical' ? '#fecaca' : '#fde047'}`,
              backgroundColor: alert.severity === 'critical' ? '#fef2f2' : '#fffbeb',
              transition: 'all 0.3s ease',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                marginBottom: '1rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                {alert.severity === 'critical' ? (
                  <AlertCircle color="#dc2626" size={20} />
                ) : (
                  <Bell color="#f59e0b" size={20} />
                )}
                <div>
                  <h3
                    style={{
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      color: alert.severity === 'critical' ? '#b91c1c' : '#b45309',
                      margin: '0 0 0.25rem 0'
                    }}
                  >
                    {alert.message}
                  </h3>
                  <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>
                    {alert.timestamp.toLocaleString()}
                  </p>
                </div>
              </div>
              <span
                style={{
                  padding: '0.25rem 0.75rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  whiteSpace: 'nowrap',
                  backgroundColor: alert.severity === 'critical' ? '#fecaca' : '#fde047',
                  color: alert.severity === 'critical' ? '#991b1b' : '#92400e'
                }}
              >
                {alert.severity.toUpperCase()}
              </span>
            </div>

            {/* Metrics */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1rem',
                marginBottom: '1rem',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                padding: '1rem',
                borderRadius: '0.5rem',
                border: '1px solid #f3f4f6'
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <p style={{ color: '#6b7280', fontSize: '0.75rem', fontWeight: '600', margin: '0 0 0.25rem 0' }}>
                  Temperature
                </p>
                <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#dc2626', margin: 0 }}>
                  {alert.temp}°C
                </p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ color: '#6b7280', fontSize: '0.75rem', fontWeight: '600', margin: '0 0 0.25rem 0' }}>
                  Humidity
                </p>
                <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#2563eb', margin: 0 }}>
                  {alert.humidity}%
                </p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ color: '#6b7280', fontSize: '0.75rem', fontWeight: '600', margin: '0 0 0.25rem 0' }}>
                  Moisture
                </p>
                <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#059669', margin: 0 }}>
                  {alert.moisture}%
                </p>
              </div>
            </div>

            {/* Actionable Suggestions */}
            {alert.suggestions && (
              <div
                style={{
                  padding: '1rem',
                  backgroundColor: alert.severity === 'critical' ? '#fffbeb' : '#f0f9ff',
                  borderRadius: '0.5rem',
                  border: `1px solid ${alert.severity === 'critical' ? '#fde047' : '#bae6fd'}`
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <Lightbulb size={16} color={alert.severity === 'critical' ? '#d97706' : '#0369a1'} />
                  <span style={{ 
                    fontSize: '0.875rem', 
                    fontWeight: '600', 
                    color: alert.severity === 'critical' ? '#92400e' : '#1e40af' 
                  }}>
                    Recommended Actions:
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {alert.suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.5rem',
                        padding: '0.5rem',
                        backgroundColor: 'white',
                        borderRadius: '0.375rem',
                        border: '1px solid #f3f4f6'
                      }}
                    >
                      <span style={{ 
                        color: alert.severity === 'critical' ? '#dc2626' : '#3b82f6',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        minWidth: '1.5rem'
                      }}>
                        {index + 1}.
                      </span>
                      <span style={{ 
                        fontSize: '0.875rem', 
                        color: '#4b5563',
                        lineHeight: '1.4'
                      }}>
                        {suggestion}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}