import React, { useRef, useState } from 'react';
import { TextField, Button, MenuItem, InputLabel, Select, FormControl, Box, Avatar } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useNavigate } from 'react-router-dom';
import { User } from './TopBar';
import { apiCall, convertFileToBase64 } from '../helper';

interface Props {
  curUser: User,
}

export const ProfileForm = ({ curUser }: Props) => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>(curUser.profile_img);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get('title')?.toString().trim() || curUser.title;
    const firstName = formData.get('firstName')?.toString().trim() || curUser.name_first;
    const lastName = formData.get('lastName')?.toString().trim() || curUser.name_last;
    const pwd = formData.get('pwd')?.toString().trim();
    const org = formData.get('org')?.toString().trim();
    const pos = formData.get('pos')?.toString().trim();

    // api call to change user profile
    const apiData = {
      "title": title,
      "organisation": org,
      "position": pos,
      "avatar": avatarUrl,
      "first_name": firstName,
      "last_name": lastName,
      "password": pwd,
    };

    console.log(apiData);
    const res = await apiCall('POST', '/auth/editProfile', apiData, true);
    if (res.error) {
      console.log(res.error);
      return;
    }

    navigate('/landing');
  };

  const handleDeleteButton = async () => {
    try {
      // Deletes the currently logged in account.
      const response = await apiCall('DELETE', '/auth/deleteAccount', {}, true);
      
      if (response.success) {
        localStorage.removeItem('token');
        localStorage.removeItem('curUserId');
        alert('Account deleted successfully.');
        navigate('/login');
      } else {
        alert(response.message || 'Failed to delete account. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('An error occurred. Please try again later.');
    }
  };
  

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleImageDelete = () => {
    setAvatarUrl("");
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      try {
        const base64String = await convertFileToBase64(file);
        setAvatarUrl(base64String);
      } catch (error) {
        console.error("Error converting file to Base64:", error);
      }
    }
  };

  return (
    <Box
      sx={{
        width: {
          xs: '100%',
          sm: '70%'
        },
        display: 'flex',
        flexDirection: 'column',
        gap: '40px',
        height: {
          xs: 'calc(100vh - 230px)',
          sm: 'calc(100vh - 164px)'
        },
        overflow: 'auto',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '10px'
        }}
      >
        <Box
          sx={{
            width: {
              xs: '30%',
              sm: '35%'
            }
          }}
        >
          <Avatar
            sx={{
              width: '100%',
              height: 'auto',
              aspectRatio: '1',
            }}
            alt='userIcon'
            src={avatarUrl}
          />
        </Box>
        <Box
          display={'flex'}
          gap={2}
        >
          <Button variant="outlined" onClick={handleImageUpload}>Upload</Button>
          <Button variant="outlined" color='error' onClick={handleImageDelete}>Remove</Button>
        </Box>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </Box>
      <Box
        component={'form'}
        onSubmit={handleSubmit}
      >
        <Grid container spacing={2}>
          {/* Title */}
          <Grid size={3}>
            <FormControl fullWidth required disabled>
              <InputLabel
                id="title-label"
                sx={{
                  '& .MuiInputLabel-asterisk': {
                    color: 'red',
                  }
                }}
              >
                Title
              </InputLabel>
              <Select defaultValue={curUser.title} labelId='title-label' label="Title" name='title'>
                <MenuItem value="Dr">Dr</MenuItem>
                <MenuItem value="Mr.">Mr.</MenuItem>
                <MenuItem value="Mrs.">Mrs.</MenuItem>
                <MenuItem value="Miss">Miss</MenuItem>
                <MenuItem value="Mast.">Mast.</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* First Name */}
          <Grid size={4.5}>
            <TextField
              label="First Name"
              name='firstName'
              required
              disabled
              defaultValue={curUser.name_first}
              fullWidth
              sx={{
                '& .MuiInputLabel-asterisk': {
                    color: 'red',
                }
              }}
            />
          </Grid>

          {/* Last Name */}
          <Grid size={4.5}>
            <TextField
              label="Last Name"
              name='lastName'
              required
              disabled
              defaultValue={curUser.name_last}
              fullWidth
              sx={{
                '& .MuiInputLabel-asterisk': {
                    color: 'red',
                },
              }}
            />
          </Grid>

          {/* Organization */}
          <Grid size={12}>
            <FormControl fullWidth required>
              <InputLabel
                id="org-label"
                sx={{
                  '& .MuiInputLabel-asterisk': {
                    color: 'red',
                  }
                }}
              >
                Organisation
              </InputLabel>
              <Select defaultValue={curUser.organisation} labelId='org-label' label="Organisation" name='org' id='setting_profile_org'>
                <MenuItem value="UNSW Medical Centre and Eye Specialist">UNSW Medical Centre and Eye Specialist</MenuItem>
                <MenuItem value="Sydney Hospital">Sydney Hospital</MenuItem>
                <MenuItem value="Org3">Org3</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Password */}
          <Grid size={12}>
            <TextField
              label="Password"
              name='pwd'
              type="password"
              required
              defaultValue={curUser.password}
              fullWidth
              sx={{
                '& .MuiInputLabel-asterisk': {
                    color: 'red',
                }
              }}
            />
          </Grid>

          {/* Position */}
          <Grid size={12}>
            <FormControl fullWidth required>
              <InputLabel
                id="title-label"
                sx={{
                  '& .MuiInputLabel-asterisk': {
                    color: 'red',
                  }
                }}
              >
                Position
              </InputLabel>
              <Select defaultValue={curUser.position} labelId='pos-label' label='Position' name='pos' id='setting_profile_pos'>
                <MenuItem value="Physician">Physician</MenuItem>
                <MenuItem value="Nurse">Nurse</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Buttons */}
          <Grid size={12} container justifyContent="space-between">
            <Button variant="outlined" color="error" onClick={handleDeleteButton} id='setting_profile_delete_button'>
              DELETE ACCOUNT
            </Button>
            <Button type="submit" variant="contained" color="primary" id='setting_profile_save_button'>
              SAVE
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};