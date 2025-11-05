import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Avatar, Card, CardContent, Chip, Grid, Button, Alert, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

// Multiple API endpoints to try in order
const API_ENDPOINTS = [
  'https://be.phucncc.com',
  'http://be.phucncc.com',
  'https://localhost',
  'http://localhost',
  'https://127.0.0.1',
  'http://127.0.0.1',
  'https://be.localhost',
  'http://be.localhost'
];

// Helper function to try fetching from multiple endpoints
const fetchFromMultipleEndpoints = async (path, options = {}) => {
  let lastError = null;
  
  for (const baseUrl of API_ENDPOINTS) {
    try {
      console.log(`Đang thử kết nối đến: ${baseUrl}${path}`);
      const response = await fetch(`${baseUrl}${path}`, {
        ...options,
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });
      
      if (response.ok) {
        console.log(`✅ Kết nối thành công tới: ${baseUrl}${path}`);
        return { response, baseUrl };
      }
      
      console.log(`❌ Không thành công với ${baseUrl}${path}: ${response.status}`);
    } catch (error) {
      console.log(`❌ Lỗi kết nối ${baseUrl}${path}:`, error.message);
      lastError = error;
    }
  }
  
  throw new Error(lastError?.message || 'Không thể kết nối đến bất kỳ backend nào');
};

// Styled components for animations and modern design
const HeroSection = styled(Box)(({ theme }) => ({
  minHeight: '80vh',
  background: 'linear-gradient(100deg, #667eea 0%, #764ba2 100%)',
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
  }
}));

const FloatingCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(20px)',
  borderRadius: '20px',
  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-10px)',
    boxShadow: '0 30px 60px rgba(0,0,0,0.2)',
  }
}));

const AnimatedAvatar = styled(Avatar)(({ theme }) => ({
  width: 150,
  height: 150,
  margin: '0 auto 24px',
  border: '4px solid rgba(255,255,255,0.8)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.1) rotate(5deg)',
  }
}));

const SkillChip = styled(Chip)(({ theme }) => ({
  margin: '4px',
  background: 'linear-gradient(45deg, #667eea, #764ba2)',
  color: 'white',
  fontWeight: 'bold',
  '&:hover': {
    transform: 'scale(1.05)',
  },
  transition: 'all 0.2s ease',
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
  borderRadius: '25px',
  padding: '12px 30px',
  color: 'white',
  fontWeight: 'bold',
  fontSize: '16px',
  '&:hover': {
    background: 'linear-gradient(45deg, #FF5252, #26C6DA)',
    transform: 'translateY(-2px)',
    boxShadow: '0 10px 20px rgba(255,107,107,0.3)',
  },
  transition: 'all 0.3s ease',
}));

function HomePage() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connectedBackend, setConnectedBackend] = useState(null);

  const skills = [
    'React', 'Node.js', 'Docker', 'Kubernetes', 'DevOps', 'Security', 
    'CI/CD', 'AWS', 'Python', 'JavaScript', 'MongoDB', 'PostgreSQL'
  ];

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { response, baseUrl } = await fetchFromMultipleEndpoints('/data', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setUserData(data);
        setConnectedBackend(baseUrl);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
        setConnectedBackend(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <HeroSection>
      <Container maxWidth="md">
        <FloatingCard>
          <CardContent sx={{ p: 6, textAlign: 'center' }}>
            <AnimatedAvatar
              src="/logo512.png" // Using React logo as placeholder
              alt="Nguyễn Minh Phúc"
            >
              NMP
            </AnimatedAvatar>
            
            <Typography 
              variant="h2" 
              component="h1" 
              gutterBottom
              sx={{ 
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2
              }}
            >
              Nguyễn Minh Phúc
            </Typography>
            
            <Typography 
              variant="h5" 
              color="textSecondary" 
              gutterBottom
              sx={{ mb: 3 }}
            >
              Sinh viên năm thứ 4 - Khoa học Máy tính
            </Typography>
            
            <Box sx={{ mb: 4 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#667eea',
                  fontWeight: 'bold',
                  mb: 2
                }}
              >
                🚀 Đang theo đuổi DevSecOps
              </Typography>
              <Typography variant="body1" color="textSecondary" sx={{ maxWidth: 600, mx: 'auto', lineHeight: 1.8 }}>
                Đam mê với việc xây dựng và triển khai các hệ thống an toàn, hiệu quả. 
                Luôn học hỏi các công nghệ mới trong lĩnh vực DevOps, Security và Cloud Computing.
              </Typography>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#667eea', fontWeight: 'bold' }}>
                🛠️ Kỹ năng & Công nghệ
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                {skills.map((skill) => (
                  <SkillChip 
                    key={skill} 
                    label={skill} 
                    variant="filled"
                  />
                ))}
              </Box>
            </Box>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={4}>
                <Box sx={{ p: 2 }}>
                  <Typography variant="h6" sx={{ color: '#4ECDC4', fontWeight: 'bold' }}>
                    🎯 Mục tiêu
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Trở thành DevSecOps Engineer chuyên nghiệp
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ p: 2 }}>
                  <Typography variant="h6" sx={{ color: '#FF6B6B', fontWeight: 'bold' }}>
                    🔒 Chuyên môn
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Security, Automation, Cloud Infrastructure
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ p: 2 }}>
                  <Typography variant="h6" sx={{ color: '#764ba2', fontWeight: 'bold' }}>
                    📚 Học tập
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Luôn cập nhật công nghệ mới nhất
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <GradientButton 
                onClick={() => navigate('/login')}
                size="large"
              >
                Đăng Nhập Quản Trị
              </GradientButton>
            </Box>

            {/* API Data Section */}
            <Box sx={{ mt: 4, pt: 4, borderTop: '2px solid #f0f0f0' }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#667eea',
                  fontWeight: 'bold',
                  mb: 2
                }}
              >
                📊 Dữ liệu từ Backend API
              </Typography>
              
              {connectedBackend && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  Đã kết nối thành công tới: <strong>{connectedBackend}</strong>
                </Alert>
              )}
              
              {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                  <CircularProgress />
                </Box>
              )}
              
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  Lỗi khi tải dữ liệu: {error}
                </Alert>
              )}
              
              {!loading && !error && userData.length === 0 && (
                <Alert severity="info">
                  Không có dữ liệu người dùng
                </Alert>
              )}
              
              {!loading && !error && userData.length > 0 && (
                <Grid container spacing={2}>
                  {userData.map((user) => (
                    <Grid item xs={12} sm={6} md={4} key={user.id}>
                      <Card 
                        sx={{ 
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: 'white',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'scale(1.05)',
                            boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
                          }
                        }}
                      >
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            {user.name}
                          </Typography>
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>
                            {user.email}
                          </Typography>
                          <Typography variant="caption" sx={{ opacity: 0.7, mt: 1, display: 'block' }}>
                            ID: {user.id}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          </CardContent>
        </FloatingCard>
      </Container>
    </HeroSection>
  );
}

export default HomePage;