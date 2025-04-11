import { Button, Typography, Avatar } from '@mui/material';
import Box from '@mui/material/Box';
import React, { useEffect, useState } from 'react';
import { ProfileForm } from './ProfileForm';
import { apiCall } from '../helper';
import { User } from './TopBar';

interface Props {
  handleBackButton: () => void,
};

export const Profile = ({ handleBackButton }: Props) => {
  const [ curUser, setCurUser ] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async() => {
      const userId = localStorage.getItem('curUserId');
      if (!userId) {
        return;
      }

      const res = await apiCall('GET', `/auth/getProfile?userId=${userId}`, {}, true);
      if (res.error) {
        console.log(res.error);
        return;
      }

      const user = res.user[0];
      setCurUser(user);
    };

    fetchUser();
  }, []);

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
        >
          Profile
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mt: {
              xs: '5px',
              sm: '0'
            }
          }}
        >
          {curUser ? <ProfileForm curUser={curUser}/> : <Typography>Loading...</Typography>}
        </Box>
      </Box>
    </>
  )
};