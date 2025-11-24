import React, { useState, useEffect } from "react";
import { User, MapPin, Sprout, DollarSign, Award, ChevronRight, Menu, X, BookOpen, Brain, Wallet, Home, Cpu, Users, ShoppingBag, Leaf, FileText, LogOut, Check, ArrowRight, AlertCircle } from "lucide-react";

// Hardcoded API URL - remove process.env completely
const API_BASE_URL = "http://localhost:5000/api";

// API helper functions using fetch
const api = {
  post: async (endpoint, data, options = {}) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: options.headers?.['Content-Type'] === 'multipart/form-data' ? data : JSON.stringify(data),
    });
    return response.json();
  },

  get: async (endpoint) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    return response.json();
  },

  put: async (endpoint, data) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },
};

const SprouterProfileSystem = () => {
  const [currentView, setCurrentView] = useState('profile');
  const [currentStep, setCurrentStep] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: '', 
    phone: '', 
    aadhaarLast4: '', 
    email: '',
    village: '', 
    district: '', 
    state: '', 
    pincode: '',
    landSize: '', 
    landType: '', 
    soilType: '',
    incomeRange: '', 
    aadhaarDoc: null, 
    landProof: null,
    experience: '', 
    mainCrops: ''
  });

  const steps = [
    { title: 'Personal Info', icon: User },
    { title: 'Address', icon: MapPin },
    { title: 'Land Details', icon: Sprout },
    { title: 'Income & Docs', icon: DollarSign },
    { title: 'Experience', icon: Award }
  ];

  const dashboardFeatures = [
    { icon: BookOpen, label: 'Learning Path', desc: 'Structured learning modules', color: '#3b82f6' },
    { icon: Brain, label: 'Farmer Readiness AI', desc: 'AI-powered assessment', color: '#a855f7' },
    { icon: Wallet, label: 'Financial Empower', desc: 'Financial tools & schemes', color: '#22c55e' },
    { icon: Home, label: 'Land Leasing Hub', desc: 'Find or lease land', color: '#f97316' },
    { icon: Cpu, label: 'Smart Farming', desc: 'IoT & precision farming', color: '#06b6d4' },
    { icon: Users, label: 'Crop Circle', desc: 'Connect with farmers', color: '#ec4899' },
    { icon: ShoppingBag, label: 'Farm Market', desc: 'Buy & sell products', color: '#14b8a6' },
    { icon: Leaf, label: 'Carbon Credit', desc: 'Earn from carbon credits', color: '#84cc16' },
    { icon: FileText, label: 'Posts', desc: 'Share knowledge', color: '#6366f1' }
  ];

  // Check if sprouter is already registered
  useEffect(() => {
    const sprouterData = localStorage.getItem('sprouterData');
    if (sprouterData) {
      setCurrentView('dashboard');
      const sprouter = JSON.parse(sprouterData);
      setProfileData(prev => ({ ...prev, fullName: sprouter.fullName }));
    }
  }, []);

  const validateStep = () => {
    const newErrors = {};
    
    if (currentStep === 0) {
      if (!profileData.fullName.trim()) newErrors.fullName = 'Full name is required';
      if (!profileData.phone.trim()) newErrors.phone = 'Phone number is required';
      else if (!/^\+?[\d\s-]{10,}$/.test(profileData.phone)) newErrors.phone = 'Invalid phone number';
      if (!profileData.aadhaarLast4.trim()) newErrors.aadhaarLast4 = 'Last 4 digits of Aadhaar required';
      else if (!/^\d{4}$/.test(profileData.aadhaarLast4)) newErrors.aadhaarLast4 = 'Must be exactly 4 digits';
      if (profileData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
        newErrors.email = 'Invalid email format';
      }
    }
    
    if (currentStep === 1) {
      if (!profileData.village.trim()) newErrors.village = 'Village/Town is required';
      if (!profileData.district.trim()) newErrors.district = 'District is required';
      if (!profileData.state.trim()) newErrors.state = 'State is required';
      if (!profileData.pincode.trim()) newErrors.pincode = 'Pincode is required';
      else if (!/^\d{6}$/.test(profileData.pincode)) newErrors.pincode = 'Must be 6 digits';
    }
    
    if (currentStep === 2) {
      if (!profileData.landSize) newErrors.landSize = 'Land size is required';
      else if (parseFloat(profileData.landSize) <= 0) newErrors.landSize = 'Land size must be greater than 0';
      if (!profileData.landType) newErrors.landType = 'Land type is required';
      if (!profileData.soilType) newErrors.soilType = 'Soil type is required';
    }
    
    if (currentStep === 3) {
      if (!profileData.incomeRange) newErrors.incomeRange = 'Income range is required';
    }
    
    if (currentStep === 4) {
      if (!profileData.experience) newErrors.experience = 'Experience level is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleFileUpload = async (field, event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, [field]: 'File size must be less than 5MB' }));
        return;
      }
      
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch(`${API_BASE_URL}/sprouters/upload`, {
          method: 'POST',
          body: formData,
        });
        
        const data = await response.json();
        
        if (data.success) {
          setProfileData(prev => ({ 
            ...prev, 
            [field]: data.fileUrl 
          }));
          
          if (errors[field]) {
            setErrors(prev => {
              const newErrors = { ...prev };
              delete newErrors[field];
              return newErrors;
            });
          }
          console.log(`${field} uploaded successfully:`, data.fileUrl);
        } else {
          throw new Error(data.message);
        }
      } catch (error) {
        console.error('File upload failed:', error);
        setErrors(prev => ({ 
          ...prev, 
          [field]: 'File upload failed. Please try again.' 
        }));
      } finally {
        setUploading(false);
      }
    }
  };

  const submitProfile = async () => {
    setLoading(true);
    try {
      const response = await api.post('/sprouters/profile', profileData);
      
      if (response.success) {
        // Store sprouter data in localStorage
        localStorage.setItem('sprouterData', JSON.stringify(response.sprouter));
        setCurrentView('dashboard');
        console.log('Sprouter registration successful:', response);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Sprouter registration failed:', error);
      alert(error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    if (!validateStep()) {
      return;
    }
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      await submitProfile();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('sprouterData');
    setCurrentView('profile');
    setCurrentStep(0);
    setProfileData({
      fullName: '', phone: '', aadhaarLast4: '', email: '',
      village: '', district: '', state: '', pincode: '',
      landSize: '', landType: '', soilType: '',
      incomeRange: '', aadhaarDoc: null, landProof: null,
      experience: '', mainCrops: ''
    });
  };

  // Dashboard View
  if (currentView === 'dashboard') {
    return (
      <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f9fafb', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        {/* Sidebar */}
        <div style={{
          width: sidebarOpen ? '320px' : '0',
          transition: 'width 0.3s',
          backgroundColor: 'white',
          borderRight: '1px solid #e5e7eb',
          overflow: 'hidden',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <div style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: 'linear-gradient(to bottom right, #4ade80, #16a34a)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Sprout size={24} color="white" />
                </div>
                <div>
                  <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>AgroVihan</h1>
                  <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>Sprouter Portal</p>
                </div>
              </div>
              <button 
                onClick={() => setSidebarOpen(false)}
                style={{
                  padding: '4px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  display: sidebarOpen ? 'block' : 'none'
                }}
              >
                <X size={16} color="#6b7280" />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {dashboardFeatures.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <button
                    key={idx}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '14px 16px',
                      borderRadius: '12px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#f3f4f6';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                    }}
                  >
                    <div style={{
                      width: '40px',
                      height: '40px',
                      backgroundColor: feature.color,
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <Icon size={20} color="white" />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: '600', color: '#1f2937', fontSize: '14px', margin: 0 }}>{feature.label}</p>
                      <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>{feature.desc}</p>
                    </div>
                    <ChevronRight size={16} color="#9ca3af" />
                  </button>
                );
              })}
            </div>

            <button 
              onClick={handleLogout}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                marginTop: '24px',
                color: '#dc2626',
                fontWeight: '500',
                fontSize: '14px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#fef2f2';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, overflow: 'auto' }}>
          <div style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', padding: '20px 32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {!sidebarOpen && (
                  <button onClick={() => setSidebarOpen(true)} style={{
                    padding: '8px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#f3f4f6';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                  }}
                  >
                    <Menu size={24} color="#4b5563" />
                  </button>
                )}
                <div>
                  <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>Sprouter Dashboard</h1>
                  <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>Welcome back, {profileData.fullName}!</p>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: '#f0fdf4', padding: '8px 16px', borderRadius: '9999px', border: '1px solid #dcfce7' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'linear-gradient(to bottom right, #4ade80, #16a34a)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '18px'
                }}>
                  {profileData.fullName ? profileData.fullName.charAt(0).toUpperCase() : 'S'}
                </div>
                <div>
                  <p style={{ fontWeight: '600', color: '#1f2937', fontSize: '14px', margin: 0 }}>{profileData.fullName}</p>
                  <p style={{ fontSize: '12px', color: '#16a34a', margin: 0 }}>Sprouter</p>
                </div>
              </div>
            </div>
          </div>

          <div style={{ padding: '32px' }}>
            {/* Welcome Banner */}
            <div style={{
              background: 'linear-gradient(to right, #22c55e, #16a34a, #059669)',
              borderRadius: '24px',
              padding: '32px',
              marginBottom: '32px',
              color: 'white',
              boxShadow: '0 10px 15px rgba(0,0,0,0.1)'
            }}>
              <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>🌾 Welcome to Your Sprouter Journey!</h2>
              <p style={{ color: '#dcfce7', marginBottom: '24px', lineHeight: '1.6', fontSize: '16px' }}>
                You're now a registered Sprouter! Access learning modules, connect with experts, and grow your farming skills.
                Start exploring the features below to maximize your agricultural potential.
              </p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <span style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: '20px', fontSize: '12px' }}>🎯 Personalized Learning</span>
                <span style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: '20px', fontSize: '12px' }}>🤝 Community Support</span>
                <span style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: '20px', fontSize: '12px' }}>📈 Growth Tracking</span>
              </div>
            </div>

            {/* Features Grid */}
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '24px' }}>Explore Sprouter Features</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
              {dashboardFeatures.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: 'white',
                      borderRadius: '16px',
                      padding: '24px',
                      border: '1px solid #f3f4f6',
                      cursor: 'pointer',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                    }}
                  >
                    <div style={{
                      width: '56px',
                      height: '56px',
                      backgroundColor: feature.color,
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '16px'
                    }}>
                      <Icon size={28} color="white" />
                    </div>
                    <h4 style={{ fontWeight: 'bold', color: '#1f2937', marginBottom: '8px', fontSize: '18px' }}>
                      {feature.label}
                    </h4>
                    <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px', lineHeight: '1.5' }}>{feature.desc}</p>
                    <div style={{ display: 'flex', alignItems: 'center', color: feature.color, fontSize: '14px', fontWeight: '500' }}>
                      <span>Explore</span>
                      <ArrowRight size={16} style={{ marginLeft: '8px' }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Stats */}
            <div style={{ marginTop: '48px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '24px' }}>Your Progress</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                  <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Registration Date</div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937' }}>
                    {new Date().toLocaleDateString()}
                  </div>
                </div>
                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                  <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Land Size</div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937' }}>
                    {profileData.landSize ? `${profileData.landSize} acres` : 'Not set'}
                  </div>
                </div>
                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                  <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Status</div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#16a34a' }}>Active</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Registration Form View
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #f0fdf4, #d1fae5, #ccfbf1)',
      padding: '32px 16px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            backgroundColor: 'white',
            padding: '12px 24px',
            borderRadius: '9999px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            marginBottom: '16px'
          }}>
            <Sprout size={32} color="#16a34a" />
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>Sprouter Registration</h1>
          </div>
          <p style={{ color: '#4b5563', fontSize: '18px' }}>Join the agricultural revolution in just 5 simple steps</p>
        </div>

        {/* Progress Stepper */}
        <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isCompleted = idx < currentStep;
              const isCurrent = idx === currentStep;
              
              return (
                <React.Fragment key={idx}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flex: 1 }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: isCompleted || isCurrent ? '#22c55e' : '#e5e7eb',
                      color: 'white',
                      transform: isCurrent ? 'scale(1.1)' : 'scale(1)',
                      transition: 'all 0.3s',
                      boxShadow: isCurrent ? '0 4px 12px rgba(34, 197, 94, 0.3)' : 'none'
                    }}>
                      {isCompleted ? <Check size={24} /> : <Icon size={24} />}
                    </div>
                    <span style={{
                      fontSize: '12px',
                      fontWeight: '500',
                      color: isCurrent ? '#16a34a' : '#6b7280'
                    }}>
                      {step.title}
                    </span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div style={{
                      height: '4px',
                      flex: 1,
                      margin: '0 8px',
                      borderRadius: '2px',
                      backgroundColor: idx < currentStep ? '#22c55e' : '#e5e7eb',
                      transition: 'background-color 0.3s'
                    }}></div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Form Content */}
        <div style={{ backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 10px 15px rgba(0,0,0,0.1)', padding: '32px' }}>
          {currentStep === 0 && (
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '24px' }}>Personal Information</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Full Name <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={profileData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    placeholder="Enter your full name"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: errors.fullName ? '2px solid #ef4444' : '2px solid #e5e7eb',
                      borderRadius: '12px',
                      outline: 'none',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      transition: 'border-color 0.2s'
                    }}
                  />
                  {errors.fullName && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px', color: '#ef4444', fontSize: '13px' }}>
                      <AlertCircle size={14} />
                      <span>{errors.fullName}</span>
                    </div>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                      Phone Number <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+91 XXXXX XXXXX"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: errors.phone ? '2px solid #ef4444' : '2px solid #e5e7eb',
                        borderRadius: '12px',
                        outline: 'none',
                        fontSize: '14px',
                        boxSizing: 'border-box',
                        transition: 'border-color 0.2s'
                      }}
                    />
                    {errors.phone && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px', color: '#ef4444', fontSize: '13px' }}>
                        <AlertCircle size={14} />
                        <span>{errors.phone}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                      Last 4 digits of Aadhaar <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={profileData.aadhaarLast4}
                      onChange={(e) => handleInputChange('aadhaarLast4', e.target.value)}
                      placeholder="XXXX"
                      maxLength={4}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: errors.aadhaarLast4 ? '2px solid #ef4444' : '2px solid #e5e7eb',
                        borderRadius: '12px',
                        outline: 'none',
                        fontSize: '14px',
                        boxSizing: 'border-box',
                        transition: 'border-color 0.2s'
                      }}
                    />
                    {errors.aadhaarLast4 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px', color: '#ef4444', fontSize: '13px' }}>
                        <AlertCircle size={14} />
                        <span>{errors.aadhaarLast4}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="your.email@example.com"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: errors.email ? '2px solid #ef4444' : '2px solid #e5e7eb',
                      borderRadius: '12px',
                      outline: 'none',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      transition: 'border-color 0.2s'
                    }}
                  />
                  {errors.email && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px', color: '#ef4444', fontSize: '13px' }}>
                      <AlertCircle size={14} />
                      <span>{errors.email}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '24px' }}>Address Details</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                      Village/Town <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={profileData.village}
                      onChange={(e) => handleInputChange('village', e.target.value)}
                      placeholder="Enter village or town"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: errors.village ? '2px solid #ef4444' : '2px solid #e5e7eb',
                        borderRadius: '12px',
                        outline: 'none',
                        fontSize: '14px',
                        boxSizing: 'border-box',
                        transition: 'border-color 0.2s'
                      }}
                    />
                    {errors.village && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px', color: '#ef4444', fontSize: '13px' }}>
                        <AlertCircle size={14} />
                        <span>{errors.village}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                      District <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={profileData.district}
                      onChange={(e) => handleInputChange('district', e.target.value)}
                      placeholder="Enter district"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: errors.district ? '2px solid #ef4444' : '2px solid #e5e7eb',
                        borderRadius: '12px',
                        outline: 'none',
                        fontSize: '14px',
                        boxSizing: 'border-box',
                        transition: 'border-color 0.2s'
                      }}
                    />
                    {errors.district && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px', color: '#ef4444', fontSize: '13px' }}>
                        <AlertCircle size={14} />
                        <span>{errors.district}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                      State <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={profileData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      placeholder="Enter state"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: errors.state ? '2px solid #ef4444' : '2px solid #e5e7eb',
                        borderRadius: '12px',
                        outline: 'none',
                        fontSize: '14px',
                        boxSizing: 'border-box',
                        transition: 'border-color 0.2s'
                      }}
                    />
                    {errors.state && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px', color: '#ef4444', fontSize: '13px' }}>
                        <AlertCircle size={14} />
                        <span>{errors.state}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                      Pincode <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={profileData.pincode}
                      onChange={(e) => handleInputChange('pincode', e.target.value)}
                      placeholder="Enter pincode"
                      maxLength={6}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: errors.pincode ? '2px solid #ef4444' : '2px solid #e5e7eb',
                        borderRadius: '12px',
                        outline: 'none',
                        fontSize: '14px',
                        boxSizing: 'border-box',
                        transition: 'border-color 0.2s'
                      }}
                    />
                    {errors.pincode && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px', color: '#ef4444', fontSize: '13px' }}>
                        <AlertCircle size={14} />
                        <span>{errors.pincode}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '24px' }}>Land Information</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Land Size (in Acres) <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={profileData.landSize}
                    onChange={(e) => handleInputChange('landSize', e.target.value)}
                    placeholder="Enter land size"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: errors.landSize ? '2px solid #ef4444' : '2px solid #e5e7eb',
                      borderRadius: '12px',
                      outline: 'none',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      transition: 'border-color 0.2s'
                    }}
                  />
                  {errors.landSize && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px', color: '#ef4444', fontSize: '13px' }}>
                      <AlertCircle size={14} />
                      <span>{errors.landSize}</span>
                    </div>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                      Land Type <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <select
                      value={profileData.landType}
                      onChange={(e) => handleInputChange('landType', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: errors.landType ? '2px solid #ef4444' : '2px solid #e5e7eb',
                        borderRadius: '12px',
                        outline: 'none',
                        fontSize: '14px',
                        backgroundColor: 'white',
                        boxSizing: 'border-box',
                        transition: 'border-color 0.2s'
                      }}
                    >
                      <option value="">Select land type</option>
                      <option value="owned">Owned</option>
                      <option value="leased">Leased</option>
                    </select>
                    {errors.landType && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px', color: '#ef4444', fontSize: '13px' }}>
                        <AlertCircle size={14} />
                        <span>{errors.landType}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                      Soil Type <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <select
                      value={profileData.soilType}
                      onChange={(e) => handleInputChange('soilType', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: errors.soilType ? '2px solid #ef4444' : '2px solid #e5e7eb',
                        borderRadius: '12px',
                        outline: 'none',
                        fontSize: '14px',
                        backgroundColor: 'white',
                        boxSizing: 'border-box',
                        transition: 'border-color 0.2s'
                      }}
                    >
                      <option value="">Select soil type</option>
                      <option value="red">Red Soil</option>
                      <option value="black">Black Soil</option>
                      <option value="sandy">Sandy Soil</option>
                      <option value="clay">Clay Soil</option>
                      <option value="not_sure">Not Sure</option>
                    </select>
                    {errors.soilType && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px', color: '#ef4444', fontSize: '13px' }}>
                        <AlertCircle size={14} />
                        <span>{errors.soilType}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '24px' }}>Income & Documents</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Annual Income Range <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <select
                    value={profileData.incomeRange}
                    onChange={(e) => handleInputChange('incomeRange', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: errors.incomeRange ? '2px solid #ef4444' : '2px solid #e5e7eb',
                      borderRadius: '12px',
                      outline: 'none',
                      fontSize: '14px',
                      backgroundColor: 'white',
                      boxSizing: 'border-box',
                      transition: 'border-color 0.2s'
                    }}
                  >
                    <option value="">Select income range</option>
                    <option value="below_1">Below ₹1 lakh</option>
                    <option value="1_2">₹1 - 2 lakh</option>
                    <option value="2_5">₹2 - 5 lakh</option>
                    <option value="above_5">Above ₹5 lakh</option>
                  </select>
                  {errors.incomeRange && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px', color: '#ef4444', fontSize: '13px' }}>
                      <AlertCircle size={14} />
                      <span>{errors.incomeRange}</span>
                    </div>
                  )}
                </div>
                
                <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '16px' }}>
                  <p style={{ fontSize: '14px', color: '#1e40af', fontWeight: '500', marginBottom: '12px' }}>📄 Document Upload (Optional - can be done later)</p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Aadhaar Card</label>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => handleFileUpload('aadhaarDoc', e)}
                        disabled={uploading}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: '2px dashed #d1d5db',
                          borderRadius: '12px',
                          cursor: uploading ? 'not-allowed' : 'pointer',
                          backgroundColor: 'white',
                          fontSize: '14px',
                          boxSizing: 'border-box',
                          opacity: uploading ? 0.6 : 1
                        }}
                      />
                      {uploading && (
                        <p style={{ fontSize: '12px', color: '#6366f1', marginTop: '4px', margin: 0 }}>⏳ Uploading...</p>
                      )}
                      {profileData.aadhaarDoc && !uploading && (
                        <p style={{ fontSize: '12px', color: '#16a34a', marginTop: '4px', margin: 0 }}>✓ Document uploaded successfully</p>
                      )}
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Land Proof</label>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => handleFileUpload('landProof', e)}
                        disabled={uploading}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: '2px dashed #d1d5db',
                          borderRadius: '12px',
                          cursor: uploading ? 'not-allowed' : 'pointer',
                          backgroundColor: 'white',
                          fontSize: '14px',
                          boxSizing: 'border-box',
                          opacity: uploading ? 0.6 : 1
                        }}
                      />
                      {uploading && (
                        <p style={{ fontSize: '12px', color: '#6366f1', marginTop: '4px', margin: 0 }}>⏳ Uploading...</p>
                      )}
                      {profileData.landProof && !uploading && (
                        <p style={{ fontSize: '12px', color: '#16a34a', marginTop: '4px', margin: 0 }}>✓ Document uploaded successfully</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '24px' }}>Farming Experience</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Years of Experience <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <select
                    value={profileData.experience}
                    onChange={(e) => handleInputChange('experience', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: errors.experience ? '2px solid #ef4444' : '2px solid #e5e7eb',
                      borderRadius: '12px',
                      outline: 'none',
                      fontSize: '14px',
                      backgroundColor: 'white',
                      boxSizing: 'border-box',
                      transition: 'border-color 0.2s'
                    }}
                  >
                    <option value="">Select experience level</option>
                    <option value="0-1">0 - 1 year (Beginner)</option>
                    <option value="1-3">1 - 3 years (Intermediate)</option>
                    <option value="3+">Above 3 years (Experienced)</option>
                  </select>
                  {errors.experience && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px', color: '#ef4444', fontSize: '13px' }}>
                      <AlertCircle size={14} />
                      <span>{errors.experience}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Main Crops Grown (Optional)
                  </label>
                  <input
                    type="text"
                    value={profileData.mainCrops}
                    onChange={(e) => handleInputChange('mainCrops', e.target.value)}
                    placeholder="e.g., Rice, Wheat, Cotton"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '12px',
                      outline: 'none',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      transition: 'border-color 0.2s'
                    }}
                  />
                </div>

                <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '24px', marginTop: '24px' }}>
                  <h3 style={{ fontWeight: 'bold', color: '#1f2937', marginBottom: '8px', marginTop: 0 }}>🎉 Almost Done!</h3>
                  <p style={{ fontSize: '14px', color: '#4b5563', margin: 0, lineHeight: '1.6' }}>
                    Complete your registration to access your personalized dashboard with learning modules, 
                    AI-powered tools, and connect with a community of farmers. Your journey to smarter farming starts here!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
            {currentStep > 0 && (
              <button
                onClick={handlePrevious}
                disabled={loading}
                style={{
                  padding: '12px 24px',
                  border: '2px solid #d1d5db',
                  color: '#374151',
                  fontWeight: '600',
                  borderRadius: '12px',
                  backgroundColor: 'transparent',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  opacity: loading ? 0.6 : 1,
                  transition: 'all 0.2s'
                }}
              >
                Previous
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={loading}
              style={{
                flex: 1,
                background: loading ? '#9ca3af' : 'linear-gradient(to right, #22c55e, #059669)',
                color: 'white',
                fontWeight: 'bold',
                padding: '12px',
                borderRadius: '12px',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : '0 4px 6px rgba(0,0,0,0.1)',
                fontSize: '14px',
                opacity: loading ? 0.6 : 1,
                transition: 'all 0.3s ease'
              }}
            >
              {loading ? '⏳ Processing...' : currentStep === steps.length - 1 ? 'Complete Registration 🎉' : 'Next Step'} →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SprouterProfileSystem;