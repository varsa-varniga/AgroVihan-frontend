import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Container,
  Grid,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  CssBaseline,
  Card,
  CardContent,
  Alert,
  Chip,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery,
  InputAdornment,
  Tooltip,
  Fade,
  alpha,
  styled,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  TrendingUp as TrendingUpIcon,
  Analytics as AnalyticsIcon,
  Calculate as CalculateIcon,
  Agriculture as AgricultureIcon,
  WbSunny as TemperatureIcon,
  Opacity as MoistureIcon,
  Park as CropIcon,
  LocationOn as LocationIcon,
  Spa as OrganicIcon,
  Waves as DrainageIcon,
  Cloud as RainIcon,
  Grass as GrassIcon,
  EmojiNature as NatureIcon,
  LocalFlorist as FloristIcon,
  Science as ScienceIcon,
} from "@mui/icons-material";
import axios from "axios";

// Styled components with agricultural theme
const AgroCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.success.main, 0.05)} 100%)`,
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  backdropFilter: 'blur(10px)',
  borderRadius: 16,
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.15)}`,
  },
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 0%, ${theme.palette.success.main} 100%)`,
  color: 'white',
  fontWeight: 'bold',
  borderRadius: 12,
  padding: '12px 32px',
  textTransform: 'none',
  fontSize: '1.1rem',
  boxShadow: `0 4px 15px ${alpha(theme.palette.primary.main, 0.3)}`,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
  },
  '&:disabled': {
    background: `linear-gradient(45deg, ${theme.palette.grey[400]} 0%, ${theme.palette.grey[500]} 100%)`,
  },
}));

const ScoreChip = styled(Chip)(({ theme, score }) => {
  let color = theme.palette.error.main;
  if (score >= 8) color = theme.palette.success.main;
  else if (score >= 6) color = theme.palette.warning.main;
  
  return {
    background: alpha(color, 0.1),
    color: color,
    border: `1px solid ${alpha(color, 0.3)}`,
    fontWeight: 'bold',
    borderRadius: 8,
  };
});

const initialFormData = {
  soil_type: "",
  soil_moisture: 0,
  soil_ph: 0,
  N: 0,
  P: 0,
  K: 0,
  organic_carbon: 0,
  texture: "",
  drainage: "",
  soil_health_index: 0,
  previous_crop: "",
  acres: 0,
  temperature: 0,
  humidity: 0,
  ph: 0,
  rainfall: 0,
  location: "",
  irrigation_method: "",
  planting_density: 0,
  ndvi: 0,
  evi: 0,
  lai: 0,
};

// Enhanced field configurations with agricultural icons and descriptions
const fieldConfig = {
  soil_type: { 
    icon: <GrassIcon />, 
    label: "Soil Type", 
    type: "text",
    description: "Type of soil (clay, loam, sandy, etc.)"
  },
  soil_moisture: { 
    icon: <MoistureIcon />, 
    label: "Soil Moisture (%)", 
    type: "number",
    description: "Current soil moisture percentage"
  },
  soil_ph: { 
    icon: <ScienceIcon />, 
    label: "Soil pH", 
    type: "number",
    description: "Soil acidity/alkalinity level"
  },
  N: { 
    icon: <FloristIcon />, 
    label: "Nitrogen (N) ppm", 
    type: "number",
    description: "Nitrogen content in parts per million"
  },
  P: { 
    icon: <FloristIcon />, 
    label: "Phosphorus (P) ppm", 
    type: "number",
    description: "Phosphorus content in parts per million"
  },
  K: { 
    icon: <FloristIcon />, 
    label: "Potassium (K) ppm", 
    type: "number",
    description: "Potassium content in parts per million"
  },
  organic_carbon: { 
    icon: <OrganicIcon />, 
    label: "Organic Carbon (%)", 
    type: "number",
    description: "Percentage of organic carbon in soil"
  },
  texture: { 
    icon: <AgricultureIcon />, 
    label: "Soil Texture", 
    type: "text",
    description: "Soil texture classification"
  },
  drainage: { 
    icon: <DrainageIcon />, 
    label: "Drainage", 
    type: "text",
    description: "Soil drainage capacity"
  },
  soil_health_index: { 
    icon: <AnalyticsIcon />, 
    label: "Soil Health Index", 
    type: "number",
    description: "Overall soil health score"
  },
  previous_crop: { 
    icon: <CropIcon />, 
    label: "Previous Crop", 
    type: "text",
    description: "Crop grown in previous season"
  },
  acres: { 
    icon: <AgricultureIcon />, 
    label: "Farm Size (acres)", 
    type: "number",
    description: "Total farm area in acres"
  },
  temperature: { 
    icon: <TemperatureIcon />, 
    label: "Temperature (°C)", 
    type: "number",
    description: "Average temperature in Celsius"
  },
  humidity: { 
    icon: <MoistureIcon />, 
    label: "Humidity (%)", 
    type: "number",
    description: "Relative humidity percentage"
  },
  ph: { 
    icon: <ScienceIcon />, 
    label: "Water pH", 
    type: "number",
    description: "pH level of irrigation water"
  },
  rainfall: { 
    icon: <RainIcon />, 
    label: "Rainfall (mm)", 
    type: "number",
    description: "Annual rainfall in millimeters"
  },
  location: { 
    icon: <LocationIcon />, 
    label: "Location", 
    type: "text",
    description: "Geographic location coordinates"
  },
  irrigation_method: { 
    icon: <DrainageIcon />, 
    label: "Irrigation Method", 
    type: "text",
    description: "Type of irrigation system used"
  },
  planting_density: { 
    icon: <CropIcon />, 
    label: "Planting Density", 
    type: "number",
    description: "Plants per acre/hectare"
  },
  ndvi: { 
    icon: <NatureIcon />, 
    label: "NDVI", 
    type: "number",
    description: "Normalized Difference Vegetation Index"
  },
  evi: { 
    icon: <NatureIcon />, 
    label: "EVI", 
    type: "number",
    description: "Enhanced Vegetation Index"
  },
  lai: { 
    icon: <NatureIcon />, 
    label: "LAI", 
    type: "number",
    description: "Leaf Area Index"
  },
};

// Navigation items
const navItems = [
  { text: "Home", icon: <HomeIcon /> },
  { text: "Market Forecast", icon: <TrendingUpIcon /> },
  { text: "Yield Prediction", icon: <AnalyticsIcon /> },
  { text: "ROI Calculator", icon: <CalculateIcon /> },
];

// Field categories for organized form
const fieldCategories = {
  soil: [
    'soil_type', 'soil_moisture', 'soil_ph', 'texture', 'drainage', 
    'organic_carbon', 'soil_health_index'
  ],
  nutrients: ['N', 'P', 'K'],
  environment: [
    'temperature', 'humidity', 'rainfall', 'location', 'ph'
  ],
  farming: [
    'previous_crop', 'acres', 'irrigation_method', 'planting_density'
  ],
  remoteSensing: ['ndvi', 'evi', 'lai']
};

export default function AgroPulse() {
  const [formData, setFormData] = useState(initialFormData);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [success, setSuccess] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    setRecommendations([]);
    
    try {
      const response = await axios.post(
        "http://localhost:8080/api/final_recommendation/",
        formData
      );
      setRecommendations(response.data.recommended_crops);
      setSuccess(true);
    } catch (err) {
      setError(
        err.response?.data?.detail || "Something went wrong. Please try again."
      );
    }
    setLoading(false);
  };

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const getFieldsByCategory = (category) => {
    return fieldCategories[category].map(fieldName => ({
      name: fieldName,
      ...fieldConfig[fieldName]
    }));
  };

  const renderFormSection = (fields, title, icon) => (
    <AgroCard sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ 
          color: 'primary.main', 
          display: 'flex', 
          alignItems: 'center',
          gap: 1,
          fontWeight: 'bold'
        }}>
          {icon}
          {title}
        </Typography>
        <Grid container spacing={3}>
          {fields.map((field) => (
            <Grid item xs={12} sm={6} md={4} key={field.name}>
              <Tooltip title={field.description} arrow placement="top">
                <TextField
                  fullWidth
                  label={field.label}
                  name={field.name}
                  type={field.type}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required
                  size="medium"
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Box sx={{ color: 'primary.main' }}>
                          {field.icon}
                        </Box>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: alpha(theme.palette.primary.main, 0.02),
                      '&:hover fieldset': {
                        borderColor: theme.palette.primary.main,
                      },
                    },
                  }}
                />
              </Tooltip>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </AgroCard>
  );

  return (
    <>
      <CssBaseline />
      
      {/* Enhanced AppBar with agricultural theme */}
      <AppBar 
        position="sticky" 
        elevation={2}
        sx={{
          background: `linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)`,
          backdropFilter: 'blur(10px)',
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <AgricultureIcon sx={{ mr: 2, fontSize: 32 }} />
          <Typography variant="h5" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            AgroPulse
          </Typography>
          <Chip 
            label="AI Powered Agriculture" 
            color="secondary" 
            size="medium"
            variant="filled"
            sx={{ fontWeight: 'bold', color: 'white' }}
          />
        </Toolbar>
      </AppBar>

      {/* Enhanced Navigation Drawer */}
      <Drawer 
        anchor="left" 
        open={drawerOpen} 
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: { 
            background: `linear-gradient(180deg, #2E7D32 0%, #1B5E20 100%)`,
            color: 'white',
            width: 280,
          }
        }}
      >
        <Box sx={{ p: 2, textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <AgricultureIcon sx={{ fontSize: 48, mb: 1, color: 'white' }} />
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            AgroPulse
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Smart Farming Intelligence Platform
          </Typography>
        </Box>
        <List sx={{ mt: 2 }}>
          {navItems.map((item) => (
            <ListItem 
              button 
              key={item.text}
              sx={{
                margin: '4px 8px',
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.15)',
                }
              }}
            >
              <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{ fontWeight: 'medium' }}
              />
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main Container */}
      <Container maxWidth="xl" sx={{ py: 4, background: 'transparent' }}>
        {/* Enhanced Header */}
        <Box textAlign="center" mb={6}>
          <Typography 
            variant="h2" 
            gutterBottom 
            sx={{ 
              fontWeight: 'bold',
              background: `linear-gradient(45deg, #2E7D32, #FF9800)`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              fontSize: { xs: '2.5rem', md: '3.5rem' }
            }}
          >
            Smart Crop Recommendation
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary" 
            sx={{ 
              maxWidth: 600, 
              mx: 'auto',
              background: `linear-gradient(45deg, #2E7D32, #4CAF50)`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              fontWeight: 'medium'
            }}
          >
            AI-powered insights for optimal crop selection and maximum yield potential
          </Typography>
        </Box>

        {/* Enhanced Form Section */}
        <AgroCard elevation={3} sx={{ mb: 4 }}>
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ 
              borderBottom: 1, 
              borderColor: 'divider',
              background: `linear-gradient(90deg, ${alpha('#2E7D32', 0.1)} 0%, ${alpha('#4CAF50', 0.1)} 100%)`
            }}>
              <Tabs 
                value={activeTab} 
                onChange={handleTabChange}
                variant={isMobile ? "scrollable" : "fullWidth"}
                scrollButtons="auto"
                textColor="primary"
                indicatorColor="primary"
              >
                <Tab label="Soil Properties" icon={<GrassIcon />} iconPosition="start" />
                <Tab label="Nutrients" icon={<FloristIcon />} iconPosition="start" />
                <Tab label="Environment" icon={<TemperatureIcon />} iconPosition="start" />
                <Tab label="Farming Practices" icon={<AgricultureIcon />} iconPosition="start" />
                <Tab label="Remote Sensing" icon={<NatureIcon />} iconPosition="start" />
              </Tabs>
            </Box>

            <Box sx={{ p: 4 }}>
              <form onSubmit={handleSubmit}>
                {activeTab === 0 && renderFormSection(getFieldsByCategory('soil'), "Soil Properties", <GrassIcon />)}
                {activeTab === 1 && renderFormSection(getFieldsByCategory('nutrients'), "Soil Nutrients", <FloristIcon />)}
                {activeTab === 2 && renderFormSection(getFieldsByCategory('environment'), "Environmental Conditions", <TemperatureIcon />)}
                {activeTab === 3 && renderFormSection(getFieldsByCategory('farming'), "Farming Practices", <AgricultureIcon />)}
                {activeTab === 4 && renderFormSection(getFieldsByCategory('remoteSensing'), "Remote Sensing Data", <NatureIcon />)}

                <Box sx={{ textAlign: 'center', mt: 4 }}>
                  <GradientButton
                    type="submit"
                    disabled={loading}
                    size="large"
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Generate AI Recommendations"
                    )}
                  </GradientButton>
                </Box>
              </form>
            </Box>
          </CardContent>
        </AgroCard>

        {/* Enhanced Alerts */}
        {error && (
          <Fade in={!!error}>
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3, 
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`
              }}
            >
              {error}
            </Alert>
          </Fade>
        )}

        {success && recommendations.length > 0 && (
          <Fade in={success}>
            <Alert 
              severity="success" 
              sx={{ 
                mb: 3, 
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`
              }}
            >
              <Typography variant="h6" gutterBottom>
                🎉 Success! Found {recommendations.length} optimal crop recommendations
              </Typography>
              Based on your farm data and environmental conditions, here are the most suitable crops for maximum yield and profitability.
            </Alert>
          </Fade>
        )}

        {/* Enhanced Results Table */}
        {recommendations.length > 0 && (
          <Fade in={recommendations.length > 0}>
            <AgroCard elevation={3}>
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ 
                  p: 4, 
                  pb: 2,
                  background: `linear-gradient(135deg, ${alpha('#2E7D32', 0.05)} 0%, ${alpha('#4CAF50', 0.05)} 100%)`
                }}>
                  <Typography variant="h4" gutterBottom sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 2,
                    fontWeight: 'bold'
                  }}>
                    <AgricultureIcon color="primary" sx={{ fontSize: 40 }} />
                    Recommended Crops Analysis
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
                    Comprehensive crop suitability analysis sorted by overall performance score
                  </Typography>
                </Box>
                
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ 
                        backgroundColor: alpha('#2E7D32', 0.08),
                      }}>
                        <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', py: 2 }}>Crop</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', py: 2 }}>Soil Score</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', py: 2 }}>Climate Score</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', py: 2 }}>Yield Score</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', py: 2 }}>Market Score</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', py: 2 }}>ROI Score</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', py: 2 }}>Final Score</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {recommendations.map((crop, index) => (
                        <TableRow 
                          key={crop.crop}
                          sx={{ 
                            backgroundColor: index === 0 ? alpha('#4CAF50', 0.1) : 'transparent',
                            '&:hover': { 
                              backgroundColor: index === 0 
                                ? alpha('#4CAF50', 0.15)
                                : alpha('#2E7D32', 0.04)
                            },
                            transition: 'background-color 0.2s ease',
                          }}
                        >
                          <TableCell sx={{ 
                            fontWeight: index === 0 ? 'bold' : 'normal',
                            fontSize: '1rem',
                            py: 2
                          }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <CropIcon color={index === 0 ? "success" : "primary"} />
                              {crop.crop}
                              {index === 0 && (
                                <Chip 
                                  label="Best Match" 
                                  color="success" 
                                  size="small" 
                                  sx={{ ml: 1, fontWeight: 'bold' }}
                                />
                              )}
                            </Box>
                          </TableCell>
                          <TableCell sx={{ py: 2 }}>
                            <ScoreChip 
                              label={crop.soil_score} 
                              score={crop.soil_score}
                              size="small"
                            />
                          </TableCell>
                          <TableCell sx={{ py: 2 }}>
                            <ScoreChip 
                              label={crop.climate_score} 
                              score={crop.climate_score}
                              size="small"
                            />
                          </TableCell>
                          <TableCell sx={{ py: 2 }}>
                            <ScoreChip 
                              label={crop.yield_score} 
                              score={crop.yield_score}
                              size="small"
                            />
                          </TableCell>
                          <TableCell sx={{ py: 2 }}>
                            <ScoreChip 
                              label={crop.market_score} 
                              score={crop.market_score}
                              size="small"
                            />
                          </TableCell>
                          <TableCell sx={{ py: 2 }}>
                            <ScoreChip 
                              label={crop.roi_score} 
                              score={crop.roi_score}
                              size="small"
                            />
                          </TableCell>
                          <TableCell sx={{ py: 2 }}>
                            <ScoreChip 
                              label={crop.final_score} 
                              score={crop.final_score}
                              size="medium"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </AgroCard>
          </Fade>
        )}
      </Container>
    </>
  );
}