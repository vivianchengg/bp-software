import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { Box } from '@mui/material';
import Chip from '@mui/material/Chip';
import { apiCall, useWindowDimensions } from "../helper";

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

interface Props {
  name: string;
  medicare: boolean;
  time: number;
  duration: number;
  appointmentType: string;
  overYearAgo: boolean;
  lastAppointment: string;
  id: number;
  doctor_id: string;
  appointment_id: number;
  onOpenModal: (patient: AppointmentDetails) => void;
}

interface AppointmentDetails {
  id: number,
  title: string,
  name: string,
  gender: string,
  dob: string,
  email: string,
  mobile_phone: string,
  address1: string,
  address2: string,
  city: string,
  postcode: string,
  medicare_no: string,
  health_fund_name: string,
  health_fund_no: string
  medicare: boolean,
  overYearAgo: string,
  appointmentType: string,
  duration: number,
  time: number,
  doctor: string,
  note: string,
  lastAppointment: string,
};

export const EventCard = ({ name, medicare, time, duration, appointmentType, overYearAgo, lastAppointment, id, doctor_id, appointment_id, onOpenModal }: Props) => {

  const [isClicked, clicked] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  let appColor = '#FBB500';

  let position = ((time / 3600) - 8.5) * 83 * 2;
  let size = (((duration / 60) * 83) * 2) - 8;


  let phone = false;
  if (appointmentType === 'Telephone Consult') {
    phone = true;
  }

  if (phone) {
    appColor = '#0275FF';
  } else if (!medicare) {
    appColor = '#EB2347';
  }

  let lastAttendance;
  if (phone && lastAppointment) {
    lastAttendance = dayjs(lastAppointment).format('DD/MM/YYYY');
  }

  useEffect(() => {
    if (hasMounted) {
      const fetchPatientData = async (patientId: number) => {
        if (patientId === -1) {
          return;
        }

        const res = await apiCall('GET', `patients/${patientId}`, {});
        if (res.error) {
          console.log(res.error);
          return;
        }

        const p = res;
        p.name = name;
        p.medicare = medicare;
        p.overYearAgo = overYearAgo;
        p.appointmentType = appointmentType;
        p.duration = duration;
        p.time = time;
        p.doctor = doctor_id;
        p.id = appointment_id;
        p.lastAppointment = lastAppointment;
        onOpenModal(p);
      };
      fetchPatientData(id);
    }
  }, [isClicked]);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const { width } = useWindowDimensions();

  let wide = width <= 600 ? 'calc(100% - 80px)' : 'calc(100% - 20px)';

  let occupySpace = '100px';
  if (medicare === false && lastAttendance) {
    occupySpace = '185px';
  } else if (medicare !== false && !lastAttendance) {
    occupySpace = '0px';
  }

  return (
    <Box
      display={'flex'}
      flexDirection={'row'}
      justifyContent={'space-between'}
      position={'absolute'}
      onClick={() => clicked(!isClicked)}
      sx={{
        backgroundColor: '#F3F4F6',
        top: position,
        height: size,
        width: wide,
        borderRadius: '5px',
        borderLeft: '4px solid',
        borderLeftColor: appColor,
        padding: '2px 0px 4px 6px',
        overflow: 'clip',
        cursor: 'pointer',
      }}
    >
      <Box
        display={'flex'}
        flexDirection={'column'}
        sx={{
          width: `calc(100% - ${occupySpace})`
        }}
      >
        <style>
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,100..900;1,100..900&display=swap');
        </style>
        <text
          style={{
            fontFamily: 'Noto Sans',
            fontSize: '13px',
            color: '#3B3E45',
            width: "100%",
            textOverflow: 'ellipsis',
            overflowX: 'hidden',
            whiteSpace: 'nowrap',
        }}>
          {name}
        </text>
        <text style={{
          fontFamily: 'Noto Sans',
          fontSize: '11px',
          color: '#666E7D',
          width: "100%",
          textOverflow: 'ellipsis',
          overflowX: 'hidden',
          whiteSpace: 'nowrap',
        }}>
          {appointmentType}
        </text>
      </Box>
      <Box
        sx={{
          marginLeft: '10px',
          width: `${occupySpace}`
        }}
      >
        {overYearAgo && phone && <Chip
          label={lastAttendance}
          color="primary"
          variant="filled"
          size='small'
          sx={{
            borderRadius: '7px',
            letterSpacing: '0.5px',
            fontSize: '11px',
            marginRight: '5px'
          }}/>
        }
        {!medicare && <Chip
          label="No Medicare"
          color="error"
          variant="filled"
          size='small'
          sx={{
            borderRadius: '7px',
            letterSpacing: '0.5px',
            fontSize: '11px',
            marginRight: '5px'
          }}/>
        }
      </Box>
    </Box>
  );
}
