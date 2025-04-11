import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Grid, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { apiCall, useWindowDimensions } from '../helper';
import EventNoteIcon from '@mui/icons-material/EventNote';

export const VerifyEmailPage: React.FC = () => {
  const [verifyToken, setVerifyToken] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();
  const { width } = useWindowDimensions();

  // Function to verify the email when the user enters the token and submits
  // Redirects to login page on success
  const handleVerifyEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!verifyToken) {
      setError("Please enter the verification token.");
      setSuccess(null);
      return;
    }

    try {
        const response = await apiCall('GET', `auth/verify?verify_token=${verifyToken}`, {});

      if (response.success) {
        setSuccess('Email verified successfully! Redirecting to login...');
        setError(null);
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setError(response.message || 'Verification failed. Please try again.');
        setSuccess(null);
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
      setSuccess(null);
    }
  };

  const isSmallScreen = width < 960;

  return (
    <Grid container sx={{ height: '100vh' }}>
      {isSmallScreen ? (
        <>
          {/* Header for mobile */}
          <Box sx={{ height: "4%", width: '100%', backgroundColor: '#0275FF', p: 1, textAlign: 'center', color: '#fff' }}>
            <Typography variant="h6" sx={{ fontSize: "1.4rem" }}>Email Verification</Typography>
          </Box>

          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2 }}>
            <Box sx={{ width: '90%', textAlign: 'center' }}>
              <EventNoteIcon sx={{ fontSize: 50, marginBottom: '16px' }} />
              <Typography variant="h4" gutterBottom sx={{ fontSize: '1.5rem' }}>docly</Typography>
              <Typography variant="subtitle1" sx={{ fontSize: '0.875rem' }}>Simple. Fast. Convenient.</Typography>
              <Typography variant="subtitle1" sx={{ fontSize: '0.75rem' }}>Schedule your appointments, no fuss.</Typography>

              {/* Verify Email Token */}
              <form onSubmit={handleVerifyEmail} style={{ marginTop: '20px' }}>
                <TextField
                  label="Verification Code"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={verifyToken}
                  onChange={(e) => setVerifyToken(e.target.value)}
                  sx={{ fontSize: '0.875rem' }}
                />
                {error && <Alert severity="error" sx={{ marginTop: '16px' }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ marginTop: '16px' }}>{success}</Alert>}
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
                  Verify
                </Button>
              </form>
              <Box sx={{ marginTop: '16px', textAlign: 'center' }}>
                <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                  Already verified? <a href="/login">Login</a>
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                  Don't have an account? <a href="/signup">Register</a>
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Footer for mobile */}
          <Box sx={{ height: "3%", width: '100%', backgroundColor: '#0275FF', p: 1, textAlign: 'center', color: '#fff', mt: 'auto' }}>
            <Typography variant="body2">&copy; 2024 docly. All rights reserved.</Typography>
          </Box>
        </>
      ) : (
        <>
          {/* Left Side Logo and Intro */}
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

          {/* Right Side Verify Token Form */}
          <Grid item xs={12} md={7} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2 }}>
            <Box sx={{ width: '50%', maxWidth: '300px' }}>
              <Typography variant="h4" gutterBottom sx={{ textAlign: 'center' }}>Email Verification</Typography>
              <form onSubmit={handleVerifyEmail}>
                <TextField
                  label="Verification Code"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={verifyToken}
                  onChange={(e) => setVerifyToken(e.target.value)}
                />
                {error && <Alert severity="error" sx={{ marginTop: '16px' }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ marginTop: '16px' }}>{success}</Alert>}
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
                  Verify
                </Button>
              </form>
              <Box sx={{ marginTop: '16px', textAlign: 'center' }}>
                <Typography variant="body2">
                  Already verified? <a href="/login">Login</a>
                </Typography>
                <Typography variant="body2">
                  Don't have an account? <a href="/signup">Register</a>
                </Typography>
              </Box>
            </Box>
          </Grid>
        </>
      )}
    </Grid>
  );
};
