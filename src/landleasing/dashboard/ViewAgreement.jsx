// src/dashboard/ViewAgreement.jsx
import React from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Card,
  CardContent,
  Container,
  IconButton,
  Divider,
  Grid
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DownloadIcon from '@mui/icons-material/Download';
import VerifiedIcon from '@mui/icons-material/Verified';

const ViewAgreement = () => {
  const navigate = useNavigate();

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
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              cursor: 'pointer',
              '&:hover': { color: '#2e7d32' }
            }}
            onClick={() => navigate('/dashboard')}
          >
            <IconButton size="small" sx={{ color: 'inherit' }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600,
                fontSize: '16px'
              }}
            >
              Back to Dashboard
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            sx={{
              color: '#212121',
              border: '1px solid #e0e0e0',
              fontWeight: 600,
              borderRadius: '8px',
              padding: '8px 20px',
              textTransform: 'none',
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
            Download PDF
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 6 }}>
        <Card 
          sx={{ 
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            border: '1px solid #e0e0e0'
          }}
        >
          <CardContent sx={{ p: 6 }}>
            {/* Agreement Header */}
            <Box sx={{ textAlign: 'center', mb: 6, pb: 4, borderBottom: '1px solid #e0e0e0' }}>
              <Typography 
                variant="h3" 
                sx={{ 
                  fontWeight: 700, 
                  mb: 1,
                  fontSize: '32px',
                  color: '#212121'
                }}
              >
                FARMLAND LEASE AGREEMENT
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ color: '#757575', fontSize: '15px' }}
              >
                Agreement Number: AGR-2024-001
              </Typography>
            </Box>

            {/* Agreement Content */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {/* Parties */}
              <Box>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600, 
                    mb: 2,
                    fontSize: '18px',
                    color: '#212121'
                  }}
                >
                  Parties to the Agreement
                </Typography>
                <Box sx={{ bgcolor: '#f5f5f5', p: 3, borderRadius: '8px' }}>
                  <Typography variant="body1" sx={{ mb: 1.5, fontSize: '15px' }}>
                    <strong>Landowner (First Party):</strong> Rajesh Kumar
                  </Typography>
                  <Typography variant="body1" sx={{ fontSize: '15px' }}>
                    <strong>Lessee (Second Party):</strong> Priya Sharma
                  </Typography>
                </Box>
              </Box>

              {/* Property Details */}
              <Box>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600, 
                    mb: 2,
                    fontSize: '18px',
                    color: '#212121'
                  }}
                >
                  Property Details
                </Typography>
                <Box sx={{ bgcolor: '#f5f5f5', p: 3, borderRadius: '8px' }}>
                  <Typography variant="body1" sx={{ mb: 1, fontSize: '15px' }}>
                    <strong>Survey Number:</strong> SY-2024-001
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1, fontSize: '15px' }}>
                    <strong>Location:</strong> Mandya District, Karnataka
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1, fontSize: '15px' }}>
                    <strong>Total Area:</strong> 5 acres
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1, fontSize: '15px' }}>
                    <strong>Soil Type:</strong> Red Loam
                  </Typography>
                  <Typography variant="body1" sx={{ fontSize: '15px' }}>
                    <strong>Irrigation:</strong> Borewell
                  </Typography>
                </Box>
              </Box>

              {/* Terms and Conditions */}
              <Box>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600, 
                    mb: 2,
                    fontSize: '18px',
                    color: '#212121'
                  }}
                >
                  Terms and Conditions
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ bgcolor: '#f5f5f5', p: 3, borderRadius: '8px' }}>
                    <Typography variant="body1" sx={{ fontWeight: 600, mb: 1, fontSize: '15px' }}>
                      1. Lease Duration
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#616161', lineHeight: 1.6, fontSize: '14px' }}>
                      The lease period shall commence from March 15, 2024, and continue until March 15, 2025 (12 months).
                    </Typography>
                  </Box>

                  <Box sx={{ bgcolor: '#f5f5f5', p: 3, borderRadius: '8px' }}>
                    <Typography variant="body1" sx={{ fontWeight: 600, mb: 1, fontSize: '15px' }}>
                      2. Rent Payment
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#616161', lineHeight: 1.6, fontSize: '14px' }}>
                      The lessee agrees to pay a monthly rent of ₹15,000 (Fifteen Thousand Rupees Only) to the landowner. 
                      Payment shall be made by the 5th of each month through the AgriLease Connect platform.
                    </Typography>
                  </Box>

                  <Box sx={{ bgcolor: '#f5f5f5', p: 3, borderRadius: '8px' }}>
                    <Typography variant="body1" sx={{ fontWeight: 600, mb: 1, fontSize: '15px' }}>
                      3. Land Use
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#616161', lineHeight: 1.6, fontSize: '14px' }}>
                      The lessee shall use the land exclusively for agricultural purposes. Any change in land use requires 
                      written consent from the landowner.
                    </Typography>
                  </Box>

                  <Box sx={{ bgcolor: '#f5f5f5', p: 3, borderRadius: '8px' }}>
                    <Typography variant="body1" sx={{ fontWeight: 600, mb: 1, fontSize: '15px' }}>
                      4. Maintenance
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#616161', lineHeight: 1.6, fontSize: '14px' }}>
                      The lessee is responsible for maintaining the land in good condition, including irrigation systems 
                      and soil health. Any damage caused by negligence shall be borne by the lessee.
                    </Typography>
                  </Box>

                  <Box sx={{ bgcolor: '#f5f5f5', p: 3, borderRadius: '8px' }}>
                    <Typography variant="body1" sx={{ fontWeight: 600, mb: 1, fontSize: '15px' }}>
                      5. Termination
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#616161', lineHeight: 1.6, fontSize: '14px' }}>
                      Either party may terminate this agreement with 30 days written notice. In case of breach of terms, 
                      the agreement may be terminated immediately with forfeiture of security deposit.
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Signatures */}
              <Box>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600, 
                    mb: 3,
                    fontSize: '18px',
                    color: '#212121'
                  }}
                >
                  Signatures
                </Typography>
                <Grid container spacing={4}>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ borderTop: '2px solid #e0e0e0', pt: 3 }}>
                      <Typography variant="body1" sx={{ fontWeight: 600, mb: 2, fontSize: '15px' }}>
                        Landowner
                      </Typography>
                      <Box 
                        sx={{ 
                          bgcolor: '#e8f5e9', 
                          height: 80, 
                          borderRadius: '8px', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          mb: 2
                        }}
                      >
                        <VerifiedIcon sx={{ fontSize: 40, color: '#2e7d32' }} />
                      </Box>
                      <Typography variant="body2" sx={{ color: '#616161', fontSize: '14px' }}>
                        Rajesh Kumar
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#757575', fontSize: '13px' }}>
                        Signed on: March 15, 2024
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ borderTop: '2px solid #e0e0e0', pt: 3 }}>
                      <Typography variant="body1" sx={{ fontWeight: 600, mb: 2, fontSize: '15px' }}>
                        Lessee
                      </Typography>
                      <Box 
                        sx={{ 
                          bgcolor: '#e8f5e9', 
                          height: 80, 
                          borderRadius: '8px', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          mb: 2
                        }}
                      >
                        <VerifiedIcon sx={{ fontSize: 40, color: '#2e7d32' }} />
                      </Box>
                      <Typography variant="body2" sx={{ color: '#616161', fontSize: '14px' }}>
                        Priya Sharma
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#757575', fontSize: '13px' }}>
                        Signed on: March 15, 2024
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              {/* Verification Badge */}
              <Box 
                sx={{ 
                  bgcolor: '#e8f5e9', 
                  p: 3, 
                  borderRadius: '8px', 
                  border: '1px solid #c8e6c9',
                  textAlign: 'center'
                }}
              >
                <Typography variant="body2" sx={{ color: '#2e7d32', fontSize: '14px', fontWeight: 500 }}>
                  This is a digitally signed agreement verified by AgriLease Connect Platform
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default ViewAgreement;