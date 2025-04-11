import React, { useState } from 'react';
import { Button, Typography, Box, Grid, Alert, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { apiCall, useWindowDimensions } from '../helper';
import EventNoteIcon from '@mui/icons-material/EventNote';

export const ChangeServerPage: React.FC = () => {
  const [server, setServer] = useState('local');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();
  const { width } = useWindowDimensions();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const address = formData.get('address')?.toString().trim();
    const port = formData.get('port')?.toString().trim();
    const ip = formData.get('ip')?.toString().trim();
    const password = formData.get('password')?.toString().trim();

    const response = await apiCall('POST', 'auth/changeServer', {
      address,
      port,
      ip,
      password,
    });
    if (response.success) {
      setSuccess('Database link successfully! Please complete your profile.');
      setError(null);
      navigate('/profile');
    } else {
      setError(response.message || 'Failed.');
      setSuccess(null);
    }
  };

  const isSmallScreen = width < 960;

  return (
    <Grid container sx={{ height: '100vh' }}>
      {isSmallScreen ? (
        <>
          {/* Header */}
          <Box sx={{ height: '4%', width: '100%', backgroundColor: '#0275FF', p: 1, textAlign: 'center', color: '#fff' }}>
            <Typography variant="h6" sx={{ fontSize: '1.4rem' }}>Welcome to docly</Typography>
          </Box>

          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2 }}>
            <Box sx={{ width: '90%', textAlign: 'center' }}>
              <EventNoteIcon sx={{ fontSize: 50, marginBottom: '16px' }} />
              <Typography variant="h4" gutterBottom sx={{ fontSize: '1.5rem' }}>
                Select a Server
              </Typography>
              {error && <Alert severity="error" sx={{ marginTop: '16px' }}>{error}</Alert>}
              {success && <Alert severity="success" sx={{ marginTop: '16px' }}>{success}</Alert>}
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      label="Server Address"
                      name="address"
                      required
                      fullWidth
                      sx={{ '& .MuiInputLabel-asterisk': { color: 'red' } }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      label="Port"
                      name="port"
                      required
                      fullWidth
                      sx={{ '& .MuiInputLabel-asterisk': { color: 'red' } }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      label="IP"
                      name="ip"
                      required
                      fullWidth
                      sx={{ '& .MuiInputLabel-asterisk': { color: 'red' } }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      label="Password"
                      name="password"
                      required
                      type="password"
                      fullWidth
                      sx={{ '& .MuiInputLabel-asterisk': { color: 'red' } }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                      Configure
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Grid>

          {/* Footer */}
          <Box sx={{ height: '3%', width: '100%', backgroundColor: '#0275FF', p: 1, textAlign: 'center', color: '#fff', mt: 'auto' }}>
            <Typography variant="body2">&copy; 2024 docly. All rights reserved.</Typography>
          </Box>
        </>
      ) : (
        <>
          {/* Left Side */}
          <Grid item xs={12} md={5}>
            <Box sx={{ display: 'flex', height: '100%', flexDirection: 'row' }}>
              <Box
                sx={{
                  width: '90%',
                  backgroundColor: '#0275FF',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: '#fff',
                  textAlign: 'center',
                  p: 2,
                }}
              >
                <Box>
                  <EventNoteIcon sx={{ fontSize: 100, marginBottom: '16px' }} />
                  <Typography variant="h4" gutterBottom>docly</Typography>
                  <Typography variant="subtitle1">Simple. Fast. Convenient.</Typography>
                  <Typography variant="subtitle1">Schedule your appointments, no fuss.</Typography>
                </Box>
              </Box>
              <Box sx={{ width: '3%', backgroundColor: '#5AAEFF' }} />
              <Box sx={{ width: '3%', backgroundColor: '#B3D9FF' }} />
            </Box>
          </Grid>

          {/* Right Side */}
          <Grid item xs={12} md={7} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Box sx={{ width: '50%', maxWidth: '300px' }}>
              <Typography variant="h4" gutterBottom sx={{ textAlign: 'center' }}>Select a Server</Typography>
              {error && <Alert severity="error" sx={{ marginTop: '16px' }}>{error}</Alert>}
              {success && <Alert severity="success" sx={{ marginTop: '16px' }}>{success}</Alert>}
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      label="Server Address"
                      name="address"
                      required
                      fullWidth
                      sx={{ '& .MuiInputLabel-asterisk': { color: 'red' } }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      label="Port"
                      name="port"
                      required
                      fullWidth
                      sx={{ '& .MuiInputLabel-asterisk': { color: 'red' } }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      label="IP"
                      name="ip"
                      required
                      fullWidth
                      sx={{ '& .MuiInputLabel-asterisk': { color: 'red' } }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      label="Password"
                      name="password"
                      required
                      type="password"
                      fullWidth
                      sx={{ '& .MuiInputLabel-asterisk': { color: 'red' } }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                      Configure
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Grid>
        </>
      )}
    </Grid>
  );
};
