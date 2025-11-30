import React, { useState } from 'react';
import { 
  ThemeProvider, 
  createTheme, 
  CssBaseline, 
  Box,
  Drawer,
  IconButton
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';

// Import all components
import Dashboard from './components/Dashboard';
import FarmProfile from './components/FarmProfile';
import Availability from './components/Availability';
import BrowseFarms from './components/BrowseFarms';
import Bookings from './components/Bookings';
import Rewards from './components/Rewards';
import Journal from './components/Journal';
import Reviews from './components/Reviews';
import BookingModal from './components/BookingModal';
import Sidebar from './components/Sidebar';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2e7d32',
      light: '#4caf50',
      dark: '#1b5e20',
    },
    secondary: {
      main: '#ff9800',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

const drawerWidth = 240;
const collapsedWidth = 70;

const SoilConnect = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [userType, setUserType] = useState('mentor');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  
  const [userData] = useState({
    name: userType === 'mentor' ? 'Ravi Kumar' : 'Priya Sharma',
    farmTokens: 450,
    carbonCredits: 120,
    badges: ['Top Mentor', 'Organic Pioneer', 'Water Saver'],
    visitsHosted: 23,
    visitsAttended: 8,
    rating: 4.8,
    certificates: 5
  });

  const [farms] = useState([
    {
      id: 1,
      name: 'Green Valley Organic Farm',
      owner: 'Ravi Kumar',
      location: 'Coimbatore, Tamil Nadu',
      coords: [11.0168, 76.9558],
      crops: ['Rice', 'Turmeric', 'Vegetables'],
      badges: ['Organic', 'Water-Saving', 'Eco-Friendly'],
      verified: true,
      rating: 4.8,
      reviews: 15,
      image: '🌾',
      available: true
    }
  ]);

  const [bookings] = useState([
    {
      id: 1,
      farmId: 1,
      learnerName: 'Priya Sharma',
      date: '2025-11-20',
      duration: 'Full Day',
      status: 'pending',
      reason: 'Learn about organic rice cultivation methods'
    }
  ]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      
      {/* Main Container - Full Viewport Height */}
      <Box sx={{ 
        width: '100vw',
        height: '100vh',
        backgroundColor: 'white',
        display: 'flex',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* Back Button - Top Left */}
        <IconButton
          onClick={() => window.history.back()}
          sx={{
            position: 'absolute',
            top: 16,
            left: sidebarOpen ? drawerWidth + 16 : collapsedWidth + 16,
            zIndex: 1000,
            backgroundColor: 'white',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            transition: 'left 0.3s ease',
            '&:hover': {
              backgroundColor: '#f5f5f5',
            }
          }}
        >
          <ArrowBack />
        </IconButton>
        {/* Sidebar - Full Height */}
        <Drawer
          variant="permanent"
          sx={{
            width: sidebarOpen ? drawerWidth : collapsedWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: sidebarOpen ? drawerWidth : collapsedWidth,
              boxSizing: 'border-box',
              background: 'linear-gradient(180deg, #2e7d32 0%, #1b5e20 100%)',
              color: 'white',
              transition: 'width 0.3s ease',
              overflowX: 'hidden',
              height: '100vh',
              position: 'relative',
              border: 'none'
            },
          }}
        >
          <Sidebar 
            sidebarOpen={sidebarOpen} 
            setSidebarOpen={setSidebarOpen}
            currentView={currentView}
            setCurrentView={setCurrentView}
          />
        </Drawer>

        {/* Main Content Area - Full Height */}
        <Box 
          sx={{ 
            flexGrow: 1,
            p: 3,
            pt: 8,
            width: `calc(100% - ${sidebarOpen ? drawerWidth : collapsedWidth}px)`,
            transition: 'width 0.3s ease',
            height: '100vh',
            backgroundColor: '#f8f9fa',
            overflow: 'auto'
          }}
        >
          {/* Render Current View Component */}
          {currentView === 'dashboard' && (
            <Dashboard 
              userData={userData} 
              userType={userType} 
              setUserType={setUserType}
              bookings={bookings}
              farms={farms}
            />
          )}
          {currentView === 'profile' && <FarmProfile />}
          {currentView === 'availability' && <Availability />}
          {currentView === 'browse' && (
            <BrowseFarms 
              farms={farms}
              setSelectedFarm={setSelectedFarm}
              setBookingModalOpen={setBookingModalOpen}
            />
          )}
          {currentView === 'bookings' && (
            <Bookings 
              bookings={bookings}
              farms={farms}
              userType={userType}
            />
          )}
          {currentView === 'rewards' && <Rewards userData={userData} />}
          {currentView === 'journal' && <Journal />}
          {currentView === 'reviews' && <Reviews userData={userData} />}
        </Box>
        
        {/* Modals */}
        {bookingModalOpen && (
          <BookingModal 
            selectedFarm={selectedFarm}
            setBookingModalOpen={setBookingModalOpen}
          />
        )}
      </Box>
    </ThemeProvider>
  );
};

export default SoilConnect;