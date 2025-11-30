// src/postharvest/Alerts.jsx
import React, { useState, useEffect } from 'react';
import { AlertCircle, Bell, Lightbulb, Wifi, WifiOff } from 'lucide-react';
import { iotDatabase } from '../firebase';
import { ref, onValue } from 'firebase/database';

export default function Alerts() {
  const [sensorData, setSensorData] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch real-time data from IoT Firebase
  useEffect(() => {
    const sensorRef = ref(iotDatabase, 'sensor');
    
    console.log('🔌 Connecting to IoT Firebase...');
    
    const unsubscribe = onValue(sensorRef, (snapshot) => {
      setLoading(false);
      setIsConnected(true);
      
      const data = snapshot.val();
      console.log('🔥 Live IoT Data:', data);
      setSensorData(data);
      
      if (data) {
        generateAlerts(data);
      }
    }, (error) => {
      console.error('❌ IoT Connection Error:', error);
      setLoading(false);
      setIsConnected(false);
    });

    return () => unsubscribe();
  }, []);

  // Generate alerts based on sensor data
  const generateAlerts = (data) => {
    const newAlerts = [];
    const timestamp = new Date();

    // Temperature Alerts
    if (data.temperature > 32) {
      newAlerts.push({
        id: 1,
        type: 'HIGH_TEMP',
        message: 'High temperature detected',
        severity: data.temperature > 35 ? 'critical' : 'warning',
        temp: data.temperature,
        humidity: data.humidity,
        gasLevel: data.mq9,
        timestamp: timestamp,
        suggestions: [
          'Increase ventilation immediately',
          'Use cooling fans in storage area',
          'Monitor temperature every 30 minutes'
        ]
      });
    }

    // Humidity Alerts
    if (data.humidity > 70) {
      newAlerts.push({
        id: 2,
        type: 'HIGH_HUMIDITY',
        message: 'High humidity risk',
        severity: data.humidity > 75 ? 'critical' : 'warning',
        temp: data.temperature,
        humidity: data.humidity,
        gasLevel: data.mq9,
        timestamp: timestamp,
        suggestions: [
          'Use dehumidifiers in storage area',
          'Improve air circulation',
          'Check for condensation'
        ]
      });
    }

    // Gas Alerts
    if (data.mq9 > 1000) {
      newAlerts.push({
        id: 3,
        type: 'GAS_ALERT',
        message: 'High gas levels detected',
        severity: data.mq9 > 1200 ? 'critical' : 'warning',
        temp: data.temperature,
        humidity: data.humidity,
        gasLevel: data.mq9,
        timestamp: timestamp,
        suggestions: [
          'Check for grain spoilage',
          'Increase ventilation immediately',
          'Inspect for mold formation'
        ]
      });
    }

    // Safe conditions
    if (newAlerts.length === 0) {
      newAlerts.push({
        id: 4,
        type: 'OPTIMAL',
        message: 'Optimal storage conditions',
        severity: 'safe',
        temp: data.temperature,
        humidity: data.humidity,
        gasLevel: data.mq9,
        timestamp: timestamp,
        suggestions: [
          'Continue regular monitoring',
          'Maintain current ventilation',
          'Keep storage area clean'
        ]
      });
    }

    setAlerts(newAlerts);
  };

  return (
    <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '1.5rem', border: '1px solid #e5e7eb' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <AlertCircle color="#dc2626" size={28} />
        IoT Grain Health Monitor
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: 'auto' }}>
          {isConnected ? <Wifi color="#059669" size={20} /> : <WifiOff color="#dc2626" size={20} />}
          <span style={{ fontSize: '0.875rem', color: isConnected ? '#059669' : '#dc2626', fontWeight: '600' }}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </h2>

      {/* Live Sensor Data */}
      {sensorData && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem', backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '0.75rem' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#6b7280', fontSize: '0.75rem', fontWeight: '600', margin: '0 0 0.25rem 0' }}>Temperature</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: sensorData.temperature > 32 ? '#dc2626' : '#059669', margin: 0 }}>
              {sensorData.temperature}°C
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#6b7280', fontSize: '0.75rem', fontWeight: '600', margin: '0 0 0.25rem 0' }}>Humidity</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: sensorData.humidity > 70 ? '#dc2626' : '#2563eb', margin: 0 }}>
              {sensorData.humidity}%
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#6b7280', fontSize: '0.75rem', fontWeight: '600', margin: '0 0 0.25rem 0' }}>Gas Level</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: sensorData.mq9 > 1000 ? '#dc2626' : '#6b7280', margin: 0 }}>
              {sensorData.mq9}
            </p>
          </div>
        </div>
      )}

      {/* Alerts will display here */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
            Connecting to IoT sensors...
          </div>
        ) : alerts.length > 0 ? (
          alerts.map(alert => (
            <div key={alert.id} style={{ padding: '1.25rem', borderRadius: '0.75rem', backgroundColor: alert.severity === 'critical' ? '#fef2f2' : alert.severity === 'warning' ? '#fffbeb' : '#f0fdf4', border: `1px solid ${alert.severity === 'critical' ? '#fecaca' : alert.severity === 'warning' ? '#fde047' : '#bbf7d0'}` }}>
              <h3 style={{ color: alert.severity === 'critical' ? '#b91c1c' : alert.severity === 'warning' ? '#b45309' : '#15803d', margin: '0 0 1rem 0' }}>
                {alert.message}
              </h3>
              <p>Temperature: {alert.temp}°C | Humidity: {alert.humidity}% | Gas: {alert.gasLevel}</p>
            </div>
          ))
        ) : (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
            No sensor data received
          </div>
        )}
      </div>
    </div>
  );
}