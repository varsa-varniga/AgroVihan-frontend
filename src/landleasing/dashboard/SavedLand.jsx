// src/dashboard/SavedLands.jsx
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box
} from '@mui/material';

const SavedLands = () => {
  const savedLands = [
    {
      id: 1,
      location: "Mysore, Karnataka",
      surveyNumber: "SY-2024-002",
      area: "3 acres",
      rent: "₹12,000/month"
    },
    {
      id: 2,
      location: "Hassan, Karnataka",
      surveyNumber: "SY-2024-003",
      area: "8 acres",
      rent: "₹20,000/month"
    }
  ];

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
        Saved Farmlands
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 3 }}>
        {savedLands.map((land) => (
          <Card
            key={land.id}
            sx={{
              border: '1px solid #e0e0e0',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              bgcolor: 'white'
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              {/* Header */}
              <Box sx={{ mb: 2.5 }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 700,
                    color: '#212121',
                    fontSize: '18px',
                    mb: 0.25
                  }}
                >
                  {land.location}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#9e9e9e',
                    fontSize: '13px'
                  }}
                >
                  {land.surveyNumber}
                </Typography>
              </Box>

              {/* Details Row - Horizontal Layout */}
              <Box sx={{ 
                display: 'grid',
                gridTemplateColumns: '80px 1fr',
                gap: 3,
                mb: 2.5
              }}>
                {/* Area */}
                <Box>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#757575', 
                      fontSize: '13px',
                      mb: 0.5
                    }}
                  >
                    Area
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      fontWeight: 400,
                      color: '#212121',
                      fontSize: '14px'
                    }}
                  >
                    {land.area}
                  </Typography>
                </Box>

                {/* Rent */}
                <Box>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#757575', 
                      fontSize: '13px',
                      mb: 0.5
                    }}
                  >
                    Rent
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      fontWeight: 400,
                      color: '#2e7d32',
                      fontSize: '14px'
                    }}
                  >
                    {land.rent}
                  </Typography>
                </Box>
              </Box>
              
              {/* Button */}
              <Button
                variant="contained"
                fullWidth
                sx={{ 
                  bgcolor: '#2e7d32',
                  borderRadius: '6px',
                  fontWeight: 600,
                  textTransform: 'none',
                  padding: '10px 20px',
                  fontSize: '14px',
                  boxShadow: 'none',
                  '&:hover': {
                    bgcolor: '#1b5e20',
                    boxShadow: 'none'
                  }
                }}
              >
                Apply for Lease
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>
    </>
  );
};

export default SavedLands;