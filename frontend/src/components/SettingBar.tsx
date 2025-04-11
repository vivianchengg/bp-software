import { Divider, List, ListItem, ListItemButton, ListItemText, Tooltip, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import React from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import StorageIcon from '@mui/icons-material/Storage';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { apiCall } from '../helper';

export const SettingBar = ({setPage, setSettingOpen }:any) => {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate('/setting');
    setPage(0);
    setSettingOpen(false);
  };

  // For logout when current logged in user wants to logout
  const handleLogoutClick = async () => {
    const res = await apiCall('POST', '/auth/logout', {}, true);

    if (res.error) {
      console.log(res.error);
      return;
    }

    // clear token and id, redirect to the login page
    localStorage.removeItem('token');
    localStorage.removeItem('curUserId');
    navigate('/login');
  };

  return (
    <>
      <Box minWidth={'220px'} padding={'20px'} height={'100vh'}>
        <List>
          <ListItem>
            <Box>
              <Typography fontWeight={'bold'} fontSize={'20px'}>Settings</Typography>
            </Box>
          </ListItem>
          <ListItem
            key="ProfileItem"
            sx={{
              paddingTop: '12px',
              display: 'flex',
              paddingLeft: '0',
              paddingRight: '0',
            }}
          >
            <Tooltip title="View Profile Settings" arrow>
              <ListItemButton
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between'
                }}
                onClick={handleProfileClick}
              >
                <ListItemText primary="Profile" primaryTypographyProps={{ fontSize: '15px', fontWeight: 'bold' }}/>
                <AccountCircleIcon />
              </ListItemButton>
            </Tooltip>
          </ListItem>
          <ListItem
            key="ServerItem"
            sx={{
              paddingTop: '12px',
              display: 'flex',
              paddingLeft: '0',
              paddingRight: '0',
            }}
          >
            <Tooltip title="BPSoftware Server Options" arrow>
              <ListItemButton
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between'
                }}
                onClick={() => {
                  setPage(1);
                  setSettingOpen(false);
                }}
              >
                <ListItemText primary="Server Options" primaryTypographyProps={{ fontSize: '15px', fontWeight: 'bold' }}/>
                <StorageIcon />
              </ListItemButton>
            </Tooltip>
          </ListItem>
          <ListItem key="LogoutItem">
            <Tooltip title="Logout" arrow>
              <ListItemButton
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingLeft: '0',
                  paddingRight: '0',
                }}
                onClick={handleLogoutClick}
                id='logout_button'
              >
                <ListItemText primary="Logout" primaryTypographyProps={{ fontSize: '15px', fontWeight: 'bold', color: '#D3302F' }}/>
                <LogoutIcon sx={{ color:'#D3302F' }}/>
              </ListItemButton>
            </Tooltip>
          </ListItem>
        </List>
        <Divider/>
      </Box>
    </>
  )
};
