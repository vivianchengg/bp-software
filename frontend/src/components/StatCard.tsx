import React from 'react';
import { Box, Typography } from '@mui/material';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

interface Props {
  bookingCount: number,
  hourCount: number
};

export const StatCard = ({ bookingCount, hourCount }: Props) => {

  // Conversion of total time into hours and minutes
  const convertToHoursAndMinutes = (time: number) => {
    const hours = Math.floor(time / 60);
    const minutes = Math.floor(time - (hours * 60));

    if (hours === 0) {
      return `${minutes} mins`;
    }

    return `${hours} hrs ${minutes} mins`;
  };

  return (
    <Box display="flex" flexDirection="column" padding='20px' gap={2}
      height={"calc(100vh - 440px)"}
      sx={{
        overflowY: 'auto'
      }}
    >
      <Box
        sx={{
          backgroundColor: '#0275FF',
          color: 'white',
          borderRadius: 2,
          padding: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '120px',
        }}
      >
        <NotificationsNoneOutlinedIcon sx={{ fontSize: 40 }} />
        <br/>
        <Typography variant='h5' fontWeight={'bold'}>{bookingCount}</Typography>
        <Typography>Bookings Today</Typography>
      </Box>
      <Box
        sx={{
          backgroundColor: '#0275FF',
          color: 'white',
          borderRadius: 2,
          padding: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '120px',
        }}
      >
        <AccessTimeIcon sx={{ fontSize: 40 }} />
        <br/>
        <Typography variant='h6' fontWeight={'bold'} textAlign={'center'}>{convertToHoursAndMinutes(hourCount)}</Typography>
      </Box>
    </Box>
  );
}