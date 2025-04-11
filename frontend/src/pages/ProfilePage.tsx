import React, { useEffect, useRef, useState } from 'react';
import { Box, Grid, Typography, Button, FormControl, Avatar, Alert, Select, MenuItem, InputLabel, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { apiCall, convertFileToBase64, useWindowDimensions } from '../helper';
import EventNoteIcon from '@mui/icons-material/EventNote';

export const ProfilePage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [title, setTitle] = useState(''); 
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState(''); 
  const [position, setPosition] = useState('');
  const [profileImg, setProfileImg] = useState('');
  const [organisation, setOrganisation] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [doctors, setDoctors] = useState<{ name: string }[]>([]);
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const { width } = useWindowDimensions();

  // This use effect extracts the registered doctors in the BPSoftware so that it provides
  // an option to the user which doctor they want to sign in as.
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await apiCall('GET', '/appointments/doctors', {}, true);
        if (response && Array.isArray(response)) {
          setDoctors(response);
        }
      } catch (error) {
        console.error('Failed to fetch doctors:', error);
      }
    };

    fetchDoctors();
    
    const initialData = JSON.parse(sessionStorage.getItem('initialRegistrationData') || '{}');
    if (initialData) {
      setEmail(initialData.email || '');
      setPassword(initialData.password || '');
    }
  }, []);

  const handleNameChange = (selectedName: string) => {
    setName(selectedName);
    const [parsedTitle, ...parsedNameParts] = selectedName.split(' ');
    setTitle(parsedTitle);
    setFirstName(parsedNameParts[0] || '');
    setLastName(parsedNameParts.slice(1).join(' ') || '');
  };

  // Retrieves data from localstorage and when user fills out the fields in a valid way
  // handles full registration.
  const handleProfileCompletion = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const profileData = {
      email,
      password,
      first_name: firstName,
      last_name: lastName,
      title,
      position,
      profile_img: profileImg,
      organisation,
    };

    try {
      setLoading(true);
      setSuccess(null);
      setError(null);
      const response = await apiCall('POST', 'auth/register', profileData);
      if (response.success) {
        sessionStorage.removeItem('initialRegistrationData'); 
        localStorage.setItem('curUserId', response.user_id);
        localStorage.setItem('token', response.token);
        setSuccess('Registration complete! Redirecting to verify email page...');
        setError(null);
        setTimeout(() => {
          setLoading(false);
          navigate('/verify-email');
        }, 2000);
      } else {
        setError(response.message || 'Profile completion failed.');
        setSuccess(null);
        setLoading(false);
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
      setSuccess(null);
      setLoading(false);
    }
  };

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const base64String = await convertFileToBase64(file);
        setProfileImg(base64String);
      } catch (error) {
        console.error("Error converting file to Base64:", error);
      }
    }
  };

  const isSmallScreen = width < 960;

  return (
    <Grid container sx={{ height: '100vh' }}>
      {isSmallScreen ? (
        <>
          {/* Header */}
          <Box sx={{ height: "4%", width: '100%', backgroundColor: '#0275FF', p: 1, textAlign: 'center', color: '#fff' }}>
            <Typography variant="h6" sx={{ fontSize: "1.4rem" }}>Welcome to docly</Typography>
          </Box>

          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2 }}>
            <Box sx={{ width: '90%', textAlign: 'center' }}>
              <EventNoteIcon sx={{ fontSize: 50, marginBottom: '16px' }} />
              <Typography variant="h4" gutterBottom sx={{ fontSize: '1.5rem' }}>
                Complete Your Profile
              </Typography>
              {error && <Alert severity="error" sx={{ marginTop: '16px' }}>{error}</Alert>}
              {success && <Alert severity="success" sx={{ marginTop: '16px' }}>{success}</Alert>}
              {loading ? (
                <Box display={'flex'} flexDirection={'column'} textAlign={'center'} alignItems={'center'} rowGap={2}>
                  <Typography variant='h4'>Welcome to docly!</Typography>
                  <Typography>Registering...</Typography>
                  <CircularProgress/>
                </Box>
              ) : (
                <Box component="form" onSubmit={handleProfileCompletion} sx={{ mt: 4 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ width: 120, height: 120 }} alt="userIcon" src={profileImg} />
                    <Box display="flex" gap={2}>
                      <Button variant="outlined" onClick={handleImageUpload}>Upload Photo</Button>
                    </Box>
                    <input
                      type="file"
                      ref={fileInputRef}
                      style={{ display: 'none' }}
                      onChange={handleFileChange}
                    />
                  </Box>
                  <Grid container spacing={2} sx={{ mt: 2 }}>
                    {/* Name Dropdown */}
                    <Grid item xs={12}>
                      <FormControl fullWidth required>
                        <InputLabel id="name-label">Name</InputLabel>
                        <Select
                          labelId="name-label"
                          label="Name"
                          name="name"
                          value={name}
                          onChange={(e) => handleNameChange(e.target.value)}
                        >
                          {doctors.map((doctor) => (
                            <MenuItem key={doctor.name} value={doctor.name}>
                              {doctor.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    {/* Organisation */}
                    <Grid item xs={12}>
                      <FormControl fullWidth required>
                        <InputLabel id="org-label">Organisation</InputLabel>
                        <Select
                          labelId="org-label"
                          label="Organisation"
                          name="org"
                          value={organisation}
                          onChange={(e) => setOrganisation(e.target.value)}
                        >
                          <MenuItem value="UNSW Medical Centre and Eye Specialist">UNSW Medical Centre and Eye Specialist</MenuItem>
                          <MenuItem value="Sydney Hospital">Sydney Hospital</MenuItem>
                          <MenuItem value="Org3">Org3</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    {/* Position */}
                    <Grid item xs={12}>
                      <FormControl fullWidth required>
                        <InputLabel id="pos-label">Position</InputLabel>
                        <Select
                          labelId="pos-label"
                          label="Position"
                          name="pos"
                          value={position}
                          onChange={(e) => setPosition(e.target.value)}
                        >
                          <MenuItem value="Physician">Physician</MenuItem>
                          <MenuItem value="Nurse">Nurse</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    {/* Buttons */}
                    <Grid item xs={12} container justifyContent="space-between">
                      <Button variant="outlined" color="error" onClick={() => navigate('/signup')}>
                        BACK
                      </Button>
                      <Button type="submit" variant="contained" color="primary">
                        SAVE
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Box>
          </Grid>

          {/* Footer */}
          <Box sx={{ height: "3%", width: '100%', backgroundColor: '#0275FF', p: 1, textAlign: 'center', color: '#fff', mt: 'auto' }}>
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
          <Grid item xs={12} md={7} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2, }}>
            <Box sx={{ width: '50%', maxWidth: '500px' }}>
              {!loading && (
                <Typography variant="h4" gutterBottom sx={{ textAlign: 'center' }}>
                  Complete Your Profile
                </Typography>
              )}
              {error && <Alert severity="error" sx={{ marginTop: '16px' }}>{error}</Alert>}
              {success && <Alert severity="success" sx={{ marginTop: '16px' }}>{success}</Alert>}

              {loading ? (
                <Box display={'flex'} flexDirection={'column'} textAlign={'center'} alignItems={'center'} rowGap={2}>
                  <Typography variant='h4'>Welcome to docly!</Typography>
                  <Typography>Registering...</Typography>
                  <CircularProgress />
                </Box>
              ) : (
                <Box component="form" onSubmit={handleProfileCompletion} sx={{ mt: 4 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ width: 170, height: 170 }} alt="userIcon" src={profileImg} />
                    <Box display="flex" gap={2}>
                      <Button variant="outlined" onClick={handleImageUpload}>Upload Photo</Button>
                    </Box>
                    <input
                      type="file"
                      ref={fileInputRef}
                      style={{ display: 'none' }}
                      onChange={handleFileChange}
                    />
                  </Box>

                  <Grid container spacing={2} sx={{ mt: 2 }}>
                    {/* Name Dropdown */}
                    <Grid item xs={12}>
                      <FormControl fullWidth required>
                        <InputLabel id="name-label">Name</InputLabel>
                        <Select
                          labelId="name-label"
                          label="Name"
                          name="name"
                          value={name}
                          onChange={(e) => handleNameChange(e.target.value)}
                          id='reg_profile_name_d'
                        >
                          {doctors.map((doctor) => (
                            <MenuItem key={doctor.name} value={doctor.name}>
                              {doctor.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    {/* Organisation */}
                    <Grid item xs={12}>
                      <FormControl fullWidth required>
                        <InputLabel id="org-label">Organisation</InputLabel>
                        <Select
                          labelId="org-label"
                          label="Organisation"
                          name="org"
                          value={organisation}
                          onChange={(e) => setOrganisation(e.target.value)}
                          id='reg_profile_org_d'
                        >
                          <MenuItem value="UNSW Medical Centre and Eye Specialist">UNSW Medical Centre and Eye Specialist</MenuItem>
                          <MenuItem value="Sydney Hospital">Sydney Hospital</MenuItem>
                          <MenuItem value="Org3">Org3</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    {/* Position */}
                    <Grid item xs={12}>
                      <FormControl fullWidth required>
                        <InputLabel id="pos-label">Position</InputLabel>
                        <Select
                          labelId="pos-label"
                          label="Position"
                          name="pos"
                          value={position}
                          onChange={(e) => setPosition(e.target.value)}
                          id='reg_profile_pos_d'
                        >
                          <MenuItem value="Physician">Physician</MenuItem>
                          <MenuItem value="Nurse">Nurse</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    {/* Buttons */}
                    <Grid item xs={12} container justifyContent="space-between">
                      <Button variant="outlined" color="error" onClick={() => navigate('/signup')}>
                        BACK
                      </Button>
                      <Button type="submit" variant="contained" color="primary">
                        SAVE
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Box>
          </Grid>
        </>
      )}
    </Grid>
  );
};
