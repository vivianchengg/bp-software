import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Grid, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { apiCall, useWindowDimensions } from '../helper';
import EventNoteIcon from '@mui/icons-material/EventNote';

export const ConfirmResetPasswordPage: React.FC = () => {
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();
  const { width } = useWindowDimensions();

  // If valid changes the password to what the user requests.
  const handlePasswordReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const resetData = { reset_code: resetCode, password: newPassword };

    try {
      // Api call to reset pw
      const response = await apiCall('POST', 'auth/resetPassword', resetData);

      // If successful direct to the login page to login with new pw
      if (response.success) {
        setSuccess('Password has been reset successfully! Redirecting to login...');
        setError(null);
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setError(response.message || 'Failed to reset password. Please try again.');
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
          {/* Header */}
          <Box sx={{ height: '4%', width: '100%', backgroundColor: '#0275FF', p: 1, textAlign: 'center', color: '#fff' }}>
            <Typography variant="h6" sx={{ fontSize: '1.4rem' }}>Welcome to docly</Typography>
          </Box>

          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2 }}>
            <Box sx={{ width: '90%', textAlign: 'center' }}>
              <Typography variant="h4" gutterBottom sx={{ fontSize: '1.5rem' }}>Reset Password</Typography>
              {error && <Alert severity="error" sx={{ marginTop: '16px' }}>{error}</Alert>}
              {success && <Alert severity="success" sx={{ marginTop: '16px' }}>{success}</Alert>}
              <form onSubmit={handlePasswordReset} style={{ marginTop: '20px' }}>
                <TextField
                  label="Reset-code"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                  required
                />
                <TextField
                  label="New Password"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <TextField
                  label="Confirm Password"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  sx={{ marginTop: '24px', width: '50%', display: 'block', mx: 'auto' }}
                >
                  Reset Password
                </Button>
              </form>
              <Box sx={{ marginTop: '16px', textAlign: 'center' }}>
                <Typography variant="body2">
                  Remembered your password? <a href="/login">Login</a>
                </Typography>
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
            </Box>
          </Grid>

          {/* Right Side */}
          <Grid item xs={12} md={7} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Box sx={{ width: '50%', maxWidth: '300px' }}>
              <Typography variant="h4" gutterBottom sx={{ textAlign: 'center' }}>Reset Password</Typography>
              {error && <Alert severity="error" sx={{ marginTop: '16px' }}>{error}</Alert>}
              {success && <Alert severity="success" sx={{ marginTop: '16px' }}>{success}</Alert>}
              <form onSubmit={handlePasswordReset} style={{ marginTop: '20px' }}>
                <TextField
                  label="Reset-code"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                  required
                />
                <TextField
                  label="New Password"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <TextField
                  label="Confirm Password"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  sx={{ marginTop: '24px', width: '50%', display: 'block', mx: 'auto' }}
                >
                  Reset Password
                </Button>
              </form>
              <Box sx={{ marginTop: '16px', textAlign: 'center' }}>
                <Typography variant="body2">
                  Remembered your password? <a href="/login">Login</a>
                </Typography>
              </Box>
            </Box>
          </Grid>
        </>
      )}
    </Grid>
  );
};
