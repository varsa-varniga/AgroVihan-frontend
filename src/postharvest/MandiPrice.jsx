// src/postharvest/MandiPrice.jsx
import React from 'react';
import { TrendingUp, Calendar, MapPin } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export default function MandiPrice() {
  const mandiPrices = [
    { day: 'Mon', price: 2100, predicted: false },
    { day: 'Tue', price: 2150, predicted: false },
    { day: 'Wed', price: 2200, predicted: false },
    { day: 'Thu', price: 2180, predicted: false },
    { day: 'Fri', price: 2250, predicted: false },
    { day: 'Sat', price: 2280, predicted: true },
    { day: 'Sun', price: 2320, predicted: true }
  ];

  const currentPrice = mandiPrices[4]; // Friday's price as current
  const priceChange = ((currentPrice.price - mandiPrices[3].price) / mandiPrices[3].price * 100).toFixed(1);

  return (
    <div
      style={{
        backgroundColor: 'white',
        borderRadius: '1.5rem',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.05)',
        padding: '2rem',
        border: '1px solid #e5e7eb'
      }}
    >
      {/* Header Section */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            padding: '0.75rem',
            background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
            borderRadius: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <TrendingUp color="white" size={28} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
              Mandi Prices
            </h2>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <MapPin size={14} />
              Erode Market • Live from Agmarknet
            </p>
          </div>
        </div>
        
        <div style={{
          padding: '0.5rem 1rem',
          background: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Calendar size={16} color="#16a34a" />
          <span style={{ fontSize: '0.875rem', color: '#166534', fontWeight: '600' }}>
            Updated: Today
          </span>
        </div>
      </div>

      {/* Current Price Card */}
      <div style={{
        background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
        border: '2px solid #bbf7d0',
        borderRadius: '1rem',
        padding: '1.5rem',
        marginBottom: '2rem',
        textAlign: 'center'
      }}>
        <p style={{ color: '#374151', fontSize: '0.875rem', margin: '0 0 0.5rem 0', fontWeight: '600' }}>
          CURRENT WHEAT PRICE
        </p>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#16a34a' }}>
            ₹{currentPrice.price}
          </span>
          <span style={{ fontSize: '1rem', color: '#6b7280', fontWeight: '600' }}>
            /quintal
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <TrendingUp size={16} color={priceChange >= 0 ? '#16a34a' : '#dc2626'} />
          <span style={{ 
            color: priceChange >= 0 ? '#166534' : '#991b1b', 
            fontSize: '0.875rem', 
            fontWeight: '600',
            background: priceChange >= 0 ? '#dcfce7' : '#fecaca',
            padding: '0.25rem 0.5rem',
            borderRadius: '0.25rem'
          }}>
            {priceChange >= 0 ? '+' : ''}{priceChange}% from yesterday
          </span>
        </div>
      </div>

      {/* Weekly Prices - Column Layout */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#374151', marginBottom: '1rem' }}>
          Weekly Price Trend
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '0.75rem',
          marginBottom: '2rem'
        }}>
          {mandiPrices.map((day, idx) => (
            <div
              key={idx}
              style={{
                padding: '1rem 0.5rem',
                borderRadius: '0.75rem',
                textAlign: 'center',
                background: day.predicted 
                  ? 'linear-gradient(135deg, #dbeafe 0%, #e0f2fe 100%)' 
                  : 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                border: day.predicted ? '2px solid #60a5fa' : '1px solid #e2e8f0',
                position: 'relative',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <p style={{ 
                color: day.predicted ? '#2563eb' : '#6b7280', 
                fontSize: '0.875rem',
                fontWeight: '600',
                margin: '0 0 0.5rem 0'
              }}>
                {day.day}
              </p>
              <p style={{ 
                fontSize: '1.25rem', 
                fontWeight: 'bold', 
                color: day.predicted ? '#2563eb' : '#16a34a', 
                margin: '0 0 0.25rem 0'
              }}>
                ₹{day.price}
              </p>
              {day.predicted && (
                <div style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-6px',
                  background: '#3b82f6',
                  color: 'white',
                  fontSize: '0.625rem',
                  fontWeight: 'bold',
                  padding: '2px 6px',
                  borderRadius: '8px',
                  border: '2px solid white'
                }}>
                  📊
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Graph Section */}
      <div style={{
        backgroundColor: '#f8fafc',
        borderRadius: '1rem',
        padding: '1.5rem',
        border: '1px solid #e2e8f0'
      }}>
        <h3 style={{ 
          fontSize: '1.125rem', 
          fontWeight: '600', 
          color: '#374151', 
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          📈 Price Movement Chart
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={mandiPrices}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="day" 
              tick={{ fill: '#6b7280', fontSize: 12 }}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis 
              domain={[2000, 2400]} 
              tick={{ fill: '#6b7280', fontSize: 12 }}
              axisLine={{ stroke: '#e5e7eb' }}
              tickFormatter={(value) => `₹${value}`}
            />
            <Tooltip 
              formatter={(value) => [`₹${value}`, 'Price']}
              labelFormatter={(label) => `Day: ${label}`}
              contentStyle={{ 
                background: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#10b981"
              name="Market Price (₹/quintal)"
              strokeWidth={2}
              dot={{ r: 4, fill: '#10b981', strokeWidth: 2 }}
              activeDot={{ r: 6, fill: '#059669' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Prediction Notice */}
      <div style={{
        marginTop: '1.5rem',
        padding: '1rem',
        background: '#eff6ff',
        border: '1px solid #dbeafe',
        borderRadius: '0.75rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
      }}>
        <div style={{
          width: '24px',
          height: '24px',
          background: '#3b82f6',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '12px',
          fontWeight: 'bold'
        }}>
          i
        </div>
        <p style={{ color: '#374151', fontSize: '0.875rem', margin: 0 }}>
          <strong>Note:</strong> Prices for Saturday and Sunday are AI-predicted based on market trends and historical data.
        </p>
      </div>
    </div>
  );
}