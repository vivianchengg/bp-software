import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemButton, Typography, Tooltip } from '@mui/material';
import TodayIcon from '@mui/icons-material/Today';
import TodayOutlinedIcon from '@mui/icons-material/TodayOutlined';
import GroupsIcon from '@mui/icons-material/Groups';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import SettingsIcon from '@mui/icons-material/Settings';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import Box from '@mui/material/Box';
import { useLocation, useNavigate } from 'react-router-dom';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import PersonSearchOutlinedIcon from '@mui/icons-material/PersonSearchOutlined';
import DoclyLogo from '../images/logo192.png';

interface Props {
  pBarOpen: boolean,
  setPBarOpen: (pOpen: boolean) => void,
  settingOpen: boolean,
  setSettingOpen: (settingOpen: boolean) => void,
}

export const SideBar = ({ pBarOpen, setPBarOpen, settingOpen, setSettingOpen }: Props) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleButtonClick = (url: string) => {
    navigate(url);
  };

  const handleSearchClick = () => {
    setPBarOpen(true);
  };

  const handleSettingClick = () => {
    setSettingOpen(true);
  };

  return (
    <Drawer
      variant='permanent'
      anchor="left"
      sx={{
        borderRight: '1px solid #E0E3E7',
        width: '80px',
        flexShrink: 0,
        '& .MuiDrawer-paper': {
            width: '80px',
            boxSizing: 'border-box',
          },
      }}
      id='side_bar'
    >
      <Box>
        <List>
          <ListItem sx={{ paddingTop: '5px', paddingLeft: '15px', paddingRight: '14px' }}>
            <Box sx={{
                height: '50px',
                width: '50px',
                backgroundImage: `url(${DoclyLogo})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                cursor: 'pointer'
              }}
              onClick={() => handleButtonClick('/landing')}
              id='sb_logo'
            />
          </ListItem>
          <ListItem key="AppIcon" sx={{ paddingTop: '12px' }}>
            <Tooltip title="View Appointments" arrow>
              <ListItemButton
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  colour: '#3B3E45'
                }}
                onClick={() => handleButtonClick('/landing')}
                id='sb_app'
              >
                {location.pathname === '/landing'
                  ? <TodayIcon />
                  : <TodayOutlinedIcon />
                }
                <Typography fontSize={'12px'} fontWeight={'bold'}>App</Typography>
              </ListItemButton>
            </Tooltip>
          </ListItem>
          <ListItem key="PatientsIcon" sx={{ paddingTop: '0' }}>
            <Tooltip title="View Patients" arrow>
              <ListItemButton
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  colour: '#3B3E45'
                }}
                onClick={() => {
                  handleButtonClick('/patient');
                  handleSearchClick();
                }}
                id='sb_pat'
              >
                {location.pathname === '/patient'
                  ? <GroupsIcon />
                  : <GroupsOutlinedIcon />
                }
                <Typography fontSize={'12px'} fontWeight={'bold'}>Patients</Typography>
              </ListItemButton>
            </Tooltip>
          </ListItem>
          <ListItem key="SettingsIcon" sx={{ paddingTop: '0' }}>
            <Tooltip title="View Settings" arrow>
              <ListItemButton
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  colour: '#3B3E45'
                }}
                onClick={() => {
                  handleButtonClick('/setting');
                  handleSettingClick();
                }}
                id='sb_setting'
              >
                {location.pathname === '/setting'
                  ? <SettingsIcon />
                  : <SettingsOutlinedIcon />
                }
                <Typography fontSize={'12px'} fontWeight={'bold'}>Settings</Typography>
              </ListItemButton>
            </Tooltip>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
}