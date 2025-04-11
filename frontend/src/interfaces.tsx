export interface Doctors {
  name: string,
  position: string,
  picture: string,
  appointments: Appointment[],
}

export interface Patient {
  name: string;
  gender: string;
  dob: string;
  email: string;
  phone: string;
  medicare: boolean;
  host: string;
  address: string;
  fundName: string;
  fundNum: string;
  date: string;
  time: string;
  duration: string;
  type: string;
  note: string;
  lastAttend: string;
}

export interface Appointment {
  appointmentId: number;
  patientId: number;
  patient: string;
  phone: string;
  medicare: boolean;
  overYearAgo: boolean;
  time: number;
  duration: number;
  appointmentType: string;
  lastAppointment: string;
}

export interface Profile {
  name: string,
  position: string,
  picture: string,
}

export interface AppointmentDetails {
  id: number,
  name: string,
  gender: string,
  dob: string,
  email: string,
  mobile_phone: string,
  address1: string,
  address2: string,
  city: string,
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
