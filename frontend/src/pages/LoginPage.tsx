import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Grid, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { apiCall, useWindowDimensions } from '../helper';
import EventNoteIcon from '@mui/icons-material/EventNote';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { width } = useWindowDimensions();

  // Handle Login through api call, if successful redirect to landing page.
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const loginData = { email, password };

    try {
      const response = await apiCall('POST', 'auth/login', loginData);
      if (response.success) {
        console.log('Logged in successfully');
        setError(null);
        localStorage.setItem('token', response.token);
        localStorage.setItem('curUserId', response.user_id);
        navigate('/landing');
      } else {
        setError(response.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('An error occurred while logging in. Please try again later.');
    }
  };
  const isSmallScreen = width < 960;

  // Render based on if mobile or big screen
  return (
    <Grid container sx={{ height: '100vh' }}>
      {isSmallScreen ? (
        <>
          {/* Header */}
          <Box sx={{ height: "4%",width: '100%', backgroundColor: '#0275FF', p: 1, textAlign: 'center', color: '#fff' }}>
            <Typography variant="h6" sx={{fontSize: "1.4rem"}}>Welcome to docly</Typography>
          </Box>

          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2 }}>
            <Box sx={{ width: '90%', textAlign: 'center' }}>
              <EventNoteIcon sx={{ fontSize: 50, marginBottom: '16px' }} />
              <Typography variant="h4" gutterBottom sx={{ fontSize: '1.5rem' }}>
                docly
              </Typography>
              <Typography variant="subtitle1" sx={{ fontSize: '0.875rem' }}>
                Simple. Fast. Convenient.
              </Typography>
              <Typography variant="subtitle1" sx={{ fontSize: '0.75rem' }}>
                Schedule your appointments, no fuss.
              </Typography>

              <form onSubmit={handleLogin} style={{ marginTop: '20px' }}>
                <TextField
                  label="Email"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  sx={{ fontSize: '0.875rem' }}
                />
                <TextField
                  label="Password"
                  type="password"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  sx={{ fontSize: '0.875rem' }}
                />
                {error && <Alert severity="error" sx={{ marginTop: '16px' }}>{error}</Alert>}
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  sx={{
                    marginTop: '24px',
                    width: '50%',
                    display: 'block',
                    mx: 'auto',
                    fontSize: '0.875rem'
                  }}
                >
                  LOGIN
                </Button>
              </form>
              <Box sx={{ marginTop: '16px', textAlign: 'center' }}>
                <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                  Don't have an account? <a href="/signup">Register</a>
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                  Forgot your password? <a href="/reset">Reset</a>
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                  Verify email? <a href="/verify-email">Here</a>
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Footer */}
          <Box sx={{ height: "3%", width: '100%', backgroundColor: '#0275FF', p: 1, textAlign: 'center', color: '#fff', mt: 'auto' }}>
            <Typography variant="body2">&copy; 2024 docly. All rights reserved.</Typography>
          </Box>
        </>
      ) : (
        <>
          {/* Left Side logo and intro */}
          <Grid
            item
            xs={12}
            md={5}
            sx={{
              display: 'flex',
              height: '100%',
              flexDirection: 'row',
            }}
          >
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
                <Typography variant="h4" gutterBottom>
                  docly
                </Typography>
                <Typography variant="subtitle1">
                  Simple. Fast. Convenient.
                </Typography>
                <Typography variant="subtitle1">
                  Schedule your appointments, no fuss.
                </Typography>
              </Box>
            </Box>
            <Box sx={{ width: '3%', backgroundColor: '#5AAEFF' }} />
            <Box sx={{ width: '3%', backgroundColor: '#B3D9FF' }} />
          </Grid>

          {/* Right Side ( the form )*/}
          <Grid
            item
            xs={12}
            md={7}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              p: 2,
            }}
          >
            <Box sx={{ width: '50%', maxWidth: '300px' }}>
              <Typography variant="h4" gutterBottom sx={{ textAlign: 'center' }}>
                Login
              </Typography>
              <form onSubmit={handleLogin}>
                <TextField
                  label="Email"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  id='login_email_d'
                />
                <TextField
                  label="Password"
                  type="password"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  id='login_pwd_d'
                />
                {error && <Alert severity="error" sx={{ marginTop: '16px' }}>{error}</Alert>}
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  sx={{
                    marginTop: '24px',
                    width: '50%',
                    display: 'block',
                    mx: 'auto',
                  }}
                >
                  LOGIN
                </Button>
              </form>
              <Box sx={{ marginTop: '16px', textAlign: 'center' }}>
                <Typography variant="body2">
                  Don't have an account? <a href="/signup">Register</a>
                </Typography>
                <Typography variant="body2">
                  Forgot your password? <a href="/reset">Reset</a>
                </Typography>
                <Typography variant="body2">
                  Verify email? <a href="/verify-email">Here</a>
                </Typography>
              </Box>
            </Box>
          </Grid>
        </>
      )}
    </Grid>
  );
};
