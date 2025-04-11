import { AppBar, Avatar, Box, IconButton, Toolbar, Tooltip, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export interface User {
  auth_user_id: number,
  email: string,
  name_first: string,
  name_last: string,
  position: string,
  profile_img: string
  title: string,
  organisation: string,
  password: string
};

interface Props {
  curUser: User;
}

export const TopBar = ({curUser}: Props) => {
  const navigate = useNavigate();

  const handlieProfileClick = () => {
    navigate('/setting');
  };

  const handlieLogoClick = () => {
    navigate('/landing');
  };

  return (
    <>
      <AppBar position="fixed" id='top_bar'
        sx={{
          backgroundColor: '#0275FF',
          boxShadow: 'none',
      }}>
        <Toolbar sx={{ display: 'flex', justifyContent:'flex-end' }}>
          <Typography
            variant="h3"
            component="div"
            sx={{
              marginLeft: 11,
              flexGrow: 1,
              fontSize: 24,
              fontWeight: '500',
              letterSpacing: 2,
              cursor: 'pointer'
            }}
            onClick={handlieLogoClick}
          >
            docly
          </Typography>
          <Box display={'flex'}>
            <Box alignContent={'center'} textAlign="right" id='tb_profile'>
              <Typography variant='body2' sx={{ fontWeight: 'bold', lineHeight: '1' }}>{curUser?.title} {curUser?.name_first} {curUser?.name_last}</Typography>
              <Typography variant='caption' sx={{ lineHeight: '1' }}>{curUser?.organisation}</Typography>
            </Box>
            <Tooltip title="View Profile" arrow>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                color="inherit"
                onClick={handlieProfileClick}
                id='tb_profile'
              >
                <Avatar
                  alt='User'
                  src={curUser?.profile_img}
                />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
}