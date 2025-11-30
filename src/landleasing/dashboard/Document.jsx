// src/dashboard/Documents.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box
} from '@mui/material';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';

const Documents = () => {
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
        My Documents
      </Typography>

      <Card
        sx={{
          border: '1px solid #e0e0e0',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          bgcolor: 'white'
        }}
      >
        <CardContent sx={{ p: 3 }}>
          {/* Document Header */}
          <Box sx={{ mb: 3 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700,
                color: '#212121',
                fontSize: '18px',
                mb: 0.5
              }}
            >
              Lease Agreement
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#757575', 
                mb: 1,
                fontSize: '14px'
              }}
            >
              SY-2024-001 - Mandya, Karnataka
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#9e9e9e', 
                fontSize: '13px'
              }}
            >
              Signed on: March 15, 2024
            </Typography>
          </Box>

          {/* View PDF Button */}
<Button
  startIcon={<DescriptionOutlinedIcon />}
  onClick={() => navigate('/view-agreement')}  // ✅ Add navigation
  variant="outlined"
  sx={{ 
    color: '#212121',
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '14px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '10px 24px',
    transition: 'all 0.3s ease',
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
  View PDF
</Button>
        </CardContent>
      </Card>
    </>
  );
};

export default Documents;