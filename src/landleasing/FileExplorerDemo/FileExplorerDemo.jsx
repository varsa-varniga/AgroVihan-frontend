// Installation required:
// npm install @mui/material @emotion/react @emotion/styled @mui/icons-material

import React, { useState } from 'react';
import {
  Box,
  Drawer,
  Paper,
  Typography,
  TextField,
  IconButton,
  Button,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  ToggleButtonGroup,
  ToggleButton,
  InputAdornment,
  Alert,
  AlertTitle,
  Divider,
  Stack,
  AppBar,
  Toolbar,
  ThemeProvider,
  createTheme,
  CssBaseline
} from '@mui/material';
import {
  Folder as FolderIcon,
  FolderOpen as FolderOpenIcon,
  Description as DescriptionIcon,
  Image as ImageIcon,
  VideoLibrary as VideoIcon,
  CloudUpload as UploadIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  GridView as GridIcon,
  ViewList as ListIcon,
  FilterList as FilterIcon,
  ExpandMore as ExpandMoreIcon,
  ChevronRight as ChevronRightIcon,
  MoreVert as MoreVertIcon,
  Check as CheckIcon,
  Schedule as ClockIcon,
  Close as CloseIcon,
  PlayArrow as PlayIcon,
  ErrorOutline as AlertCircleIcon,
  ArrowBack as ArrowBackIcon,
  Menu as MenuIcon
} from '@mui/icons-material';

// Dark theme configuration
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#60a5fa',
      light: '#93c5fd',
      dark: '#3b82f6',
    },
    secondary: {
      main: '#a78bfa',
      light: '#c4b5fd',
      dark: '#8b5cf6',
    },
    background: {
      default: '#0f172a',
      paper: '#1e293b',
    },
    success: {
      main: '#4ade80',
    },
    warning: {
      main: '#fbbf24',
    },
    error: {
      main: '#f87171',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

const mockFileSystem = {
  'Legal Documents': [
    { id: 1, name: 'Land_Ownership_Patta.pdf', type: 'pdf', size: '2.4 MB', date: 'Jan 15, 2025', status: 'verified', folder: 'Legal Documents' },
    { id: 2, name: 'Sale_Deed_Copy.pdf', type: 'pdf', size: '1.8 MB', date: 'Jan 15, 2025', status: 'verified', folder: 'Legal Documents' },
    { id: 3, name: 'Encumbrance_Certificate.pdf', type: 'pdf', size: '900 KB', date: 'Jan 14, 2025', status: 'verified', folder: 'Legal Documents' },
    { id: 4, name: 'Survey_Map.pdf', type: 'pdf', size: '3.2 MB', date: 'Jan 16, 2025', status: 'pending', folder: 'Legal Documents' },
  ],
  'Property Documents': [
    { id: 5, name: 'Soil_Test_Report.pdf', type: 'pdf', size: '1.1 MB', date: 'Jan 16, 2025', status: 'verified', folder: 'Property Documents' },
    { id: 6, name: 'Water_Quality_Report.pdf', type: 'pdf', size: '850 KB', date: 'Jan 16, 2025', status: 'verified', folder: 'Property Documents' },
    { id: 7, name: 'Previous_Crop_Yield_Records.pdf', type: 'pdf', size: '1.5 MB', date: 'Jan 15, 2025', status: 'pending', folder: 'Property Documents' },
  ],
  'Owner Identification': [
    { id: 8, name: 'Aadhaar_Card.pdf', type: 'pdf', size: '500 KB', date: 'Jan 14, 2025', status: 'verified', folder: 'Owner Identification' },
    { id: 9, name: 'Voter_ID.jpg', type: 'image', size: '1.2 MB', date: 'Jan 14, 2025', status: 'verified', folder: 'Owner Identification' },
    { id: 10, name: 'Bank_Cancelled_Cheque.pdf', type: 'pdf', size: '600 KB', date: 'Jan 14, 2025', status: 'verified', folder: 'Owner Identification' },
  ],
  'Photos': [
    { id: 11, name: 'Land_Overview_1.jpg', type: 'image', size: '2.3 MB', date: 'Jan 17, 2025', status: 'verified', folder: 'Photos' },
    { id: 12, name: 'Soil_Closeup.jpg', type: 'image', size: '1.8 MB', date: 'Jan 17, 2025', status: 'pending', folder: 'Photos' },
    { id: 13, name: 'Water_Source_Borewell.jpg', type: 'image', size: '3.1 MB', date: 'Jan 17, 2025', status: 'verified', folder: 'Photos' },
    { id: 14, name: 'Road_Access.jpg', type: 'image', size: '2.5 MB', date: 'Jan 17, 2025', status: 'verified', folder: 'Photos' },
    { id: 15, name: 'Farm_Equipment.jpg', type: 'image', size: '2.8 MB', date: 'Jan 17, 2025', status: 'rejected', folder: 'Photos' },
  ],
  'Videos': [
    { id: 16, name: '360_Land_Tour.mp4', type: 'video', size: '45.2 MB', date: 'Jan 18, 2025', status: 'verified', folder: 'Videos' },
    { id: 17, name: 'Drone_Footage.mp4', type: 'video', size: '67.8 MB', date: 'Jan 18, 2025', status: 'pending', folder: 'Videos' },
  ],
  'Additional Documents': [
    { id: 18, name: 'Lease_Agreement_Template.pdf', type: 'pdf', size: '450 KB', date: 'Jan 13, 2025', status: 'verified', folder: 'Additional Documents' },
    { id: 19, name: 'Farmer_Experience_Certificate.pdf', type: 'pdf', size: '700 KB', date: 'Jan 13, 2025', status: 'verified', folder: 'Additional Documents' },
  ],
};

const FileExplorerDemo = () => {
  const [selectedFolder, setSelectedFolder] = useState('Legal Documents');
  const [expandedFolders, setExpandedFolders] = useState(['Legal Documents']);
  const [viewMode, setViewMode] = useState('grid');
  const [selectedFile, setSelectedFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleBackClick = () => {
    // Add your navigation logic here
    console.log('Back button clicked');
    window.history.back();
    // Example: window.history.back() or navigate to a specific route
  };

  const toggleFolder = (folder) => {
    if (expandedFolders.includes(folder)) {
      setExpandedFolders(expandedFolders.filter(f => f !== folder));
    } else {
      setExpandedFolders([...expandedFolders, folder]);
    }
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf':
        return <DescriptionIcon sx={{ color: '#f87171' }} />;
      case 'image':
        return <ImageIcon sx={{ color: '#60a5fa' }} />;
      case 'video':
        return <VideoIcon sx={{ color: '#a78bfa' }} />;
      default:
        return <DescriptionIcon sx={{ color: '#94a3b8' }} />;
    }
  };

  const getStatusChip = (status) => {
    switch (status) {
      case 'verified':
        return <Chip icon={<CheckIcon />} label="Verified" size="small" color="success" />;
      case 'pending':
        return <Chip icon={<ClockIcon />} label="Pending" size="small" color="warning" />;
      case 'rejected':
        return <Chip icon={<CloseIcon />} label="Rejected" size="small" color="error" />;
      default:
        return null;
    }
  };

  const currentFiles = mockFileSystem[selectedFolder] || [];
  const filteredFiles = currentFiles.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalFiles = Object.values(mockFileSystem).flat().length;

  const drawerWidth = 280;

  const drawer = (
    <>
      <Box sx={{ p: 2.5, borderBottom: 1, borderColor: 'divider' }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
          <FolderOpenIcon color="primary" sx={{ fontSize: 28 }} />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            File Explorer
          </Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
          Land Listing #12345
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Mandya, Karnataka
        </Typography>
      </Box>

      <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
        <Paper
          elevation={0}
          sx={{
            bgcolor: 'primary.dark',
            borderRadius: 2,
            mb: 2,
            p: 1.5,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <FolderOpenIcon sx={{ color: 'primary.light' }} />
            <Typography variant="body2" fontWeight={600} sx={{ flex: 1, color: 'white' }}>
              All Files
            </Typography>
            <Chip 
              label={totalFiles} 
              size="small" 
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.2)', 
                color: 'white',
                fontWeight: 700
              }} 
            />
          </Stack>
        </Paper>

        <List disablePadding>
          {Object.keys(mockFileSystem).map((folder) => (
            <Box key={folder}>
              <ListItemButton
                selected={selectedFolder === folder}
                onClick={() => {
                  setSelectedFolder(folder);
                  if (!expandedFolders.includes(folder)) {
                    toggleFolder(folder);
                  }
                }}
                sx={{ 
                  borderRadius: 2, 
                  mb: 0.5,
                  '&.Mui-selected': {
                    bgcolor: 'primary.dark',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    }
                  }
                }}
              >
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFolder(folder);
                  }}
                  sx={{ mr: 0.5 }}
                >
                  {expandedFolders.includes(folder) ? 
                    <ExpandMoreIcon fontSize="small" /> : 
                    <ChevronRightIcon fontSize="small" />
                  }
                </IconButton>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <FolderOpenIcon fontSize="small" color={selectedFolder === folder ? 'primary' : 'inherit'} />
                </ListItemIcon>
                <ListItemText
                  primary={folder}
                  primaryTypographyProps={{
                    fontSize: 14,
                    fontWeight: selectedFolder === folder ? 700 : 500,
                    noWrap: true
                  }}
                />
                <Chip 
                  label={mockFileSystem[folder].length} 
                  size="small" 
                  sx={{ 
                    minWidth: 32,
                    height: 24,
                    fontWeight: 600
                  }} 
                />
              </ListItemButton>
            </Box>
          ))}
        </List>
      </Box>
    </>
  );

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', height: '100vh' }}>
        {/* App Bar with Back Button */}
        <AppBar 
          position="fixed" 
          sx={{ 
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
            bgcolor: 'background.paper',
            backgroundImage: 'none',
            borderBottom: 1,
            borderColor: 'divider'
          }}
          elevation={0}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            
            <IconButton
              color="primary"
              onClick={handleBackClick}
              sx={{ mr: 2 }}
            >
              <ArrowBackIcon />
            </IconButton>

            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
              {selectedFolder}
            </Typography>

            <Button
              variant="contained"
              startIcon={<UploadIcon />}
              onClick={() => setShowUploadModal(true)}
              size="small"
              sx={{ display: { xs: 'none', md: 'flex' } }}
            >
              Upload Files
            </Button>
          </Toolbar>
        </AppBar>

        {/* Left Sidebar */}
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        >
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>

        {/* Main Content */}
        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1, 
            p: 3, 
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            mt: 8
          }}
        >
          {/* Search and View Controls */}
          <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: 'background.paper' }}>
            <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
              <TextField
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="small"
                sx={{ flex: 1, maxWidth: 400, minWidth: 200 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />

              <Stack direction="row" spacing={1} alignItems="center">
                <ToggleButtonGroup
                  value={viewMode}
                  exclusive
                  onChange={(e, newMode) => newMode && setViewMode(newMode)}
                  size="small"
                >
                  <ToggleButton value="grid">
                    <GridIcon fontSize="small" />
                  </ToggleButton>
                  <ToggleButton value="list">
                    <ListIcon fontSize="small" />
                  </ToggleButton>
                </ToggleButtonGroup>

                <Button variant="outlined" startIcon={<FilterIcon />} size="small">
                  Filter
                </Button>
              </Stack>
            </Stack>
          </Paper>

          {/* File Count */}
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontWeight: 500 }}>
            {filteredFiles.length} {filteredFiles.length === 1 ? 'file' : 'files'}
          </Typography>

          {/* Files Display */}
          {viewMode === 'grid' ? (
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 2.5 }}>
              {filteredFiles.map((file) => (
                <Card
                  key={file.id}
                  onClick={() => setSelectedFile(file)}
                  sx={{ 
                    cursor: 'pointer', 
                    transition: 'all 0.3s',
                    border: '1px solid',
                    borderColor: 'divider',
                    '&:hover': { 
                      transform: 'translateY(-4px)',
                      boxShadow: 6,
                      borderColor: 'primary.main'
                    } 
                  }}
                >
                  <CardMedia
                    sx={{
                      height: 180,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: file.type === 'image'
                        ? 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)'
                        : file.type === 'video'
                        ? 'linear-gradient(135deg, #581c87 0%, #a855f7 100%)'
                        : 'linear-gradient(135deg, #7f1d1d 0%, #ef4444 100%)',
                    }}
                  >
                    {file.type === 'image' ? (
                      <ImageIcon sx={{ fontSize: 72, color: 'rgba(255,255,255,0.9)' }} />
                    ) : file.type === 'video' ? (
                      <VideoIcon sx={{ fontSize: 72, color: 'rgba(255,255,255,0.9)' }} />
                    ) : (
                      <DescriptionIcon sx={{ fontSize: 72, color: 'rgba(255,255,255,0.9)' }} />
                    )}
                  </CardMedia>

                  <CardContent>
                    <Typography variant="body2" fontWeight={600} noWrap title={file.name} gutterBottom>
                      {file.name}
                    </Typography>
                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 1.5 }}>
                      <Typography variant="caption" color="text.secondary">
                        {file.date}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" fontWeight={600}>
                        {file.size}
                      </Typography>
                    </Stack>
                    {getStatusChip(file.status)}
                  </CardContent>

                  <Divider />

                  <CardActions sx={{ justifyContent: 'center', p: 1.5 }}>
                    <IconButton size="small" color="primary">
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="primary">
                      <DownloadIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error">
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </CardActions>
                </Card>
              ))}
            </Box>
          ) : (
            <TableContainer component={Paper} sx={{ border: 1, borderColor: 'divider' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'background.default' }}>
                    <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Size</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredFiles.map((file) => (
                    <TableRow
                      key={file.id}
                      onClick={() => setSelectedFile(file)}
                      sx={{ 
                        cursor: 'pointer', 
                        '&:hover': { bgcolor: 'action.hover' },
                        borderBottom: 1,
                        borderColor: 'divider'
                      }}
                    >
                      <TableCell>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          {getFileIcon(file.type)}
                          <Typography variant="body2" fontWeight={600}>
                            {file.name}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell fontWeight={500}>{file.size}</TableCell>
                      <TableCell>{file.date}</TableCell>
                      <TableCell>{getStatusChip(file.status)}</TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={0.5} justifyContent="center">
                          <IconButton size="small" color="primary">
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" color="primary">
                            <DownloadIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small">
                            <MoreVertIcon fontSize="small" />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>

        {/* File Preview Panel */}
        {selectedFile && (
          <Drawer
            anchor="right"
            variant="temporary"
            open={Boolean(selectedFile)}
            onClose={() => setSelectedFile(null)}
            sx={{
              '& .MuiDrawer-paper': {
                width: { xs: '100%', sm: 400 },
                bgcolor: 'background.paper'
              },
            }}
          >
            <Box sx={{ 
              p: 2, 
              borderBottom: 1, 
              borderColor: 'divider', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              bgcolor: 'background.default'
            }}>
              <Typography variant="h6" fontWeight={700}>
                File Details
              </Typography>
              <IconButton onClick={() => setSelectedFile(null)} size="small">
                <CloseIcon />
              </IconButton>
            </Box>

            <Box sx={{ flex: 1, overflowY: 'auto', p: 3 }}>
              <Paper
                elevation={0}
                sx={{
                  height: 220,
                  borderRadius: 3,
                  mb: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: selectedFile.type === 'image'
                    ? 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)'
                    : selectedFile.type === 'video'
                    ? 'linear-gradient(135deg, #581c87 0%, #a855f7 100%)'
                    : 'linear-gradient(135deg, #7f1d1d 0%, #ef4444 100%)',
                }}
              >
                {selectedFile.type === 'image' ? (
                  <ImageIcon sx={{ fontSize: 80, color: 'rgba(255,255,255,0.9)' }} />
                ) : selectedFile.type === 'video' ? (
                  <>
                    <VideoIcon sx={{ fontSize: 80, color: 'rgba(255,255,255,0.9)', mb: 2 }} />
                    <Button 
                      variant="contained" 
                      startIcon={<PlayIcon />} 
                      sx={{ 
                        bgcolor: 'rgba(255,255,255,0.2)',
                        backdropFilter: 'blur(10px)',
                        '&:hover': {
                          bgcolor: 'rgba(255,255,255,0.3)'
                        }
                      }}
                    >
                      Play Video
                    </Button>
                  </>
                ) : (
                  <DescriptionIcon sx={{ fontSize: 80, color: 'rgba(255,255,255,0.9)' }} />
                )}
              </Paper>

              <Typography variant="h6" fontWeight={700} gutterBottom sx={{ wordBreak: 'break-word', mb: 3 }}>
                {selectedFile.name}
              </Typography>

              <Stack spacing={2} sx={{ mb: 4 }}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary" fontWeight={500}>Size:</Typography>
                  <Typography variant="body2" fontWeight={700}>{selectedFile.size}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary" fontWeight={500}>Uploaded:</Typography>
                  <Typography variant="body2" fontWeight={700}>{selectedFile.date}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary" fontWeight={500}>Type:</Typography>
                  <Typography variant="body2" fontWeight={700}>{selectedFile.type.toUpperCase()}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" color="text.secondary" fontWeight={500}>Status:</Typography>
                  {getStatusChip(selectedFile.status)}
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary" fontWeight={500}>Folder:</Typography>
                  <Typography variant="body2" fontWeight={700} align="right">{selectedFile.folder}</Typography>
                </Stack>
              </Stack>

              <Stack spacing={1.5}>
                <Button variant="contained" startIcon={<DownloadIcon />} fullWidth size="large">
                  Download
                </Button>
                <Button variant="outlined" startIcon={<RefreshIcon />} fullWidth size="large">
                  Replace File
                </Button>
                <Button variant="outlined" color="error" startIcon={<DeleteIcon />} fullWidth size="large">
                  Delete
                </Button>
              </Stack>

              {selectedFile.status === 'rejected' && (
                <Alert severity="error" icon={<AlertCircleIcon />} sx={{ mt: 3 }}>
                  <AlertTitle fontWeight={700}>Rejection Reason</AlertTitle>
                  Document is unclear/blurry. Please upload a clearer version.
                </Alert>
              )}
            </Box>
          </Drawer>
        )}

        {/* Upload Modal */}
        <Dialog 
          open={showUploadModal} 
          onClose={() => setShowUploadModal(false)} 
          maxWidth="sm" 
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3
            }
          }}
        >
          <DialogTitle>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" fontWeight={700}>Upload Files</Typography>
              <IconButton onClick={() => setShowUploadModal(false)} size="small">
                <CloseIcon />
              </IconButton>
            </Stack>
          </DialogTitle>

          <DialogContent>
            <Paper
              variant="outlined"
              sx={{
                border: '2px dashed',
                borderColor: 'primary.main',
                borderRadius: 3,
                p: 5,
                textAlign: 'center',
                cursor: 'pointer',
                bgcolor: 'background.default',
                transition: 'all 0.3s',
                '&:hover': {
                  borderColor: 'primary.light',
                  bgcolor: 'action.hover'
                }
              }}
            >
              <UploadIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Drag & Drop Files Here
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                or
              </Typography>
              <Button variant="contained" size="large" sx={{ mb: 3 }}>
                Browse Files
              </Button>
              <Typography variant="caption" color="text.secondary" display="block">
                Accepted: PDF, JPG, PNG, MP4
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Max Size: 5MB per file
              </Typography>
            </Paper>
          </DialogContent>

          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button onClick={() => setShowUploadModal(false)} variant="outlined" fullWidth size="large">
              Cancel
            </Button>
            <Button variant="contained" fullWidth size="large">
              Upload
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
};

export default FileExplorerDemo;