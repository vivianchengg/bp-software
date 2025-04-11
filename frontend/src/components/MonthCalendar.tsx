import React from 'react';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Box from '@mui/material/Box';

interface Props {
  onDateClick: (date: string) => void;
  selectedDate: string;
}

export const MonthCalendar = ({ onDateClick, selectedDate }: Props) => {
  const handleDateChange = (newDate: Dayjs | null) => {
    if (newDate) {
      onDateClick(newDate.format('YYYY-MM-DD'));
    }
  };

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box
          sx={{
            display: 'flex',
            maxWidth: '220px',
            paddingLeft: '20px',
            paddingRight: '20px'
          }}
        >
          <DateCalendar
            value={dayjs(selectedDate)}
            onChange={handleDateChange}
            sx={{
              '& .MuiPickersCalendarHeader-label':{
                fontWeight: 'bold',
                fontSize: '14px'
              },
              '& .MuiPickersCalendarHeader-root':{
                padding:'0'
              },
              width: '100%',
              '& .MuiYearCalendar-root': {
                maxWidth: '220px',
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '0px',
                transform: 'scale(0.9)',
                transformOrigin: 'left center',
              },
            }}
          />
        </Box>
      </LocalizationProvider>
    </>
  );
}