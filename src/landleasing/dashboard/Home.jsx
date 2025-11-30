// src/dashboard/Home.jsx
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Card, 
  CardContent,
  Tabs,
  Tab,
  Container,
  Chip,
  IconButton,
  Alert,
  AlertTitle,
  CircularProgress
} from '@mui/material';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import MyLease from './MyLease';

const DashboardHome = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotification, setShowNotification] = useState(true);
  const [loading, setLoading] = useState(true);
  const [landData, setLandData] = useState(null);
  const [error, setError] = useState(null);

  // Get current user's email from localStorage or auth context
  const currentUserEmail = localStorage.getItem('userEmail') || 'priya.sharma@gmail.com';
  const currentUserName = localStorage.getItem('userName') || 'Priya Sharma';

  // Fetch land data for the signed-in user ONLY
  useEffect(() => {
    const fetchUserLandData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/lands');
        
        if (response.data.success) {
          // Filter to get ONLY the land belonging to current user's email
          const userLand = response.data.data.find(
            land => land.email && land.email.toLowerCase() === currentUserEmail.toLowerCase()
          );
          
          if (userLand) {
            setLandData(userLand);
          } else {
            setError('No land listing found for your account');
          }
        }
      } catch (err) {
        console.error('Error fetching land data:', err);
        setError('Failed to load land data. Please ensure backend is running at http://localhost:5000');
      } finally {
        setLoading(false);
      }
    };

    fetchUserLandData();
  }, [currentUserEmail]);

  const handleTabChange = (event, newValue) => {
    navigate(newValue);
  };

  const getCurrentTab = () => {
    if (location.pathname.includes('saved')) return '/saved';
    if (location.pathname.includes('documents')) return '/documents';
    return '/';
  };

  const isMainRoute = location.pathname === '/dashboard' || location.pathname === '/dashboard/';

  // Show loading spinner while fetching
  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        flexDirection: 'column',
        gap: 2
      }}>
        <CircularProgress sx={{ color: '#2e7d32' }} />
        <Typography variant="body2" color="text.secondary">
          Loading your land data...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fafafa' }}>
      {/* Navigation */}
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{ 
          bgcolor: 'white',
          borderBottom: '1px solid #e0e0e0',
          color: 'black'
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton 
              size="small" 
              onClick={() => navigate('/land-leasing')}
              sx={{ color: '#424242' }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600,
                color: '#212121',
                fontSize: '16px'
              }}
            >
              Home
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" sx={{ color: '#757575', fontSize: '14px' }}>
              Welcome, {currentUserName}
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/')}
              sx={{
                bgcolor: '#2e7d32',
                color: 'white',
                fontWeight: 600,
                borderRadius: '8px',
                padding: '8px 20px',
                textTransform: 'none',
                boxShadow: 'none',
                '&:hover': {
                  bgcolor: '#1b5e20',
                  boxShadow: 'none'
                }
              }}
            >
              Browse Lands
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Error Alert - Show if no land found */}
        {error && !landData && (
          <Alert 
            severity="warning"
            sx={{ mb: 3, borderRadius: '12px' }}
          >
            <AlertTitle>No Land Data Found</AlertTitle>
            {error}
            <Typography variant="body2" sx={{ mt: 1 }}>
              Please list your land using the "List Your Land" option.
            </Typography>
          </Alert>
        )}

        {/* Dynamic Owner Details - Show ONLY if land data exists */}
        {landData && showNotification && (
          <Alert 
            severity="info"
            icon={<InfoIcon />}
            sx={{
              mb: 3,
              borderRadius: '12px',
              border: '1px solid #e3f2fd',
              bgcolor: '#f0f7ff',
              '& .MuiAlert-message': {
                width: '100%'
              }
            }}
            action={
              <IconButton
                size="small"
                onClick={() => setShowNotification(false)}
                sx={{ color: '#1976d2' }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            }
          >
            <AlertTitle sx={{ fontWeight: 600, fontSize: '15px', color: '#1565c0' }}>
              🌾 Your Land Details
            </AlertTitle>
            <Box sx={{ mt: 1 }}>
              <Typography variant="body2" sx={{ color: '#424242', fontSize: '14px', lineHeight: 1.8 }}>
                <strong>Owner Name:</strong> {landData.farmerName || 'N/A'}
              </Typography>
              <Typography variant="body2" sx={{ color: '#424242', fontSize: '14px', lineHeight: 1.8 }}>
                <strong>Email:</strong> {landData.email || 'N/A'}
              </Typography>
              <Typography variant="body2" sx={{ color: '#424242', fontSize: '14px', lineHeight: 1.8 }}>
                <strong>Phone:</strong> {landData.contactNumber || 'N/A'}
              </Typography>
              <Typography variant="body2" sx={{ color: '#424242', fontSize: '14px', lineHeight: 1.8 }}>
                <strong>Land Location:</strong> {landData.village}, {landData.district}, {landData.state}
              </Typography>
              <Typography variant="body2" sx={{ color: '#424242', fontSize: '14px', lineHeight: 1.8 }}>
                <strong>Survey Number:</strong> {landData.surveyNumber || 'N/A'}
              </Typography>
            </Box>
          </Alert>
        )}

        {/* Land Specifications Card - Dynamic Data */}
        {landData && (
          <Card sx={{ mb: 3, borderRadius: '12px', border: '1px solid #e0e0e0' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#2e7d32' }}>
                📍 Land Specifications
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                <Box>
                  <Typography variant="body2" sx={{ color: '#757575', fontSize: '13px' }}>
                    Total Area
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: '#212121' }}>
                    {landData.totalArea} {landData.areaUnit}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: '#757575', fontSize: '13px' }}>
                    Available for Lease
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: '#212121' }}>
                    {landData.availableArea || landData.totalArea} {landData.areaUnit}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: '#757575', fontSize: '13px' }}>
                    Soil Type
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: '#212121' }}>
                    {landData.soilType || 'N/A'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: '#757575', fontSize: '13px' }}>
                    Topography
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: '#212121' }}>
                    {landData.topography || 'N/A'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: '#757575', fontSize: '13px' }}>
                    Water Sources
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: '#212121' }}>
                    {landData.waterSources ? 
                      (typeof landData.waterSources === 'string' ? 
                        JSON.parse(landData.waterSources).join(', ') : 
                        landData.waterSources.join(', ')
                      ) : 'N/A'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: '#757575', fontSize: '13px' }}>
                    Irrigation Type
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: '#212121' }}>
                    {landData.irrigationType || 'N/A'}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Lease Terms Card - Dynamic Data */}
        {landData && (
          <Card sx={{ mb: 3, borderRadius: '12px', border: '1px solid #e0e0e0' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#2e7d32' }}>
                💰 Lease Terms
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                <Box>
                  <Typography variant="body2" sx={{ color: '#757575', fontSize: '13px' }}>
                    Expected Rent
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: '#212121' }}>
                    ₹{landData.expectedRent} / {landData.rentFrequency}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: '#757575', fontSize: '13px' }}>
                    Lease Duration
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: '#212121' }}>
                    {landData.minLeaseDuration} - {landData.maxLeaseDuration || 'Flexible'} {landData.leaseDurationType}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: '#757575', fontSize: '13px' }}>
                    Negotiable
                  </Typography>
                  <Chip 
                    label={landData.negotiable ? 'Yes' : 'No'}
                    size="small"
                    sx={{ 
                      bgcolor: landData.negotiable ? '#4caf50' : '#ff9800',
                      color: 'white',
                      fontWeight: 600,
                      mt: 0.5
                    }}
                  />
                </Box>
                {landData.advanceRequired && (
                  <Box>
                    <Typography variant="body2" sx={{ color: '#757575', fontSize: '13px' }}>
                      Advance Amount
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#212121' }}>
                      ₹{landData.advanceAmount}
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards - Dynamic based on landData */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 3, mb: 4 }}>
          <Card 
            sx={{ 
              borderRadius: '12px',
              bgcolor: 'white',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              border: '1px solid #e0e0e0'
            }}
          >
            <CardContent sx={{ py: 3, px: 3 }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: '#757575', 
                  fontSize: '14px', 
                  mb: 1,
                  fontWeight: 500
                }}
              >
                Active Lease
              </Typography>
              <Typography 
                variant="h3" 
                sx={{ 
                  fontWeight: 700,
                  color: '#212121',
                  fontSize: '36px'
                }}
              >
                {landData ? 1 : 0}
              </Typography>
            </CardContent>
          </Card>

          <Card 
            sx={{ 
              borderRadius: '12px',
              bgcolor: 'white',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              border: '1px solid #e0e0e0'
            }}
          >
            <CardContent sx={{ py: 3, px: 3 }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: '#757575', 
                  fontSize: '14px', 
                  mb: 1,
                  fontWeight: 500
                }}
              >
                Saved Lands
              </Typography>
              <Typography 
                variant="h3" 
                sx={{ 
                  fontWeight: 700,
                  color: '#212121',
                  fontSize: '36px'
                }}
              >
                3
              </Typography>
            </CardContent>
          </Card>

          <Card 
            sx={{ 
              borderRadius: '12px',
              bgcolor: 'white',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              border: '1px solid #e0e0e0'
            }}
          >
            <CardContent sx={{ py: 3, px: 3 }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: '#757575', 
                  fontSize: '14px', 
                  mb: 1.5,
                  fontWeight: 500
                }}
              >
                Lease Status
              </Typography>
              <Chip 
                label={landData ? "Active" : "No Listing"} 
                sx={{ 
                  bgcolor: landData ? '#2e7d32' : '#9e9e9e',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '13px',
                  height: '28px',
                  borderRadius: '6px'
                }}
              />
            </CardContent>
          </Card>
        </Box>

        {/* Tabs */}
        <Box sx={{ mb: 3, bgcolor: 'white', borderRadius: '12px', p: 0.5, border: '1px solid #e0e0e0' }}>
          <Tabs 
            value={getCurrentTab()} 
            onChange={handleTabChange}
            sx={{
              minHeight: 'auto',
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                minHeight: 'auto',
                padding: '10px 20px',
                borderRadius: '8px',
                minWidth: 'auto',
                marginRight: 1,
                color: '#757575',
                fontSize: '14px',
                '&.Mui-selected': {
                  color: '#212121',
                  bgcolor: '#f5f5f5'
                }
              },
              '& .MuiTabs-indicator': {
                display: 'none'
              }
            }}
          >
            <Tab 
              label="My Lease" 
              value="/" 
              component={Link}
              to="/dashboard"
            />
            <Tab 
              label="Saved Lands" 
              value="/saved" 
              component={Link}
              to="/dashboard/saved"
            />
            <Tab 
              label="Documents" 
              value="/documents" 
              component={Link}
              to="/dashboard/documents"
            />
          </Tabs>
        </Box>

        {/* Content Area - Show MyLease component or nested routes */}
        {isMainRoute ? <MyLease /> : <Outlet />}
      </Container>
    </Box>
  );
};

export default DashboardHome;