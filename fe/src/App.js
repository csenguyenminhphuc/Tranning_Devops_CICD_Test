import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box, TextField } from '@mui/material';

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

console.log('API_BASE_URL:', API_BASE_URL);

function App() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    const url = `${API_BASE_URL}/data`;
    console.log('Fetching from:', url);
    
    fetch(url)
      .then(response => {
        console.log('Response status:', response.status);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Data received:', data);
        setData(data);
        setError(null);
      })
      .catch(error => {
        console.error('Error:', error);
        setError(error.message);
      });
  };

  const addUser = () => {
    if (!name || !email) {
      setError('Name and email are required');
      return;
    }

    fetch(`${API_BASE_URL}/add-users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to add user');
        }
        return response.json();
      })
      .then(() => {
        setError(null);
        setName('');
        setEmail('');
        fetchData();
      })
      .catch(error => {
        console.error('Error:', error);
        setError(error.message);
      });
  };

  const deleteUser = (id) => {
    fetch(`${API_BASE_URL}/delete-user/${id}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to delete user');
        }
        return response.json();
      })
      .then(() => {
        setError(null);
        fetchData(); // Làm mới bảng
      })
      .catch(error => {
        console.error('Error:', error);
        setError(error.message);
      });
  };

  return (
    <Box sx={{ p: 2, maxWidth: 600, mx: 'auto' }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Button variant="contained" onClick={fetchData}>Fetch Data</Button>
      </Box>
      <Box sx={{ mb: 2 }}>
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ mr: 2 }}
        />
        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mr: 2 }}
        />
        <Button variant="contained" color="secondary" onClick={addUser}>Add User</Button>
      </Box>
      {error && (
        <Box sx={{ color: 'red', mb: 2 }}>
          Error: {error}
        </Box>
      )}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length > 0 ? (
              data.map(row => (
                <TableRow key={row.id}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() => deleteUser(row.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4}>No data</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default App;