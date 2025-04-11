import React, { useEffect, useState } from 'react';
import { Box, Typography, Chip } from "@mui/material";
import { Appointment, Patient } from "./PatientProfile";
import dayjs from "dayjs";
import { pid } from 'process';
import { apiCall } from '../helper';

interface Props {
  appointment: Appointment | undefined,
  isNarrow: boolean,
}

export const AppointmentCard = ({ appointment, isNarrow }: Props) => {
  const pColor = '#0275FF';
  const normalColor = '#BDBDBD';
  const [isPhone, setIsPhone] = useState(false);
  const [lastApp, setLastApp] = useState('');
  const [isOverYear, setIsOverYear] = useState(false);

  // Converting time
  const formatTime = (timeInSeconds: number, lengthInSeconds: number) => {
    const startTime = dayjs().startOf('day').add(timeInSeconds, 'second');
    const endTime = startTime.add(lengthInSeconds, 'second');

    const formattedStartTime = startTime.format('HH:mm');
    const formattedEndTime = endTime.format('HH:mm');

    const duration_hour = Math.floor(lengthInSeconds / 3600);
    const duration_min = Math.floor(lengthInSeconds / 60);
    const minLeft = duration_min % 60;

    const durationString = duration_hour > 0
      ? `${duration_hour} hr${minLeft > 0 ? ` ${minLeft} min` : ''}`
      : `${duration_min} min`;

    return `${formattedStartTime}-${formattedEndTime} (${durationString})`;
  };

  useEffect(() => {
    const fetchPCheck = async() => {
      const appId = appointment?.appointment_id;

      if (!appId) {
        return;
      }
      // Make an API call to check phone-related and timing details for the appointment
      const res = await apiCall('GET', `appointments/pcheck?appointment_id=${appId}`, {}, true);

      if (res.error) {
        console.log(res.error);
        return;
      }

      if (!res) {
        return;
      }

      setIsPhone(res.isPhone); // Whether the appointment is phone-related
      setIsOverYear(res.overYearAgo); // Whether the appointment was over a year ago
      setLastApp(res.lastAppointment); // Details of the last appointment
    };

    fetchPCheck();
  });

  return (
    <Box
      display="flex"
      flexDirection={isNarrow ? 'column' : 'row'}
      justifyContent="space-between"
      p={'10px 15px'}
      sx={{
        backgroundColor: '#F3F4F6',
        borderRadius: '5px',
        borderLeft: '4px solid',
        borderLeftColor: isOverYear ? pColor : normalColor,
      }}
    >
      <Box display={'flex'} flexDirection={'column'}>
        <Typography>{appointment?.appointment_type}</Typography>
        <Typography variant="caption">{appointment?.status}</Typography>
        { isNarrow &&
          <Box display="flex" flexDirection="column">
            <Typography>{appointment?.appointment_date}</Typography>
            {appointment?.appointment_time && appointment?.appointment_length &&
              <Typography>{formatTime(appointment?.appointment_time, appointment?.appointment_length)}</Typography>
            }
            <Typography variant="caption">{appointment?.provider}</Typography>
          </Box>
        }
        <Box
          display={'flex'}
          flexDirection={isNarrow ? 'column' : 'row'}
          gap={isNarrow ? 1 : 0}
        >
          {/* Mobile Responsiveness */}
          { isPhone &&
            <Chip
              label={`Phone: ${lastApp !== '' ? lastApp : '-'}`}
              color="primary"
              variant="outlined"
              size='medium'
              sx={{
                backgroundColor: 'white',
                borderRadius: '6px',
                fontWeight: 'bold',
                letterSpacing: '0.5px',
                fontSize: '12px',
                marginRight: '5px'
              }}
            />
          }
        </Box>
      </Box>
      { !isNarrow &&
        <Box display="flex" flexDirection="column" alignItems="flex-end">
          <Typography>{appointment?.appointment_date}</Typography>
          {appointment?.appointment_time && appointment?.appointment_length &&
            <Typography>{formatTime(appointment?.appointment_time, appointment?.appointment_length)}</Typography>
          }
          <Typography variant="caption">{appointment?.provider}</Typography>
        </Box>
      }
    </Box>
  );
};