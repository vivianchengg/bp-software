import React, { useState } from 'react';
import Box from '@mui/material/Box';

interface Props {
  timeZone: string;
}

export const TimeZone = ({ timeZone }: Props) => (
  <Box
    display={'flex'}
    flexDirection={'column'}
    alignItems={'center'}
    sx={{
      flexShrink: 0,
      backgroundColor: 'white',
      width: '40px',
      border: '1px solid #DCDFE3',
  }}>
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,100..900;1,100..900&display=swap');
    </style>
    <text style={{
      fontFamily: 'Noto Sans',
      fontSize: '12px',
      color: '#666E7D',
      margin: '3px 0px'
    }}>
      {timeZone}
    </text>
  </Box>
)
