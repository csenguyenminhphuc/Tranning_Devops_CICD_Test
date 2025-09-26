import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography,
  Container,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  IconButton,
  Fade,
  Alert,
  Snackbar,
  Grid,
  Avatar,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Paper,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Fab
} from '@mui/material';
import { 
  Home, 
  AdminPanelSettings,
  Dashboard,
  TrendingUp,
  People,
  Security,
  Info,
  Computer,
  Storage,
  NetworkCheck,
  Timeline,
  CheckCircle,
  Warning,
  Error as ErrorIcon,
  Code,
  Cloud,
  Add,
  Edit,
  Delete,
  Refresh,
  Person,
  Email,
  DataUsage
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

// API base URL - detect environment and use appropriate backend URL
const getApiUrl = () => {
  const hostname = window.location.hostname;
  
  // If accessing from localhost/127.0.0.1, use be.localhost
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'https://be.localhost';
  }
  
  // If accessing from phucncc.com, use be.phucncc.com
  if (hostname === 'phucncc.com') {
    return 'https://be.phucncc.com';
  }
  
  // For IP access, use same IP with different port or subdomain
  // For now, fallback to be.phucncc.com
  return 'https://be.phucncc.com';
};

const API_BASE_URL = getApiUrl();

// System status and info data
const systemInfo = {
  serverStatus: 'Online',
  uptime: '15 days, 4 hours',
  version: 'v2.1.0',
  environment: 'Production',
  database: 'Connected',
  lastBackup: '2025-09-25 02:00:00'
};

// Styled components
const AdminContainer = styled(Box)(({ theme }) => ({
  minHeight: '80vh',
  background: 'linear-gradient(100deg, #667eea 0%, #764ba2 100%)',
}));

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: '20px',
  boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
  border: '1px solid rgba(255,255,255,0.18)',
  background: 'rgba(255,255,255,0.95)',
  backdropFilter: 'blur(10px)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 25px 45px rgba(0,0,0,0.15)',
  },
}));

const StatCard = styled(Card)(({ theme }) => ({
  borderRadius: '15px',
  padding: '20px',
  background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255,255,255,0.2)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0 15px 35px rgba(0,0,0,0.15)',
  },
}));

const InfoChip = styled(Chip)(({ theme }) => ({
  borderRadius: '20px',
  fontWeight: 'bold',
  '&.online': {
    backgroundColor: '#4caf50',
    color: 'white',
  },
  '&.warning': {
    backgroundColor: '#ff9800',
    color: 'white',
  },
  '&.error': {
    backgroundColor: '#f44336',
    color: 'white',
  },
}));

function AdminPage() {
  const [data, setData] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    systemLoad: 67,
    memoryUsage: 78,
    diskUsage: 45
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // CRUD states
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [showDataManagement, setShowDataManagement] = useState(false);
  
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const url = `${API_BASE_URL}/data`;
    console.log('Fetching from:', url);
    
    try {
      const response = await fetch(url);
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const userData = await response.json();
      console.log('Data received:', userData);
      setData(userData);
      setError(null);
      
      // Update stats based on real data
      setStats(prev => ({
        ...prev,
        totalUsers: userData.length,
        activeUsers: Math.floor(userData.length * 0.72) // 72% active users assumption
      }));
      
      setSnackbar({ open: true, message: 'Dữ liệu đã được tải thành công!', severity: 'success' });
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
      setSnackbar({ open: true, message: `Lỗi: ${error.message}`, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // CRUD Functions
  const handleOpenAddDialog = () => {
    setEditMode(false);
    setEditId(null);
    setName('');
    setEmail('');
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (user) => {
    setEditMode(true);
    setEditId(user.id);
    setName(user.name || '');
    setEmail(user.email || '');
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditMode(false);
    setEditId(null);
    setName('');
    setEmail('');
  };

  const addUser = async () => {
    if (!name || !email) {
      setSnackbar({ open: true, message: 'Vui lòng điền đầy đủ thông tin', severity: 'warning' });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/add-users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add user');
      }
      
      setSnackbar({ open: true, message: 'Người dùng đã được thêm thành công!', severity: 'success' });
      handleCloseDialog();
      fetchData();
    } catch (error) {
      console.error('Error:', error);
      setSnackbar({ open: true, message: `Lỗi thêm người dùng: ${error.message}`, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async () => {
    if (!name || !email) {
      setSnackbar({ open: true, message: 'Vui lòng điền đầy đủ thông tin', severity: 'warning' });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/update-user/${editId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update user');
      }
      
      setSnackbar({ open: true, message: 'Người dùng đã được cập nhật thành công!', severity: 'success' });
      handleCloseDialog();
      fetchData();
    } catch (error) {
      console.error('Error:', error);
      setSnackbar({ open: true, message: `Lỗi cập nhật người dùng: ${error.message}`, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/delete-user/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete user');
      }
      
      setSnackbar({ open: true, message: 'Người dùng đã được xóa thành công!', severity: 'success' });
      fetchData();
    } catch (error) {
      console.error('Error:', error);
      setSnackbar({ open: true, message: `Lỗi xóa người dùng: ${error.message}`, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <AdminContainer>
      <AppBar 
        position="sticky" 
        sx={{ 
          background: 'linear-gradient(45deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1))',
          backdropFilter: 'blur(10px)',
          boxShadow: 'none',
          border: '1px solid rgba(255,255,255,0.2)'
        }}
      >
        <Toolbar>
          <Dashboard sx={{ mr: 2, color: 'white' }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold', color: 'white' }}>
            Dashboard Quản Trị
          </Typography>
          <IconButton sx={{ color: 'white' }} onClick={() => navigate('/')}>
            <Home />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Fade in timeout={800}>
          <div>
            {/* Welcome Section */}
            <StyledCard sx={{ mb: 4, background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', mr: 2, width: 60, height: 60 }}>
                    <AdminPanelSettings sx={{ fontSize: 30, color: 'white' }} />
                  </Avatar>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white', mb: 1 }}>
                      Chào mừng, Admin!
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                      Nguyễn Minh Phúc - DevSecOps Engineer
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </StyledCard>

            {/* Stats Grid */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                    <People sx={{ fontSize: 40, color: '#4caf50', mr: 2 }} />
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                        {stats.totalUsers.toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Tổng người dùng
                      </Typography>
                    </Box>
                  </Box>
                </StatCard>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <StatCard>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                    <TrendingUp sx={{ fontSize: 40, color: '#2196f3', mr: 2 }} />
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2196f3' }}>
                        {stats.activeUsers.toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Đang hoạt động
                      </Typography>
                    </Box>
                  </Box>
                </StatCard>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <StatCard>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                    <Computer sx={{ fontSize: 40, color: '#ff9800', mr: 2 }} />
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ff9800' }}>
                        {stats.systemLoad}%
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Tải hệ thống
                      </Typography>
                    </Box>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={stats.systemLoad} 
                    sx={{ 
                      height: 8, 
                      borderRadius: 4,
                      bgcolor: 'rgba(255,152,0,0.2)',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: '#ff9800'
                      }
                    }} 
                  />
                </StatCard>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <StatCard>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                    <Storage sx={{ fontSize: 40, color: '#9c27b0', mr: 2 }} />
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#9c27b0' }}>
                        {stats.memoryUsage}%
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Bộ nhớ
                      </Typography>
                    </Box>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={stats.memoryUsage} 
                    sx={{ 
                      height: 8, 
                      borderRadius: 4,
                      bgcolor: 'rgba(156,39,176,0.2)',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: '#9c27b0'
                      }
                    }} 
                  />
                </StatCard>
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              {/* System Information */}
              <Grid item xs={12} md={6}>
                <StyledCard>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                      <Info sx={{ mr: 2, color: '#1976d2' }} />
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                        Thông Tin Hệ Thống
                      </Typography>
                    </Box>
                    
                    <List sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <ListItem sx={{ justifyContent: 'center', textAlign: 'center' }}>
                        <ListItemIcon>
                          <NetworkCheck sx={{ color: '#4caf50' }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Trạng thái server"
                          secondary={
                            <InfoChip 
                              label={systemInfo.serverStatus}
                              size="small"
                              className="online"
                            />
                          }
                        />
                      </ListItem>

                      <ListItem sx={{ justifyContent: 'center', textAlign: 'center' }}>
                        <ListItemIcon>
                          <Timeline sx={{ color: '#2196f3' }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Thời gian hoạt động"
                          secondary={systemInfo.uptime}
                        />
                      </ListItem>

                      <ListItem sx={{ justifyContent: 'center', textAlign: 'center' }}>
                        <ListItemIcon>
                          <Code sx={{ color: '#9c27b0' }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Phiên bản hệ thống"
                          secondary={systemInfo.version}
                        />
                      </ListItem>

                      <ListItem sx={{ justifyContent: 'center', textAlign: 'center' }}>
                        <ListItemIcon>
                          <Cloud sx={{ color: '#ff9800' }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Môi trường"
                          secondary={systemInfo.environment}
                        />
                      </ListItem>

                      <ListItem sx={{ justifyContent: 'center', textAlign: 'center' }}>
                        <ListItemIcon>
                          <Storage sx={{ color: '#4caf50' }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Cơ sở dữ liệu"
                          secondary={
                            <InfoChip 
                              label={systemInfo.database}
                              size="small"
                              className="online"
                            />
                          }
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </StyledCard>
              </Grid>

              {/* Data Management Button */}
              <Grid item xs={12} md={6}>
                <StyledCard>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <DataUsage sx={{ mr: 2, color: '#1976d2' }} />
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                          Quản Lý Dữ Liệu Người Dùng
                        </Typography>
                      </Box>
                      <Button
                        variant="contained"
                        startIcon={showDataManagement ? <Dashboard /> : <People />}
                        onClick={() => setShowDataManagement(!showDataManagement)}
                        sx={{
                          background: 'linear-gradient(45deg, #667eea, #764ba2)',
                          borderRadius: '10px',
                          textTransform: 'none',
                          fontWeight: 'bold',
                          '&:hover': {
                            background: 'linear-gradient(45deg, #5a67d8, #6b46c1)',
                            transform: 'translateY(-2px)',
                          },
                        }}
                      >
                        {showDataManagement ? 'Ẩn Quản Lý' : 'Mở Quản Lý'}
                      </Button>
                    </Box>

                    {showDataManagement && (
                      <Box>
                        {/* Add User Button */}
                        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
                            Danh Sách Người Dùng ({data.length})
                          </Typography>
                          <Button
                            variant="contained"
                            startIcon={<Add />}
                            onClick={handleOpenAddDialog}
                            disabled={loading}
                            sx={{
                              background: 'linear-gradient(45deg, #4caf50, #66bb6a)',
                              borderRadius: '10px',
                              textTransform: 'none',
                              fontWeight: 'bold',
                              '&:hover': {
                                background: 'linear-gradient(45deg, #43a047, #5cb85c)',
                                transform: 'translateY(-2px)',
                              },
                            }}
                          >
                            Thêm Người Dùng
                          </Button>
                        </Box>

                        {loading ? (
                          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                            <Typography>Đang tải dữ liệu...</Typography>
                          </Box>
                        ) : error ? (
                          <Box sx={{ p: 2, bgcolor: '#ffebee', borderRadius: 2, mb: 2 }}>
                            <Typography color="error">Lỗi: {error}</Typography>
                            <Button 
                              variant="outlined" 
                              startIcon={<Refresh />}
                              onClick={fetchData}
                              sx={{ mt: 1 }}
                            >
                              Thử Lại
                            </Button>
                          </Box>
                        ) : (
                          <TableContainer component={Paper} sx={{ borderRadius: '10px', overflow: 'hidden' }}>
                            <Table>
                              <TableHead>
                                <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                                  <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                                  <TableCell sx={{ fontWeight: 'bold' }}>Tên</TableCell>
                                  <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>Thao Tác</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {data.length > 0 ? (
                                  data.map((user) => (
                                    <TableRow 
                                      key={user.id}
                                      sx={{ 
                                        '&:nth-of-type(odd)': { backgroundColor: '#fafafa' },
                                        '&:hover': { backgroundColor: '#f0f7ff' },
                                        transition: 'all 0.3s ease'
                                      }}
                                    >
                                      <TableCell sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                                        {user.id}
                                      </TableCell>
                                      <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                          <Avatar sx={{ 
                                            bgcolor: '#1976d2', 
                                            width: 32, 
                                            height: 32, 
                                            mr: 1,
                                            fontSize: 14 
                                          }}>
                                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                          </Avatar>
                                          {user.name || 'Không có tên'}
                                        </Box>
                                      </TableCell>
                                      <TableCell>{user.email || 'Không có email'}</TableCell>
                                      <TableCell align="center">
                                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                          <Button
                                            variant="outlined"
                                            size="small"
                                            startIcon={<Edit />}
                                            onClick={() => handleOpenEditDialog(user)}
                                            disabled={loading}
                                            sx={{
                                              borderColor: '#2196f3',
                                              color: '#2196f3',
                                              '&:hover': {
                                                borderColor: '#1976d2',
                                                color: '#1976d2',
                                              },
                                            }}
                                          >
                                            Sửa
                                          </Button>
                                          <Button
                                            variant="outlined"
                                            size="small"
                                            startIcon={<Delete />}
                                            onClick={() => deleteUser(user.id)}
                                            disabled={loading}
                                            sx={{
                                              borderColor: '#f44336',
                                              color: '#f44336',
                                              '&:hover': {
                                                borderColor: '#d32f2f',
                                                color: '#d32f2f',
                                              },
                                            }}
                                          >
                                            Xóa
                                          </Button>
                                        </Box>
                                      </TableCell>
                                    </TableRow>
                                  ))
                                ) : (
                                  <TableRow>
                                    <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                                      <Typography color="textSecondary">
                                        Chưa có dữ liệu người dùng
                                      </Typography>
                                    </TableCell>
                                  </TableRow>
                                )}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        )}
                      </Box>
                    )}
                  </CardContent>
                </StyledCard>
              </Grid>


            </Grid>
          </div>
        </Fade>
      </Container>

      {/* Add/Edit User Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '15px',
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(10px)',
          }
        }}
      >
        <DialogTitle sx={{ 
          textAlign: 'center', 
          fontWeight: 'bold', 
          color: '#1976d2',
          borderBottom: '1px solid #e0e0e0'
        }}>
          {editMode ? 'Chỉnh Sửa Người Dùng' : 'Thêm Người Dùng Mới'}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="Tên"
              value={name}
              onChange={(e) => setName(e.target.value)}
              variant="outlined"
              fullWidth
              disabled={loading}
              InputProps={{
                startAdornment: <Person sx={{ mr: 1, color: '#666' }} />,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  '&:hover fieldset': {
                    borderColor: '#1976d2',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#1976d2',
                    borderWidth: '2px',
                  },
                },
              }}
            />
            
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="outlined"
              fullWidth
              disabled={loading}
              InputProps={{
                startAdornment: <Email sx={{ mr: 1, color: '#666' }} />,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  '&:hover fieldset': {
                    borderColor: '#1976d2',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#1976d2',
                    borderWidth: '2px',
                  },
                },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: '1px solid #e0e0e0' }}>
          <Button 
            onClick={handleCloseDialog}
            variant="outlined"
            disabled={loading}
            sx={{
              borderRadius: '10px',
              borderColor: '#666',
              color: '#666',
              '&:hover': {
                borderColor: '#333',
                color: '#333',
              },
            }}
          >
            Hủy
          </Button>
          <Button 
            onClick={editMode ? updateUser : addUser}
            variant="contained"
            disabled={loading || !name || !email}
            sx={{
              borderRadius: '10px',
              background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1565c0, #1976d2)',
              },
            }}
          >
            {editMode ? 'Cập Nhật' : 'Thêm'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%', borderRadius: '10px' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </AdminContainer>
  );
}

export default AdminPage;