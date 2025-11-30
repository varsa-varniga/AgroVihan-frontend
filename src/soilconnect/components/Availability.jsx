import React, { useState, useEffect } from 'react';
import { Calendar, Clock } from 'lucide-react';
import axios from 'axios';

const AvailabilityView = () => {
  const [selectedDate, setSelectedDate] = useState('2025-11-15');
  const [availability, setAvailability] = useState({});
  const [userId, setUserId] = useState('user123');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Load availability data
  useEffect(() => {
    loadAvailability();
  }, [userId]);

  const loadAvailability = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/availability/${userId}`);
      
      if (response.data.success) {
        setAvailability(response.data.data);
        setMessage('Availability loaded successfully!');
      }
    } catch (error) {
      console.error('Error loading availability:', error);
      if (error.response?.status === 404) {
        setMessage('No availability data found');
        setAvailability({});
      } else {
        setMessage('Error loading availability data');
      }
    } finally {
      setLoading(false);
    }
  };

  const currentDateInfo = availability[selectedDate] || { 
    available: false, 
    morning: false, 
    afternoon: false,
    evening: false 
  };

  const updateAvailability = async () => {
    try {
      setLoading(true);
      
      const response = await axios.put(`http://localhost:5000/api/availability/${userId}`, {
        date: selectedDate,
        available: currentDateInfo.available,
        timeSlots: {
          morning: currentDateInfo.morning,
          afternoon: currentDateInfo.afternoon,
          evening: currentDateInfo.evening
        }
      });

      if (response.data.success) {
        setMessage('Availability updated successfully!');
        // Refresh data
        await loadAvailability();
      }
    } catch (error) {
      console.error('Error updating availability:', error);
      setMessage('Error updating availability');
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailable = (checked) => {
    setAvailability(prev => ({
      ...prev,
      [selectedDate]: {
        ...prev[selectedDate],
        available: checked,
        morning: checked,
        afternoon: checked,
        evening: checked
      }
    }));
  };

  const toggleTimeSlot = (slot, checked) => {
    setAvailability(prev => {
      const updated = {
        ...prev,
        [selectedDate]: {
          ...prev[selectedDate],
          [slot]: checked
        }
      };
      updated[selectedDate].available = updated[selectedDate].morning || updated[selectedDate].afternoon || updated[selectedDate].evening;
      return updated;
    });
  };

  const markNext7Days = async () => {
    try {
      setLoading(true);
      const availabilityData = [];
      const startDay = 15;
      
      for (let i = 0; i < 7; i++) {
        const day = startDay + i;
        if (day <= 30) {
          const dateKey = `2025-11-${String(day).padStart(2, '0')}`;
          availabilityData.push({
            date: dateKey,
            available: true,
            timeSlots: {
              morning: true,
              afternoon: true,
              evening: true
            }
          });
        }
      }

      const response = await axios.post(`http://localhost:5000/api/availability/${userId}/bulk`, {
        availabilityData
      });

      if (response.data.success) {
        setMessage('Next 7 days marked as available!');
        await loadAvailability();
      }
    } catch (error) {
      console.error('Error bulk updating:', error);
      setMessage('Error marking next 7 days');
    } finally {
      setLoading(false);
    }
  };

  const blockWeekend = async () => {
    try {
      setLoading(true);
      const weekendDates = ['2025-11-15', '2025-11-16', '2025-11-22', '2025-11-23', '2025-11-29', '2025-11-30'];
      const availabilityData = weekendDates.map(date => ({
        date,
        available: false,
        timeSlots: {
          morning: false,
          afternoon: false,
          evening: false
        }
      }));

      const response = await axios.post(`http://localhost:5000/api/availability/${userId}/bulk`, {
        availabilityData
      });

      if (response.data.success) {
        setMessage('Weekends blocked successfully!');
        await loadAvailability();
      }
    } catch (error) {
      console.error('Error blocking weekends:', error);
      setMessage('Error blocking weekends');
    } finally {
      setLoading(false);
    }
  };

  const generateCalendar = () => {
    const days = [];
    const startOffset = 6;
    
    for (let i = 0; i < startOffset; i++) {
      days.push(<div key={`empty-${i}`} style={{ aspectRatio: '1' }} />);
    }
    
    for (let i = 1; i <= 30; i++) {
      const dateKey = `2025-11-${String(i).padStart(2, '0')}`;
      const isAvailable = availability[dateKey]?.available;
      const isSelected = dateKey === selectedDate;
      
      let btnStyle = {
        aspectRatio: '1',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '14px',
        fontWeight: '500',
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.2s'
      };

      if (isSelected) {
        btnStyle = { ...btnStyle, backgroundColor: '#2563eb', color: 'white' };
      } else if (isAvailable) {
        btnStyle = { ...btnStyle, backgroundColor: '#dcfce7', color: '#166534', border: '1px solid #86efac' };
      } else if (isAvailable === false) {
        btnStyle = { ...btnStyle, backgroundColor: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5' };
      } else {
        btnStyle = { ...btnStyle, backgroundColor: 'white', color: '#6b7280', border: '1px solid #e5e7eb' };
      }
      
      days.push(
        <button
          key={i}
          onClick={() => setSelectedDate(dateKey)}
          style={btnStyle}
          onMouseEnter={(e) => {
            if (!isSelected) {
              if (isAvailable) e.target.style.backgroundColor = '#bbf7d0';
              else if (isAvailable === false) e.target.style.backgroundColor = '#fecaca';
              else e.target.style.backgroundColor = '#f3f4f6';
            }
          }}
          onMouseLeave={(e) => {
            if (!isSelected) {
              if (isAvailable) e.target.style.backgroundColor = '#dcfce7';
              else if (isAvailable === false) e.target.style.backgroundColor = '#fee2e2';
              else e.target.style.backgroundColor = 'white';
            }
          }}
        >
          {i}
        </button>
      );
    }
    
    return days;
  };

  if (loading) {
    return (
      <div style={{ padding: '24px 0' }}>
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '12px', 
          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', 
          padding: '24px',
          textAlign: 'center'
        }}>
          <p>Loading availability data...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px 0' }}>
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '12px', 
        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', 
        padding: '24px' 
      }}>
        <h1 style={{ 
          fontSize: '24px', 
          fontWeight: 'bold', 
          color: '#111827', 
          marginBottom: '24px', 
          display: 'flex', 
          alignItems: 'center' 
        }}>
          <Calendar style={{ width: '28px', height: '28px', marginRight: '12px', color: '#2563eb' }} />
          Availability Calendar
        </h1>

        {/* User ID Input */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>User ID:</label>
          <input 
            type="text" 
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            style={{ 
              padding: '8px 12px', 
              border: '1px solid #d1d5db', 
              borderRadius: '6px',
              width: '200px'
            }}
            placeholder="Enter user ID"
          />
        </div>

        {/* Message Display */}
        {message && (
          <div style={{ 
            padding: '12px', 
            backgroundColor: message.includes('Error') ? '#fef2f2' : '#f0fdf4',
            color: message.includes('Error') ? '#dc2626' : '#16a34a',
            borderRadius: '8px',
            marginBottom: '16px',
            border: `1px solid ${message.includes('Error') ? '#fecaca' : '#bbf7d0'}`
          }}>
            {message}
          </div>
        )}
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr', 
          gap: '24px' 
        }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '24px' 
          }}>
            {/* Calendar */}
            <div style={{ gridColumn: 'span 2' }}>
              <div style={{ 
                backgroundColor: '#f9fafb', 
                borderRadius: '8px', 
                padding: '16px' 
              }}>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(7, 1fr)', 
                  gap: '8px', 
                  marginBottom: '16px' 
                }}>
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} style={{ 
                      textAlign: 'center', 
                      fontSize: '14px', 
                      fontWeight: '600', 
                      color: '#4b5563', 
                      padding: '8px' 
                    }}>
                      {day}
                    </div>
                  ))}
                </div>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(7, 1fr)', 
                  gap: '8px' 
                }}>
                  {generateCalendar()}
                </div>
              </div>
              
              <div style={{ 
                marginTop: '16px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '24px',
                flexWrap: 'wrap'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ 
                    width: '16px', 
                    height: '16px', 
                    backgroundColor: '#dcfce7', 
                    borderRadius: '4px', 
                    border: '1px solid #86efac' 
                  }}></div>
                  <span style={{ fontSize: '14px', color: '#4b5563' }}>Available</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ 
                    width: '16px', 
                    height: '16px', 
                    backgroundColor: '#fee2e2', 
                    borderRadius: '4px', 
                    border: '1px solid #fca5a5' 
                  }}></div>
                  <span style={{ fontSize: '14px', color: '#4b5563' }}>Not Available</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ 
                    width: '16px', 
                    height: '16px', 
                    backgroundColor: '#2563eb', 
                    borderRadius: '4px' 
                  }}></div>
                  <span style={{ fontSize: '14px', color: '#4b5563' }}>Selected</span>
                </div>
              </div>
            </div>
            
            {/* Time Slot Manager */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ 
                backgroundColor: '#eff6ff', 
                borderRadius: '8px', 
                padding: '16px', 
                border: '1px solid #bfdbfe' 
              }}>
                <h3 style={{ fontWeight: 'bold', color: '#111827', marginBottom: '12px' }}>
                  {selectedDate}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <label style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px', 
                    cursor: 'pointer' 
                  }}>
                    <input 
                      type="checkbox" 
                      checked={currentDateInfo.available}
                      onChange={(e) => toggleAvailable(e.target.checked)}
                      style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '14px', color: '#374151' }}>Available this day</span>
                  </label>
                  
                  <div style={{ 
                    paddingTop: '12px', 
                    borderTop: '1px solid #bfdbfe' 
                  }}>
                    <p style={{ 
                      fontSize: '14px', 
                      fontWeight: '600', 
                      color: '#374151', 
                      marginBottom: '8px' 
                    }}>Time Slots:</p>
                    <label style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '12px', 
                      cursor: 'pointer', 
                      marginBottom: '8px' 
                    }}>
                      <input 
                        type="checkbox" 
                        checked={currentDateInfo.morning}
                        onChange={(e) => toggleTimeSlot('morning', e.target.checked)}
                        style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                      />
                      <Clock style={{ width: '16px', height: '16px', color: '#4b5563' }} />
                      <span style={{ fontSize: '14px', color: '#374151' }}>Morning (8 AM - 12 PM)</span>
                    </label>
                    <label style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '12px', 
                      cursor: 'pointer' 
                    }}>
                      <input 
                        type="checkbox" 
                        checked={currentDateInfo.afternoon}
                        onChange={(e) => toggleTimeSlot('afternoon', e.target.checked)}
                        style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                      />
                      <Clock style={{ width: '16px', height: '16px', color: '#4b5563' }} />
                      <span style={{ fontSize: '14px', color: '#374151' }}>Afternoon (1 PM - 5 PM)</span>
                    </label>
                  </div>
                  
                  <button 
                    onClick={updateAvailability}
                    disabled={loading}
                    style={{
                      width: '100%',
                      padding: '8px 16px',
                      backgroundColor: loading ? '#6b7280' : '#16a34a',
                      color: 'white',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      marginTop: '12px',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                    onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#15803d')}
                    onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = '#16a34a')}
                  >
                    {loading ? 'Updating...' : 'Update Availability'}
                  </button>
                </div>
              </div>
              
              <div style={{ 
                backgroundColor: '#f9fafb', 
                borderRadius: '8px', 
                padding: '16px' 
              }}>
                <h3 style={{ 
                  fontWeight: '600', 
                  color: '#111827', 
                  marginBottom: '8px', 
                  fontSize: '14px' 
                }}>Quick Actions</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button 
                    onClick={markNext7Days}
                    disabled={loading}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      backgroundColor: 'white',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                    onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#f9fafb')}
                    onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = 'white')}
                  >
                    {loading ? 'Processing...' : 'Mark Next 7 Days Available'}
                  </button>
                  <button 
                    onClick={blockWeekend}
                    disabled={loading}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      backgroundColor: 'white',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                    onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#f9fafb')}
                    onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = 'white')}
                  >
                    {loading ? 'Processing...' : 'Block Upcoming Weekend'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityView;