import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Container,
  Alert,
  InputAdornment,
  IconButton,
  Avatar,
  Fade,
  Slide
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Person,
  Lock,
  AdminPanelSettings
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

// Styled components for modern design
const LoginContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-50%',
    left: '-50%',
    width: '200%',
    height: '200%',
    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
    backgroundSize: '50px 50px',
    animation: 'float 20s infinite linear',
  },
  '@keyframes float': {
    '0%': { transform: 'translate(0, 0) rotate(0deg)' },
    '100%': { transform: 'translate(-50px, -50px) rotate(360deg)' },
  }
}));

const LoginCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(20px)',
  borderRadius: '20px',
  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
  border: '1px solid rgba(255,255,255,0.2)',
  minWidth: 400,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 30px 60px rgba(0,0,0,0.15)',
  }
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    transition: 'all 0.3s ease',
    '&:hover fieldset': {
      borderColor: '#2a5298',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#1e3c72',
      borderWidth: '2px',
    },
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#1e3c72',
  }
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #1e3c72, #2a5298)',
  borderRadius: '12px',
  padding: '12px 0',
  fontSize: '16px',
  fontWeight: 'bold',
  textTransform: 'none',
  '&:hover': {
    background: 'linear-gradient(45deg, #2a5298, #1e3c72)',
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(30,60,114,0.3)',
  },
  '&:active': {
    transform: 'translateY(0)',
  },
  transition: 'all 0.3s ease',
}));

const BackButton = styled(Button)(({ theme }) => ({
  position: 'absolute',
  top: 30,
  left: 30,
  borderRadius: '25px',
  padding: '8px 20px',
  background: 'rgba(255,255,255,0.2)',
  color: 'white',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255,255,255,0.3)',
  '&:hover': {
    background: 'rgba(255,255,255,0.3)',
    transform: 'translateY(-2px)',
  },
  transition: 'all 0.3s ease',
}));

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simple authentication logic (you can replace with real API call)
      if (username === 'admin' && password === 'admin123') {
        navigate('/admin');
      } else {
        setError('Tên đăng nhập hoặc mật khẩu không đúng');
      }
    } catch (err) {
      setError('Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer>
      <BackButton onClick={() => navigate('/')}>
        ← Về Trang Chủ
      </BackButton>
      
      <Container maxWidth="sm">
        <Fade in timeout={800}>
          <LoginCard>
            <CardContent sx={{ p: 5 }}>
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Slide direction="down" in timeout={1000}>
                  <Avatar 
                    sx={{ 
                      width: 80, 
                      height: 80, 
                      mx: 'auto', 
                      mb: 2,
                      background: 'linear-gradient(45deg, #1e3c72, #2a5298)',
                      boxShadow: '0 8px 25px rgba(30,60,114,0.3)',
                    }}
                  >
                    <AdminPanelSettings sx={{ fontSize: 40 }} />
                  </Avatar>
                </Slide>
                
                <Typography 
                  variant="h4" 
                  component="h1" 
                  gutterBottom
                  sx={{ 
                    fontWeight: 'bold',
                    background: 'linear-gradient(45deg, #1e3c72, #2a5298)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Đăng Nhập Quản Trị
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Vui lòng đăng nhập để truy cập hệ thống quản lý
                </Typography>
              </Box>

              {error && (
                <Fade in>
                  <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
                    {error}
                  </Alert>
                </Fade>
              )}

              <form onSubmit={handleSubmit}>
                <Box sx={{ mb: 3 }}>
                  <StyledTextField
                    fullWidth
                    label="Tên đăng nhập"
                    variant="outlined"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person sx={{ color: '#666' }} />
                        </InputAdornment>
                      ),
                    }}
                    disabled={loading}
                  />
                </Box>

                <Box sx={{ mb: 4 }}>
                  <StyledTextField
                    fullWidth
                    label="Mật khẩu"
                    type={showPassword ? 'text' : 'password'}
                    variant="outlined"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock sx={{ color: '#666' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            disabled={loading}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    disabled={loading}
                  />
                </Box>

                <GradientButton
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading || !username || !password}
                  sx={{ mb: 2 }}
                >
                  {loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
                </GradientButton>
              </form>

              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Typography variant="caption" color="textSecondary">
                  Demo: admin / admin123
                </Typography>
              </Box>
            </CardContent>
          </LoginCard>
        </Fade>
      </Container>
    </LoginContainer>
  );
}

export default LoginPage;