import React, { useState } from 'react';
import Box from '@mui/material/Box';

export const TimeSlot = () => (
  <Box
    flexShrink={0}
    display={'flex'}
    flexDirection={'column'}
    justifyContent={'center'}
    sx={{
      height: '81px',
      backgroundColor: 'white',
      border: '1px solid #E0E3E7',
  }}>
    <Box
      sx={{
        borderBottom: '1px dashed #E0E3E7',
    }}/>
  </Box>
)
