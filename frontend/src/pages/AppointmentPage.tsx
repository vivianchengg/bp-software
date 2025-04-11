import React, { useState } from 'react';

interface Appointment {
  internal_id: number;
  patient: string;
  appointment_date: string;
  appointment_time: number;
  appointment_length: number;
  provider: string;
  urgent: string;
  appointment_type: string;
  status: string;
  arrival_time: number;
  consultation_time: number;
  booked_by: string;
}

export const AppointmentPage = () => {
  const [appointments] = useState<Appointment[]>([]);

  return (
    <div>
      <h1>Appointments</h1>
      <ul>
        {appointments.map(appointment => (
          <li key={appointment.internal_id}>
            <strong>Patient:</strong> {appointment.patient} <br />
            <strong>Appointment Date:</strong> {appointment.appointment_date} <br />
            <strong>Time:</strong> {appointment.appointment_time} <br />
            <strong>Length:</strong> {appointment.appointment_length} minutes <br />
            <strong>Provider:</strong> {appointment.provider} <br />
            <strong>Urgent:</strong> {appointment.urgent} <br />
            <strong>Type:</strong> {appointment.appointment_type} <br />
            <strong>Status:</strong> {appointment.status} <br />
            <strong>Arrival Time:</strong> {appointment.arrival_time} <br />
            <strong>Consultation Time:</strong> {appointment.consultation_time} <br />
            <strong>Booked By:</strong> {appointment.booked_by}
          </li>
        ))}
      </ul>
    </div>
  );
};
