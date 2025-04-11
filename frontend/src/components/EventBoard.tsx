import React from 'react';
import Box from '@mui/material/Box';
import { EventCard } from '../components/EventCard';
import { Appointment, AppointmentDetails } from '../interfaces';

interface Props {
  events: Appointment[];
  onOpenModal: (patient: AppointmentDetails) => void;
  doctor_id: string;
}


export const EventBoard = ({ events, onOpenModal, doctor_id }: Props) => (
  <Box
    flexShrink={0}
    flexGrow={1}
    position={'absolute'}
    sx={{
      height: '100%',
      width: '100%',
    }}
  >
    {
      events.map(event => {
        return (
          <EventCard
            key={`${event.patient}-${event.time}`}
            name={event.patient}
            medicare={event.medicare}
            time={event.time}
            duration={event.duration}
            appointmentType={event.appointmentType}
            overYearAgo={event.overYearAgo}
            lastAppointment={event.lastAppointment}
            id={event.patientId}
            doctor_id={doctor_id}
            appointment_id={event.appointmentId}
            onOpenModal={onOpenModal}
          />
        );
      })
    }
  </Box>
);