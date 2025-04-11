import {
  Button,
  Typography,
  Avatar,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import Box from '@mui/material/Box';
import React from 'react';
import Grid from '@mui/material/Grid2';

interface Props {
  handleBackButton: () => void,
}

export const ServerOptions = ({ handleBackButton }: Props) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const address = formData.get('address')?.toString().trim();
    const port = formData.get('port')?.toString().trim();
    const name = formData.get('name')?.toString().trim();
    const password = formData.get('password')?.toString().trim();
    console.log(address, port, name, password);
  };

  return (
    <>
      <Box padding={'40px'} flexGrow={'1'}>
        <Box
          mb={2}
          sx={{
            display: {
              xs: 'block',
              sm: 'None'
            }
          }}
        >
          <Button variant="contained" onClick={handleBackButton}>Back</Button>
        </Box>
        <Typography
          fontWeight={'bold'}
          sx={{
            fontSize: {
              xs: '30px',
              sm: '40px'
            }
          }}
          mb={'35px'}
        >
          Server Options
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
          }}>
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
                xs: 'calc(100vh - 255px)',
                sm: 'calc(100vh - 220px)'
              },
              overflow: 'auto',
              pt: '5px',
              pb: '10px'
            }}>
            <Box component={'form'} onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 7 }}>
                  <TextField
                    label='Server Address'
                    name='address'
                    required
                    defaultValue='server.com'
                    fullWidth
                    sx={{
                      '& .MuiInputLabel-asterisk': {
                        color: 'red',
                      },
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 5 }}>
                  <TextField
                    label='Port'
                    name='port'
                    required
                    defaultValue='1234'
                    fullWidth
                    sx={{
                      '& .MuiInputLabel-asterisk': {
                        color: 'red',
                      },
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label='Name'
                    name='name'
                    required
                    defaultValue='name'
                    fullWidth
                    sx={{
                      '& .MuiInputLabel-asterisk': {
                        color: 'red',
                      },
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label='Password'
                    name='password'
                    required
                    defaultValue='1234'
                    type='password'
                    fullWidth
                    sx={{
                      '& .MuiInputLabel-asterisk': {
                        color: 'red',
                      },
                    }}
                  />
                </Grid>

                <Grid size={6}>
                  <Button
                    type='submit'
                    variant='outlined'
                    color='primary'
                    fullWidth>
                    Host
                  </Button>
                </Grid>
                <Grid size={6}>
                  <Button
                    type='submit'
                    variant='outlined'
                    color='primary'
                    fullWidth>
                    Join
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};
