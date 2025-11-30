// src/postharvest/Aggregator.jsx
import React, { useState, useEffect } from 'react';
import { Plus, Truck, Users, DollarSign, Check, Package } from 'lucide-react';
import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:5000/api/aggregator',
  timeout: 10000,
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default function Aggregator() {
  const [activeTab, setActiveTab] = useState('farmer');
  const [farmers, setFarmers] = useState([]);
  const [listings, setListings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [collection, setCollection] = useState({});
  const [loading, setLoading] = useState(false);
  
  const [farmerForm, setFarmerForm] = useState({ 
    name: '', 
    phone: '', 
    crop: '', 
    quantity: '', 
    price: '' 
  });
  
  const [buyerForm, setBuyerForm] = useState({ 
    crop: '', 
    quantity: '' 
  });

  // Load initial data
  useEffect(() => {
    fetchFarmers();
    fetchListings();
    fetchOrders();
  }, []);

  // Debug data
  useEffect(() => {
    console.log('📊 Farmers data:', farmers);
    console.log('📊 Listings data:', listings);
    console.log('📊 Orders data:', orders);
  }, [farmers, listings, orders]);

  // API Functions
  const fetchFarmers = async () => {
    try {
      const response = await api.get('/farmers');
      setFarmers(response.data);
    } catch (error) {
      console.error('Error fetching farmers:', error);
      alert('Failed to load farmers');
    }
  };

  const fetchListings = async () => {
    try {
      const response = await api.get('/listings');
      setListings(response.data);
    } catch (error) {
      console.error('Error fetching listings:', error);
      alert('Failed to load listings');
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      alert('Failed to load orders');
    }
  };

  // Add Farmer Listing
  const addFarmerListing = async () => {
    if (!farmerForm.name || !farmerForm.phone || !farmerForm.crop || !farmerForm.quantity || !farmerForm.price) {
      alert('Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      const listingData = {
        name: farmerForm.name,
        phone: farmerForm.phone,
        crop: farmerForm.crop,
        quantity: parseFloat(farmerForm.quantity),
        price: parseFloat(farmerForm.price)
      };

      const response = await api.post('/listings', listingData);
      
      // Update local state with new data from backend
      setFarmers(prev => [...prev, response.data.farmer]);
      setListings(prev => [...prev, response.data.listing]);
      setFarmerForm({ name: '', phone: '', crop: '', quantity: '', price: '' });
      
      alert('Listing added successfully!');
    } catch (error) {
      console.error('Error adding listing:', error);
      alert('Failed to add listing');
    } finally {
      setLoading(false);
    }
  };

  // Calculate total available for a crop
  const getTotalAvailable = (crop) => {
    return listings
      .filter(l => l.crop === crop && l.status === 'listed')
      .reduce((sum, l) => sum + l.quantity, 0);
  };

  const availableCrops = [...new Set(listings.filter(l => l.status === 'listed').map(l => l.crop))];

  // Create Order
  const createOrder = async () => {
    if (!buyerForm.crop || !buyerForm.quantity) {
      alert('Please select crop and quantity');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        crop: buyerForm.crop,
        quantity: parseFloat(buyerForm.quantity)
      };

      const response = await api.post('/orders', orderData);
      
      // Update local state with proper field names
      setListings(response.data.updatedListings);
      setOrders(prev => [...prev, { 
        ...response.data.order,
        _id: response.data.order._id
      }]);
      setBuyerForm({ crop: '', quantity: '' });
      
      alert(`Order created successfully! ${orderData.quantity} kg of ${orderData.crop} for ₹${response.data.order.total_amount}`);
    } catch (error) {
      console.error('Error creating order:', error);
      if (error.response?.data?.error) {
        alert(error.response.data.error);
      } else {
        alert('Failed to create order');
      }
    } finally {
      setLoading(false);
    }
  };

  // Complete Order - FIXED
  const completeOrder = async (orderId) => {
    console.log('Completing order:', orderId);
    
    if (!orderId || orderId === 'undefined') {
      alert('Invalid order ID');
      return;
    }

    setLoading(true);
    try {
      const response = await api.put(`/orders/${orderId}`, { 
        status: 'completed' 
      });
      
      console.log('Order completion response:', response.data);
      
      // Update local state
      setOrders(prev => prev.map(order => 
        order._id === orderId ? { ...order, status: 'completed' } : order
      ));
      
      alert('Order marked as completed!');
    } catch (error) {
      console.error('Error completing order:', error);
      console.error('Error details:', error.response?.data);
      
      if (error.response?.data?.error) {
        alert(`Error: ${error.response.data.error}`);
      } else {
        alert('Failed to complete order. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // FIXED Payment Calculation
  const calculatePayment = (orderId) => {
    const order = orders.find(o => o._id === orderId);
    if (!order) return null;

    const relevantListings = listings.filter(l => l.crop === order.crop);
    const payments = {};
    let totalCalculated = 0;

    // Calculate payment for each farmer based on their contribution to THIS order
    relevantListings.forEach(listing => {
      const soldQty = listing.soldInThisOrder || 0;
      
      if (soldQty > 0) {
        const farmerShare = (soldQty / order.total_quantity) * order.total_amount;
        payments[listing.farmer_name] = farmerShare;
        totalCalculated += farmerShare;
      }
    });

    // Handle any rounding differences
    const difference = order.total_amount - totalCalculated;
    if (Math.abs(difference) > 0.01 && Object.keys(payments).length > 0) {
      const firstFarmer = Object.keys(payments)[0];
      payments[firstFarmer] = (payments[firstFarmer] || 0) + difference;
    }

    return payments;
  };

  // Log Collection - FIXED
  const logCollection = async (farmerId, actualQty) => {
    const farmer = farmers.find(f => f._id === farmerId);
    if (!farmer) return;

    const actualQtyNum = parseFloat(actualQty);
    if (isNaN(actualQtyNum) || actualQtyNum <= 0) {
      alert('Please enter a valid quantity');
      return;
    }

    setLoading(true);
    try {
      await api.post('/collection', {
        farmerId: farmerId,
        quantity: actualQtyNum
      });
      
      // Update local state
      setCollection(prev => ({
        ...prev,
        [farmerId]: {
          quantity: actualQtyNum,
          farmerName: farmer.name,
          timestamp: new Date().toLocaleString()
        }
      }));
      
      alert(`Collection logged: ${actualQtyNum} kg from ${farmer.name}`);
    } catch (error) {
      console.error('Error logging collection:', error);
      alert('Failed to log collection');
    } finally {
      setLoading(false);
    }
  };

  // Get farmer's listed quantity - FIXED
  const getFarmerListedQuantity = (farmerId) => {
    const farmerListings = listings.filter(l => l.farmer_id === farmerId && l.status === 'listed');
    return farmerListings.reduce((sum, l) => sum + l.quantity, 0);
  };

  return (
    <div style={{ 
      fontFamily: 'Arial, sans-serif', 
      backgroundColor: '#f8f9fa', 
      minHeight: '100vh', 
      padding: '20px' 
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ 
          backgroundColor: '#2d5016', 
          color: 'white', 
          padding: '25px', 
          borderRadius: '12px', 
          marginBottom: '30px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{ margin: '0', fontSize: '32px', fontWeight: 'bold' }}>🌾 Farm Aggregator</h1>
          <p style={{ margin: '8px 0 0 0', opacity: '0.9', fontSize: '16px' }}>
            Simple & Efficient Farmer-Buyer Platform
          </p>
          {loading && (
            <div style={{ marginTop: '10px', color: '#ffeb3b' }}>
              ⏳ Processing...
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <div style={{ 
          display: 'flex', 
          gap: '8px', 
          marginBottom: '30px', 
          borderBottom: '2px solid #e0e0e0', 
          paddingBottom: '0',
          flexWrap: 'wrap'
        }}>
          {[
            { id: 'farmer', label: '👨‍🌾 Farmer Listings', icon: Plus },
            { id: 'buyer', label: '🛒 Buyer Orders', icon: Truck },
            { id: 'collection', label: '📦 Collection', icon: Users },
            { id: 'payment', label: '💰 Payment', icon: DollarSign }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '14px 24px',
                border: 'none',
                backgroundColor: activeTab === tab.id ? '#2d5016' : 'transparent',
                color: activeTab === tab.id ? 'white' : '#666',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                borderRadius: '8px 8px 0 0',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: Farmer Listings */}
        {activeTab === 'farmer' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
            {/* Farmer Entry Form */}
            <div style={{ 
              backgroundColor: 'white', 
              padding: '25px', 
              borderRadius: '12px', 
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              border: '1px solid #e0e0e0'
            }}>
              <h2 style={{ 
                fontSize: '20px', 
                marginTop: '0', 
                color: '#2d5016',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <Plus size={20} />
                Add Farmer Listing
              </h2>
              
              {[
                { label: 'Farmer Name', key: 'name', placeholder: 'Enter farmer name' },
                { label: 'Phone Number', key: 'phone', placeholder: 'Enter phone number' },
                { label: 'Crop Type', key: 'crop', placeholder: 'e.g., Maize, Wheat, Rice' },
                { label: 'Quantity (kg)', key: 'quantity', placeholder: 'Enter quantity in kg', type: 'number' },
                { label: 'Price (₹/kg)', key: 'price', placeholder: 'Enter price per kg', type: 'number' }
              ].map(field => (
                <div key={field.key} style={{ marginBottom: '20px' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontWeight: 'bold', 
                    color: '#333',
                    fontSize: '14px'
                  }}>
                    {field.label}
                  </label>
                  <input
                    type={field.type || 'text'}
                    value={farmerForm[field.key]}
                    onChange={(e) => setFarmerForm({ ...farmerForm, [field.key]: e.target.value })}
                    placeholder={field.placeholder}
                    style={{ 
                      width: '100%', 
                      padding: '12px', 
                      border: '1px solid #ddd', 
                      borderRadius: '6px', 
                      boxSizing: 'border-box',
                      fontSize: '14px',
                      transition: 'border-color 0.3s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#2d5016'}
                    onBlur={(e) => e.target.style.borderColor = '#ddd'}
                  />
                </div>
              ))}
              
              <button
                onClick={addFarmerListing}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '14px',
                  backgroundColor: loading ? '#ccc' : '#2d5016',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  transition: 'background-color 0.3s'
                }}
                onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#3a661e')}
                onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = '#2d5016')}
              >
                {loading ? 'Adding...' : '+ Add Listing'}
              </button>
            </div>

            {/* Available Stock */}
            <div style={{ 
              backgroundColor: 'white', 
              padding: '25px', 
              borderRadius: '12px', 
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              border: '1px solid #e0e0e0'
            }}>
              <h2 style={{ 
                fontSize: '20px', 
                marginTop: '0', 
                color: '#2d5016',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <Package size={20} />
                Available Stock
              </h2>
              
              {availableCrops.length === 0 ? (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '40px', 
                  color: '#999',
                  backgroundColor: '#f9f9f9',
                  borderRadius: '8px',
                  border: '2px dashed #ddd'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '10px' }}>🌾</div>
                  <p style={{ margin: '0', fontSize: '16px' }}>No listings yet</p>
                  <p style={{ margin: '5px 0 0 0', fontSize: '14px' }}>Add farmer listings to see available stock</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {availableCrops.map(crop => {
                    const cropListings = listings.filter(l => l.crop === crop && l.status === 'listed');
                    const totalQty = getTotalAvailable(crop);
                    const price = cropListings[0]?.price;
                    
                    return (
                      <div key={crop} style={{ 
                        padding: '20px', 
                        backgroundColor: '#f8f9fa', 
                        borderRadius: '8px', 
                        border: '1px solid #e0e0e0',
                        transition: 'transform 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                      >
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'flex-start',
                          marginBottom: '10px'
                        }}>
                          <div>
                            <div style={{ 
                              fontWeight: 'bold', 
                              color: '#2d5016', 
                              fontSize: '18px',
                              marginBottom: '5px'
                            }}>
                              {crop}
                            </div>
                            <div style={{ fontSize: '14px', color: '#666' }}>
                              {cropListings.length} farmer{cropListings.length > 1 ? 's' : ''} listed
                            </div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ 
                              fontSize: '28px', 
                              fontWeight: 'bold', 
                              color: '#333' 
                            }}>
                              {totalQty} kg
                            </div>
                            <div style={{ 
                              fontSize: '14px', 
                              color: '#666', 
                              marginTop: '5px' 
                            }}>
                              ₹{price}/kg
                            </div>
                          </div>
                        </div>
                        
                        {/* Farmer breakdown */}
                        <div style={{ 
                          marginTop: '15px', 
                          paddingTop: '15px', 
                          borderTop: '1px solid #e0e0e0' 
                        }}>
                          <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#666', marginBottom: '8px' }}>
                            Farmers:
                          </div>
                          {cropListings.map(listing => (
                            <div key={listing._id} style={{ 
                              display: 'flex', 
                              justifyContent: 'space-between',
                              fontSize: '12px',
                              padding: '4px 0'
                            }}>
                              <span>{listing.farmer_name}</span>
                              <span>{listing.quantity} kg</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: Buyer Orders */}
        {activeTab === 'buyer' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
            {/* Order Form */}
            <div style={{ 
              backgroundColor: 'white', 
              padding: '25px', 
              borderRadius: '12px', 
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              border: '1px solid #e0e0e0'
            }}>
              <h2 style={{ 
                fontSize: '20px', 
                marginTop: '0', 
                color: '#2d5016',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <Truck size={20} />
                Create New Order
              </h2>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: 'bold', 
                  color: '#333',
                  fontSize: '14px'
                }}>
                  Select Crop
                </label>
                <select
                  value={buyerForm.crop}
                  onChange={(e) => setBuyerForm({ ...buyerForm, crop: e.target.value })}
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    border: '1px solid #ddd', 
                    borderRadius: '6px', 
                    boxSizing: 'border-box',
                    fontSize: '14px'
                  }}
                >
                  <option value="">Choose crop...</option>
                  {availableCrops.map(crop => (
                    <option key={crop} value={crop}>
                      {crop} ({getTotalAvailable(crop)} kg available)
                    </option>
                  ))}
                </select>
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: 'bold', 
                  color: '#333',
                  fontSize: '14px'
                }}>
                  Quantity (kg)
                </label>
                <input
                  type="number"
                  value={buyerForm.quantity}
                  onChange={(e) => setBuyerForm({ ...buyerForm, quantity: e.target.value })}
                  placeholder="Enter quantity in kg"
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    border: '1px solid #ddd', 
                    borderRadius: '6px', 
                    boxSizing: 'border-box',
                    fontSize: '14px'
                  }}
                />
              </div>
              
              {buyerForm.crop && buyerForm.quantity && (
                <div style={{ 
                  padding: '20px', 
                  backgroundColor: '#e8f5e9', 
                  borderRadius: '8px', 
                  marginBottom: '20px',
                  border: '1px solid #4caf50'
                }}>
                  <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>Order Summary</div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#2d5016' }}>
                    ₹{(parseFloat(buyerForm.quantity) * (listings.find(l => l.crop === buyerForm.crop && l.status === 'listed')?.price || 0)).toFixed(0)}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                    {buyerForm.quantity} kg × ₹{listings.find(l => l.crop === buyerForm.crop && l.status === 'listed')?.price}/kg
                  </div>
                </div>
              )}
              
              <button
                onClick={createOrder}
                disabled={!buyerForm.crop || !buyerForm.quantity || loading}
                style={{
                  width: '100%',
                  padding: '14px',
                  backgroundColor: (buyerForm.crop && buyerForm.quantity && !loading) ? '#2d5016' : '#ccc',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: (buyerForm.crop && buyerForm.quantity && !loading) ? 'pointer' : 'not-allowed',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  transition: 'background-color 0.3s'
                }}
              >
                {loading ? 'Creating...' : '✓ Confirm Order'}
              </button>
            </div>

            {/* Orders List */}
            <div style={{ 
              backgroundColor: 'white', 
              padding: '25px', 
              borderRadius: '12px', 
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              border: '1px solid #e0e0e0'
            }}>
              <h2 style={{ 
                fontSize: '20px', 
                marginTop: '0', 
                color: '#2d5016',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <Package size={20} />
                Active Orders ({orders.length})
              </h2>
              
              {orders.length === 0 ? (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '40px', 
                  color: '#999',
                  backgroundColor: '#f9f9f9',
                  borderRadius: '8px',
                  border: '2px dashed #ddd'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '10px' }}>📦</div>
                  <p style={{ margin: '0', fontSize: '16px' }}>No orders yet</p>
                  <p style={{ margin: '5px 0 0 0', fontSize: '14px' }}>Create your first order to get started</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {orders.map(order => (
                    <div key={order._id} style={{ 
                      padding: '20px', 
                      backgroundColor: order.status === 'completed' ? '#e8f5e9' : '#fff3e0', 
                      borderRadius: '8px', 
                      border: `2px solid ${order.status === 'completed' ? '#4caf50' : '#ff9800'}`,
                      transition: 'transform 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'flex-start',
                        marginBottom: '10px'
                      }}>
                        <div>
                          <div style={{ 
                            fontWeight: 'bold', 
                            fontSize: '18px',
                            color: '#2d5016',
                            marginBottom: '5px'
                          }}>
                            {order.crop}
                          </div>
                          <div style={{ fontSize: '12px', color: '#666' }}>
                            {new Date(order.createdAt).toLocaleString()}
                          </div>
                        </div>
                        <div style={{ 
                          padding: '6px 12px', 
                          backgroundColor: order.status === 'completed' ? '#4caf50' : '#ff9800',
                          color: 'white',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}>
                          {order.status === 'completed' ? '✓ Completed' : '⏳ Pending'}
                        </div>
                      </div>
                      
                      <div style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>
                        {order.total_quantity} kg × ₹{order.price}/kg = 
                        <span style={{ fontWeight: 'bold', color: '#333', marginLeft: '5px' }}>
                          ₹{order.total_amount}
                        </span>
                      </div>
                      
                      {order.status === 'pending' && (
                        <button
                          onClick={() => completeOrder(order._id)}
                          disabled={loading}
                          style={{
                            width: '100%',
                            padding: '10px',
                            backgroundColor: loading ? '#ccc' : '#2d5016',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            transition: 'background-color 0.3s'
                          }}
                          onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#3a661e')}
                          onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = '#2d5016')}
                        >
                          {loading ? 'Processing...' : 'Mark as Completed'}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: Collection */}
        {activeTab === 'collection' && (
          <div style={{ 
            backgroundColor: 'white', 
            padding: '25px', 
            borderRadius: '12px', 
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            border: '1px solid #e0e0e0'
          }}>
            <h2 style={{ 
              fontSize: '20px', 
              marginTop: '0', 
              color: '#2d5016',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '25px'
            }}>
              <Users size={20} />
              Collection Center (8:00 AM - 10:00 AM)
            </h2>
            
            {farmers.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '40px', 
                color: '#999',
                backgroundColor: '#f9f9f9',
                borderRadius: '8px',
                border: '2px dashed #ddd'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '10px' }}>👨‍🌾</div>
                <p style={{ margin: '0', fontSize: '16px' }}>No farmers registered yet</p>
                <p style={{ margin: '5px 0 0 0', fontSize: '14px' }}>Add farmer listings to enable collection tracking</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                {farmers.map(farmer => {
                  const listedQty = getFarmerListedQuantity(farmer._id);
                  const collectedData = collection[farmer._id];
                  
                  return (
                    <div key={farmer._id} style={{ 
                      padding: '20px', 
                      backgroundColor: '#f8f9fa', 
                      borderRadius: '8px', 
                      border: '1px solid #e0e0e0',
                      transition: 'transform 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      <div style={{ 
                        fontWeight: 'bold', 
                        fontSize: '16px',
                        color: '#2d5016',
                        marginBottom: '10px'
                      }}>
                        {farmer.name}
                      </div>
                      
                      <div style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>
                        <div>📞 {farmer.phone}</div>
                        <div>📦 Listed: {listedQty} kg</div>
                        {collectedData && (
                          <div style={{ color: '#4caf50', fontWeight: 'bold', marginTop: '5px' }}>
                            ✓ Collected: {collectedData.quantity} kg
                          </div>
                        )}
                      </div>
                      
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <input
                          type="number"
                          placeholder="Actual kg collected"
                          style={{
                            flex: '1',
                            padding: '10px',
                            border: '1px solid #ddd',
                            borderRadius: '6px',
                            fontSize: '14px'
                          }}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              logCollection(farmer._id, e.target.value);
                              e.target.value = '';
                            }
                          }}
                        />
                        <button
                          onClick={(e) => {
                            const input = e.target.previousSibling;
                            logCollection(farmer._id, input.value);
                            input.value = '';
                          }}
                          disabled={loading}
                          style={{
                            padding: '10px 16px',
                            backgroundColor: loading ? '#ccc' : '#4caf50',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {loading ? '...' : '✓ Log'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: Payment - FIXED CALCULATION */}
        {activeTab === 'payment' && (
          <div style={{ 
            backgroundColor: 'white', 
            padding: '25px', 
            borderRadius: '12px', 
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            border: '1px solid #e0e0e0'
          }}>
            <h2 style={{ 
              fontSize: '20px', 
              marginTop: '0', 
              color: '#2d5016',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '25px'
            }}>
              <DollarSign size={20} />
              Payment Distribution
            </h2>
            
            {orders.filter(order => order.status === 'completed').length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '40px', 
                color: '#999',
                backgroundColor: '#f9f9f9',
                borderRadius: '8px',
                border: '2px dashed #ddd'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '10px' }}>💰</div>
                <p style={{ margin: '0', fontSize: '16px' }}>No completed orders</p>
                <p style={{ margin: '5px 0 0 0', fontSize: '14px' }}>Complete orders to see payment distributions</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '25px' }}>
                {orders.filter(order => order.status === 'completed').map(order => {
                  const payments = calculatePayment(order._id);
                  const totalDistributed = Object.values(payments || {}).reduce((sum, amt) => sum + amt, 0);
                  
                  return (
                    <div key={order._id} style={{ 
                      padding: '25px', 
                      backgroundColor: '#f8f9fa', 
                      borderRadius: '8px', 
                      border: '2px solid #e0e0e0',
                      transition: 'transform 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      <div style={{ 
                        fontWeight: 'bold', 
                        fontSize: '18px',
                        color: '#2d5016',
                        marginBottom: '5px'
                      }}>
                        Order: {order.crop}
                      </div>
                      <div style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
                        {order.total_quantity} kg × ₹{order.price}/kg = ₹{order.total_amount}
                      </div>
                      
                      <div style={{ 
                        paddingTop: '15px', 
                        borderTop: '2px solid #e0e0e0' 
                      }}>
                        <div style={{ 
                          fontSize: '16px', 
                          fontWeight: 'bold', 
                          color: '#333', 
                          marginBottom: '15px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}>
                          <Users size={16} />
                          Farmer Payments:
                        </div>
                        
                        {Object.entries(payments || {}).map(([farmer, amount]) => (
                          <div key={`${order._id}-${farmer}`} style={{ 
                            padding: '12px', 
                            backgroundColor: 'white', 
                            marginBottom: '10px', 
                            borderRadius: '6px', 
                            border: '1px solid #e0e0e0', 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            transition: 'background-color 0.2s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div style={{ 
                                width: '8px', 
                                height: '8px', 
                                backgroundColor: '#4caf50', 
                                borderRadius: '50%' 
                              }}></div>
                              <span style={{ fontSize: '14px', fontWeight: '500' }}>{farmer}</span>
                            </div>
                            <span style={{ 
                              fontWeight: 'bold', 
                              color: '#2d5016', 
                              fontSize: '16px' 
                            }}>
                              ₹{amount.toFixed(0)}
                            </span>
                          </div>
                        ))}
                        
                        {/* Total Verification */}
                        <div style={{ 
                          marginTop: '20px', 
                          padding: '15px', 
                          backgroundColor: '#2d5016', 
                          color: 'white', 
                          borderRadius: '8px', 
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Total Distributed:</span>
                          <span style={{ fontWeight: 'bold', fontSize: '18px' }}>
                            ₹{totalDistributed.toFixed(0)}
                          </span>
                        </div>
                        
                        <div style={{ 
                          marginTop: '15px', 
                          padding: '12px', 
                          backgroundColor: '#e8f5e9', 
                          color: '#2d5016',
                          borderRadius: '6px', 
                          textAlign: 'center',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          border: '1px solid #4caf50'
                        }}>
                          ✅ Send UPI payments to farmers
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}