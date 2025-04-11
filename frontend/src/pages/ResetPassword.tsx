import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Grid, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { apiCall, useWindowDimensions } from '../helper';
import EventNoteIcon from '@mui/icons-material/EventNote';

export const ResetPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();
  const { width } = useWindowDimensions();

  // Function to request Reset Password when user enters their email and clicks, 
  // Redirects to change password page
  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const resetData = { email };

    try {
      const response = await apiCall('POST', 'auth/resetPasswordRequest', resetData);

      if (response.success) {
        setSuccess('Password reset link sent. Check your email.');
        setError(null);
        setTimeout(() => navigate('/reset-password'), 5000);
      } else {
        setError(response.message || 'Failed to send reset link. Please try again.');
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
          {/* Header for mobile*/}
          <Box sx={{ height: "4%", width: '100%', backgroundColor: '#0275FF', p: 1, textAlign: 'center', color: '#fff' }}>
            <Typography variant="h6" sx={{ fontSize: "1.4rem" }}>Reset Password</Typography>
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

              {/* Reset Password */}
              <form onSubmit={handleResetPassword} style={{ marginTop: '20px' }}>
                <TextField
                  label="Email"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  Send Link
                </Button>
              </form>
              <Box sx={{ marginTop: '16px', textAlign: 'center' }}>
                <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                  Remember your password? <a href="/login">Login</a>
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
          {/* Left Side Logo and Intro*/}
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

          {/* Right Side Reset Password Form*/}
          <Grid item xs={12} md={7} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2 }}>
            <Box sx={{ width: '50%', maxWidth: '300px' }}>
              <Typography variant="h4" gutterBottom sx={{ textAlign: 'center' }}>Reset Password</Typography>
              <form onSubmit={handleResetPassword}>
                <TextField
                  label="Email"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  Send Link
                </Button>
              </form>
              <Box sx={{ marginTop: '16px', textAlign: 'center' }}>
                <Typography variant="body2">
                  Remember your password? <a href="/login">Login</a>
                </Typography>
              </Box>
            </Box>
          </Grid>
        </>
      )}
    </Grid>
  );
};
