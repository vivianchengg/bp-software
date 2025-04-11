import { Box, Typography } from '@mui/material';
import dayjs from 'dayjs';
import React from 'react';

interface Props {
  title: string;
  medicare: boolean;
  phone: boolean;
  lastAttend: string; // format e.g. 2023-10-01T10:00:00
  onClick?: () => void;
};

export const Event = ({ title, medicare, phone, lastAttend, onClick }: Props) => {
  // Check if patient came last is within 12 months
  const isWithin12M = () => {
    const today = dayjs();
    const target = dayjs(lastAttend);
    const mdiff = today.diff(target, 'months')
    return mdiff < 12 || (mdiff === 12 && today.date() <= target.date());
  };

  return (
    <Box onClick={onClick}>
      <Typography variant="body2">{title}</Typography>
      <Box display={'flex'}>
        {phone && !isWithin12M() && (
          <Box sx={{padding: '2px', backgroundColor: '#1876D2', borderRadius: '5px', display: 'inline-block', color: 'white' }}>
            P(LA: {dayjs(lastAttend).format('D/MM/YY')})
          </Box>
        )}
        {phone && isWithin12M() && (
          <Box sx={{padding: '2px', backgroundColor: '#1876D2', borderRadius: '5px', display: 'inline-block', color: 'white' }}>
            Phone
          </Box>
        )}
        {!medicare && (
          <Box sx={{padding: '2px', backgroundColor: '#FF5449', borderRadius: '5px', display: 'inline-block', color: 'white' }}>
            No Medicare
          </Box>
        )}
      </Box>
    </Box>
  );
};