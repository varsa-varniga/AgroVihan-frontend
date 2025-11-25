// src/dashboard/MyLease.jsx
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';

const MyLease = () => {
  const navigate = useNavigate();

  return (
    <>
      <Typography 
        variant="h5" 
        sx={{ 
          fontWeight: 700, 
          mb: 3,
          color: '#212121',
          fontSize: '24px'
        }}
      >
        Current Lease
      </Typography>

      <Card 
        sx={{ 
          borderRadius: '12px',
          bgcolor: 'white',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          border: '1px solid #e0e0e0'
        }}
      >
        <CardContent sx={{ p: 3 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 700, 
                  fontSize: '18px',
                  color: '#212121',
                  mb: 0.25
                }}
              >
                Mandya, Karnataka
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: '#9e9e9e',
                  fontSize: '13px'
                }}
              >
                SY-2024-001
              </Typography>
            </Box>
            <Chip 
              label="Active" 
              sx={{ 
                bgcolor: '#2e7d32',
                color: 'white',
                fontWeight: 600,
                fontSize: '12px',
                height: '24px',
                borderRadius: '5px',
                px: 1
              }}
            />
          </Box>

          {/* Three Column Grid Layout */}
          <Box sx={{ mb: 2 }}>
            {/* Row 1: Farmer, Start Date */}
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: '140px 1fr 160px 1fr', 
              gap: 2,
              mb: 1.5,
              alignItems: 'center'
            }}>
              <Typography variant="body2" sx={{ color: '#757575', fontSize: '13px' }}>
                Farmer
              </Typography>
              <Typography variant="body1" sx={{ color: '#212121', fontWeight: 600, fontSize: '14px' }}>
                Rajesh Kumar
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <CalendarTodayIcon sx={{ fontSize: 14, color: '#9e9e9e' }} />
                <Typography variant="body2" sx={{ color: '#757575', fontSize: '13px' }}>
                  Start Date
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: '#212121', fontWeight: 400, fontSize: '14px' }}>
                2024-03-15
              </Typography>
            </Box>

            {/* Row 2: Area, End Date */}
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: '140px 1fr 160px 1fr', 
              gap: 2,
              mb: 1.5,
              alignItems: 'center'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <LocationOnOutlinedIcon sx={{ fontSize: 14, color: '#9e9e9e' }} />
                <Typography variant="body2" sx={{ color: '#757575', fontSize: '13px' }}>
                  Area
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: '#212121', fontWeight: 400, fontSize: '14px' }}>
                5 acres
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <CalendarTodayIcon sx={{ fontSize: 14, color: '#9e9e9e' }} />
                <Typography variant="body2" sx={{ color: '#757575', fontSize: '13px' }}>
                  End Date
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: '#212121', fontWeight: 400, fontSize: '14px' }}>
                2025-03-15
              </Typography>
            </Box>

            {/* Row 3: Monthly Rent, Days Remaining */}
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: '140px 1fr 160px 1fr', 
              gap: 2,
              alignItems: 'center'
            }}>
              <Typography variant="body2" sx={{ color: '#757575', fontSize: '13px' }}>
                Monthly Rent
              </Typography>
              <Typography variant="body1" sx={{ color: '#2e7d32', fontWeight: 600, fontSize: '14px' }}>
                ₹15,000
              </Typography>
              <Typography variant="body2" sx={{ color: '#757575', fontSize: '13px' }}>
                Days Remaining
              </Typography>
              <Typography variant="body1" sx={{ color: '#212121', fontWeight: 400, fontSize: '14px' }}>
                425 days
              </Typography>
            </Box>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, pt: 2, borderTop: '1px solid #e0e0e0' }}>
<Button
  startIcon={<DescriptionOutlinedIcon sx={{ fontSize: 16 }} />}
  onClick={() => navigate('/view-agreement')}   // ✅ add navigation
  sx={{
    flex: 1,
    color: '#616161',
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '13px',
    border: '1px solid #e0e0e0',
    borderRadius: '6px',
    padding: '8px 16px',
    justifyContent: 'center',
    bgcolor: 'white',
    transition: 'all 0.2s ease',
    '&:hover': {
      bgcolor: '#f59e0b',
      color: 'white',
      border: '1px solid #f59e0b',
      '& .MuiSvgIcon-root': {
        color: 'white'
      }
    }
  }}
>
  View Agreement
</Button>

            <Button
              sx={{
                color: '#212121',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '13px',
                border: '1px solid #e0e0e0',
                borderRadius: '6px',
                padding: '8px 24px',
                bgcolor: 'white',
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: '#f59e0b',
                  color: 'white',
                  border: '1px solid #f59e0b'
                }
              }}
            >
              Contact Farmer
            </Button>
          </Box>
        </CardContent>
      </Card>
    </>
  );
};

export default MyLease;