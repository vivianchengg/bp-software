import React, { useState } from 'react';
import { MonthCalendar } from '../components/MonthCalendar';
import { Schedule } from '../components/Schedule';
import Box from '@mui/material/Box';
import dayjs from 'dayjs';
import { StatCard } from '../components/StatCard';
import { Divider, Tooltip } from '@mui/material';
import { CreateAppointmentModal } from '../components/CreateAppointmentModal';
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';
import { Tablet, useWindowDimensions } from '../helper';

export const LandingPage = () => {
  const [selectedDate, setSelectedDate] = useState<string>(dayjs().format('YYYY-MM-DD'));
  const [open, setOpen] = useState<boolean>(false);
  const [bookingCount, setBookingCount] = useState<number>(0);
  const [hourCount, setHourCount] = useState<number>(0);
  const [refresh, setRefresh] = useState<boolean>(false);

  const handleDateClick = (date: string) => {
    console.log(date);
    setSelectedDate(date);
  }

  const startTime = 8;
  const endTime = 17;

  let times : string[] = [];
  for (let i = startTime; i <= endTime; i++) {
    times.push(i.toString().padStart(2, '0') + ':00');
  }

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const buttonStyle = {
    position: 'fixed',
    bottom: '43px',
    right: '43px',
    borderRadius: '16px',
    backgroundColor: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    padding: '16px',
    color: '#0275FF'
  };

  const { width } = useWindowDimensions();

  let display = 'block';
  if (width <= Tablet) {
    display = 'none';
  }

  return (
    <>
      <Box
        display={'flex'}
        flexDirection={'row'}
        justifyContent={'start'}
        height={'100vh'}
      >
        <Box
          maxWidth={'220px'}
          height={'calc(100vh - 64px)'}
          display={display}
          sx={{
            borderRight: '1px solid #E0E3E7'
          }}
        >
          <MonthCalendar onDateClick={handleDateClick} selectedDate={selectedDate}/>
          <Divider sx={{ border: '1px solid #E0E3E7' }}/>
          <StatCard bookingCount={bookingCount} hourCount={hourCount}/>
        </Box>
        <Box>
          <Schedule onDateClick={handleDateClick} selectedDate={selectedDate} setBookingCount={setBookingCount} setHourCount={setHourCount} refresh={refresh} setRefresh={setRefresh} />
        </Box>
      </Box>
      <Tooltip title="Create Appointment" arrow>
        <Fab onClick={handleOpen} sx={buttonStyle}>
          <AddIcon/>
        </Fab>
      </Tooltip>

      <CreateAppointmentModal
          open={open}
          onClose={handleClose}
          setRefresh={setRefresh}
          refresh={refresh}
        />
    </>
  )
}