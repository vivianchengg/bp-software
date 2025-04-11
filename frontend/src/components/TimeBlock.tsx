import React, { useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import {  EventInput, CalendarApi } from '@fullcalendar/core';
import dayjs from 'dayjs';
import { Box, Button, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Event } from './Event';

interface Props {
  time: string;
}

export const TimeBlock =  ({ time }: Props) => {

  return (
      <Box display={'flex'}
        flexDirection={'column'}
        alignItems={'center'}
        flexShrink={0}
        sx={{
          backgroundColor: 'white',
          height: '81px',
          width: '40px',
          border: '1px solid #DCDFE3',
      }}>
        <style>
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,100..900;1,100..900&display=swap');
        </style>
        <text style={{
          fontFamily: 'Noto Sans',
          fontSize: '13px',
          color: '#3B3E45',
          margin: '3px 0px'
        }}>
          {time}
        </text>
      </Box>
  );
}
