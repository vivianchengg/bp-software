import { AppBar, Avatar, Box, Drawer, IconButton, List, ListItem, ListItemButton, ListItemText, Menu, MenuItem, Toolbar, Tooltip, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { apiCall } from '../helper';
import MenuIcon from '@mui/icons-material/Menu';
import TodayIcon from '@mui/icons-material/Today';
import TodayOutlinedIcon from '@mui/icons-material/TodayOutlined';
import GroupsIcon from '@mui/icons-material/Groups';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import SettingsIcon from '@mui/icons-material/Settings';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import Divider from '@mui/material/Divider';
import { User } from './TopBar';

interface Props {
  curUser: User;
}

// Mobile navigation bar on mobile versions.
export const MobileBar = ({curUser}: Props) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavButton = (url: string) => {
    if (isMenuOpen) {
      toggleMenu();
    }
    navigate(url);
  };

  return (
    <>
      <AppBar position="fixed"
        sx={{
          backgroundColor: '#0275FF',
          boxShadow: 'none',
          zIndex: (theme) => theme.zIndex.drawer + 1
      }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleMenu}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h3"
            component="div"
            sx={{
              flexGrow: 1,
              fontSize: 24,
              fontWeight: '500',
              letterSpacing: 2,
              cursor: 'pointer'
            }}
            onClick={() => handleNavButton('/landing')}
          >
            docly
          </Typography>
          <Box display={'flex'}>
            <Box alignContent={'center'} textAlign="right"
              sx={{
                width: 'max(110px, calc(100vw - 280px))'
              }}
            >
              <Typography variant='body2' sx={{
                fontWeight: 'normal',
                lineHeight: '1',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                width: '100%',
                display: 'block',
              }}
              gutterBottom
              >
                {curUser?.title} {curUser?.name_first} {curUser?.name_last}</Typography>
              <Typography variant='caption' sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                fontWeight: '200',
                whiteSpace: 'nowrap',
                width: '100%',
                display: 'block',
              }}>
                {curUser?.organisation}</Typography>
            </Box>
            <Tooltip title="View Profile" arrow>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                color="inherit"
                onClick={() => handleNavButton('/setting')}
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
      <Drawer
        anchor="top"
        open={isMenuOpen}
        onClose={toggleMenu}
        PaperProps={{
          sx: {
            top: '64px',
            zIndex: (theme) => theme.zIndex.appBar - 1,
          },
        }}
      >
        <List>
          <ListItem key="MMenu_App">
            <ListItemButton
              sx={{
                display: 'flex',
                justifyContent: 'center',
                width: '100%',
                borderRadius: '8px',
              }}
              selected={location.pathname === '/landing'}
              onClick={() => handleNavButton('/landing')}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'center' }}>
                {location.pathname === '/landing'
                  ? <TodayIcon />
                  : <TodayOutlinedIcon />
                }
                <Typography variant="h6" fontWeight={location.pathname === '/landing' ? '800' : '500'}>Appointments</Typography>
              </Box>
            </ListItemButton>
          </ListItem>
          <Divider />
          <ListItem key="MMenu_Patients">
            <ListItemButton
              sx={{
                display: 'flex',
                justifyContent: 'center',
                width: '100%',
                borderRadius: '8px',
              }}
              selected={location.pathname === '/patient'}
              onClick={() => handleNavButton('/patient')}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'center' }}>
                {location.pathname === '/patient'
                  ? <GroupsIcon />
                  : <GroupsOutlinedIcon />
                }
                <Typography variant="h6" fontWeight={location.pathname === '/patient' ? '800' : '500'}>Patients</Typography>
              </Box>
            </ListItemButton>
          </ListItem>
          <Divider />
          <ListItem key="MMenu_Settings">
            <ListItemButton
              sx={{
                display: 'flex',
                justifyContent: 'center',
                width: '100%',
                borderRadius: '8px',
              }}
              selected={location.pathname === '/setting'}
              onClick={() => handleNavButton('/setting')}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'center' }}>
                {location.pathname === '/setting'
                  ? <SettingsIcon />
                  : <SettingsOutlinedIcon />
                }
                <Typography variant="h6" fontWeight={location.pathname === '/setting' ? '800' : '500'}>Settings</Typography>
              </Box>
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </>
  );
}