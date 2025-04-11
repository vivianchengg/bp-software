import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Grid, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import EventNoteIcon from '@mui/icons-material/EventNote';
import { useWindowDimensions } from '../helper';

export const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();
  const { width } = useWindowDimensions();

  // Function that handles registering, if successful redirects to the profile page to
  // complete signup.
  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Invalid email format.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const initialData = {
      email,
      password,
    };
    sessionStorage.setItem('initialRegistrationData', JSON.stringify(initialData));

    // Redirect to the profile signup, to complete the registration process
    setSuccess('Account created successfully! Please select a server.');
    setError(null);
    navigate('/profile');
  };

  const isSmallScreen = width < 960;

  return (
    <Grid container sx={{ height: '100vh' }}>
      {isSmallScreen ? (
        <>
          {/* Header for mobile */}
          <Box sx={{ height: "4%", width: '100%', backgroundColor: '#0275FF', p: 1, textAlign: 'center', color: '#fff' }}>
            <Typography variant="h6" sx={{ fontSize: "1.4rem" }}>Welcome to docly</Typography>
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

              {/* Sign-Up Form */}
              <form onSubmit={handleSignUp} style={{ marginTop: '20px' }}>
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
                <TextField
                  label="Confirm Password"
                  type="password"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                  CREATE ACCOUNT
                </Button>
              </form>
              <Box sx={{ marginTop: '16px', textAlign: 'center' }}>
                <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                  Already have an account? <a href="/login">Login</a>
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                  Verify email? <a href="/verify-email">Here</a>
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
          {/* Left Side for logo and blue background */}
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

          {/* Right Side for signup form*/}
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
                Sign Up
              </Typography>
              <form onSubmit={handleSignUp}>
                <TextField
                  label="Email"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  id='reg_form_email_d'
                />
                <TextField
                  label="Password"
                  type="password"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  id='reg_form_pwd_d'
                />
                <TextField
                  label="Confirm Password"
                  type="password"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  id='reg_form_cpwd_d'
                />

                {error && <Alert severity="error" sx={{ marginTop: '16px' }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ marginTop: '16px' }}>{success}</Alert>}

                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  sx={{
                    marginTop: '24px',
                    width: '53%',
                    display: 'block',
                    mx: 'auto',
                  }}
                >
                  CREATE ACCOUNT
                </Button>
              </form>
              <Box sx={{ marginTop: '16px', textAlign: 'center' }}>
                <Typography variant="body2">
                  Already have an account? <a href="/login">Login</a>
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
