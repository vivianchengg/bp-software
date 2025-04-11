import React, { useEffect, useState } from 'react';
import { Modal, Box, Typography, TextField, Button, MenuItem, IconButton, useMediaQuery, Alert } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { apiCall } from '../helper';
import { Doctors } from '../interfaces';

interface Appointment {
  patient: string,
  appointment_date: string,
  appointment_time: number,
  appointment_length: number,
  provider: string,
  urgent: string,
  appointment_type: string,
  status: string,
  arrival_time: number,
  consultation_time: number,
  booked_by: string,
}

interface Props {
  open: boolean;
  onClose: () => void;
  id: number;
  refresh: boolean;
  setRefresh: (refresh: boolean) => void;
}

const sampleType = [
  {
    type: 'Standard appt.',
  },
  {
    type: 'Long appt.',
  },
  {
    type: 'Telephone Consult',
  },
]

const durations = [
  { "time": "15 mins" },
  { "time": "30 mins" },
  { "time": "45 mins" },
  { "time": "1 hr" },
  { "time": "1 hr 15 mins" },
  { "time": "1 hr 30 mins" },
  { "time": "1 hr 45 mins" },
  { "time": "2 hrs" },
  { "time": "2 hrs 15 mins" },
  { "time": "2 hrs 30 mins" },
  { "time": "2 hrs 45 mins" },
  { "time": "3 hrs" },
  { "time": "3 hrs 15 mins" },
  { "time": "3 hrs 30 mins" },
  { "time": "3 hrs 45 mins" },
  { "time": "4 hrs" },
  { "time": "4 hrs 15 mins" },
  { "time": "4 hrs 30 mins" },
  { "time": "4 hrs 45 mins" },
  { "time": "5 hrs" },
  { "time": "5 hrs 15 mins" },
  { "time": "5 hrs 30 mins" },
  { "time": "5 hrs 45 mins" },
  { "time": "6 hrs" }
]

const times = [
  { "time": "08:30" },
  { "time": "08:45" },
  { "time": "09:00" },
  { "time": "09:15" },
  { "time": "09:30" },
  { "time": "09:45" },
  { "time": "10:00" },
  { "time": "10:15" },
  { "time": "10:30" },
  { "time": "10:45" },
  { "time": "11:00" },
  { "time": "11:15" },
  { "time": "11:30" },
  { "time": "11:45" },
  { "time": "12:00" },
  { "time": "12:15" },
  { "time": "12:30" },
  { "time": "12:45" },
  { "time": "13:00" },
  { "time": "13:15" },
  { "time": "13:30" },
  { "time": "13:45" },
  { "time": "14:00" },
  { "time": "14:15" },
  { "time": "14:30" },
  { "time": "14:45" },
  { "time": "15:00" },
  { "time": "15:15" },
  { "time": "15:30" },
  { "time": "15:45" },
  { "time": "16:00" },
  { "time": "16:15" },
  { "time": "16:30" },
  { "time": "16:45" },
  { "time": "17:00" },
  { "time": "17:15" },
  { "time": "17:30" }
]

const statusOptions = [
  "At billing",
  "Completed",
  "Booked"
];

const urgentOptions = ["No", "Yes"]

const initData = {
  patient: '',
  appointment_date: '',
  appointment_time: 0,
  appointment_length: 0,
  provider: '',
  urgent: '',
  appointment_type: '',
  status: '',
  arrival_time: 0,
  consultation_time: 0,
  booked_by: '',
}

function convertDurationToSeconds(duration: string): number {
  const matches = duration.match(/(\d+)\s*(hrs?|mins?)/g);
  if (!matches) {
    throw new Error('Invalid duration format');
  }

  let totalSeconds = 0;

  for (const match of matches) {
    const [value, unit] = match.split(/\s+/);
    const numValue = parseInt(value, 10);

    if (unit.startsWith('hr')) {
      totalSeconds += numValue * 3600;
    } else {
      totalSeconds += numValue * 60;
    }
  }

  return totalSeconds;
}

function convertSecondsToDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  let durationParts: string[] = [];

  if (hours > 0) {
    durationParts.push(`${hours} hr${hours > 1 ? 's' : ''}`);
  }

  if (minutes > 0) {
    durationParts.push(`${minutes} min${minutes > 1 ? 's' : ''}`);
  }

  return durationParts.join(' ') || '0 mins';
}

function convertSecondsTo24HourTime(seconds: number): string {
  const totalSeconds = seconds % (24 * 3600);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

function convertTimeToSeconds(time: string): number {
  const [hoursStr, minutesStr] = time.split(':');
  const hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);

  let totalSeconds = hours * 3600 + minutes * 60;

  const startOfDay = 8 * 3600 + 30 * 60;
  const endOfDay = 17 * 3600 + 30 * 60;

  if (totalSeconds < startOfDay) {
    return startOfDay;
  } else if (totalSeconds > endOfDay) {
    return endOfDay;
  }

  return totalSeconds;
}


export const EditAppointmentModal = ({ open, onClose, id, refresh, setRefresh }: Props) => {
  const [appointData, setAppointData] = useState<Appointment>(initData);
  const [doctorlist, setDoctorList] = useState<Doctors[]>([]);
  const [patientlist, setPatientList] = useState<string[]>([]);
  const [notes, setNotes] = useState<string>("");
  const isSmallScreen = useMediaQuery('(max-width:598px)');
  const [error, setError] = useState('');
  const [errorOpen, setErrorOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;

  if (name === 'appointment_length') {
    const seconds = convertDurationToSeconds(value as string);
    setAppointData(prevState => ({
      ...prevState,
      [name]: seconds
    }));
  } else if (name === 'appointment_time') {
    const seconds = convertTimeToSeconds(value as string);
    setAppointData(prevState => ({
      ...prevState,
      [name]: seconds
    }));
  } else if (name === 'arrival_time') {
    const seconds = convertTimeToSeconds(value as string);
    setAppointData(prevState => ({
      ...prevState,
      [name]: seconds
    }));
  
  } else if (name === 'consultation_time') {
    const seconds = convertTimeToSeconds(value as string);
    setAppointData(prevState => ({
      ...prevState,
      [name]: seconds
    }));

  } else if (name === "notes") {
    setNotes(value as string);
  } else {
    setAppointData(prevState => ({
      ...prevState,
      [name!]: value
    }));
  }
  };

  const handleCancel = () => {
    setNotes("");
    onClose();
    setErrorOpen(false);
    setAppointData(initData);
  };

  useEffect(() => {
    const fetchAppointData = async (id: number) => {
      if (id === -1) {
        return;
      }

      const res = await apiCall('GET', `appointments/${id}`, {});
      if (res.error) {
        console.log(res.error);
        return;
      }

      const a = res;
      setAppointData(a);
      console.log(a);

    };

    fetchAppointData(id ?? -1);

    const fetchDoctorData = async () => {
      const res = await apiCall('GET', `/appointments/doctors`, {});
      if (res.error) {
        console.log(res.error);
        return;
      }

      const a = res;
      setDoctorList(a);
    };

    fetchDoctorData();

    const fetchPatientData = async () => {
      const res = await apiCall('GET', `patients/names`, {});
      if (res.error) {
        console.log(res.error);
        return;
      }

      const a = res;
      setPatientList(a);
    };

    fetchPatientData();

    // Handling edit notes by user
    const fetchNotes = async (id: number) => {
      if (id === -1) {
        return;
      }
      const res = await apiCall('GET', `appointments/notes/${id}`, {});
      if (res.error) {
        console.log(res.error);
        return;
      }

      if (res && res.note) {
        setNotes(res.note);
      } else {
        setNotes("");
      }
      
    };

      try {
        fetchNotes(id ?? -1);
      } catch (e) {
        console.log(e);
      }
    }, [open]);

  const handleSubmit = async() => {
    console.log(appointData);

    const apiData = {
      'patient': appointData.patient,
      'appointment_date': appointData.appointment_date,
      'appointment_time': appointData.appointment_time,
      'appointment_length': appointData.appointment_length,
      'provider': appointData.provider,
      'urgent': `${appointData.urgent}   `,
      'appointment_type': appointData.appointment_type,
      'status': appointData.status,
      'arrival_time': appointData.arrival_time,
      'consultation_time': appointData.consultation_time,
      'booked_by': appointData.booked_by,
    };

    const filterResponse = await apiCall(
      "GET",
      `appointments/filter?date=${appointData.appointment_date}&doctor_id=${appointData.provider}`, {}, false
    )
  
    if (filterResponse.error) {
      console.error(`Error: ${filterResponse.error.message}`);
      const errorMessage = `Error fetching appointment filter data: ${filterResponse.error.message}`;
      setError(errorMessage);
      setErrorOpen(true);
      return;
    }

    const newStartTimeInSeconds = appointData.appointment_time;
    const newEndTimeInSeconds = newStartTimeInSeconds + appointData.appointment_length;

    // Checking if new requested time is conflicting with other appointments already scheduled
    const conflictingAppointments = filterResponse.filter((existingAppointment: { appointmentId: Number; time: any; duration: any; }) => {
      const existingStartTimeInSeconds = existingAppointment.time;
      const existingEndTimeInSeconds = existingStartTimeInSeconds + existingAppointment.duration * 60;

      return (
        (newStartTimeInSeconds < existingEndTimeInSeconds && newEndTimeInSeconds > existingStartTimeInSeconds) &&
        existingAppointment.appointmentId !== id
      );
    });
  
    if (conflictingAppointments.length > 0) {
      const conflictMessages = conflictingAppointments.map((app: { patient: any; time: any; }) => `Patient ${app.patient} at ${convertSecondsTo24HourTime(app.time)}`).join(', ');
      const errorMessage = `The following appointments conflict with: ${conflictMessages}`;
      console.error(errorMessage);
      setError(errorMessage);
      setErrorOpen(true);
      return;
    }

    const res = await apiCall('PUT', `appointments/edit/${id}`, apiData);
    console.log(res);
    if (res.error) {
      console.log(res.error);
    } else {
      console.log(`Appointment ${id} edited successfully`);
    }
    
    const notes_1 = { "note" : notes}
    const res1 = await apiCall('PUT', `appointments/notes/${id}`, notes_1);

    setAppointData(initData);
    setNotes("");
    setErrorOpen(false);
    onClose();
    setRefresh(!refresh);
  };

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    padding: '15px',
    transform: 'translate(-50%, -50%)',
    width: isSmallScreen ? '90%' : '538px',
    display: 'flex',
    height: isSmallScreen ? '80%' : 'min(calc(100vh - 90px), 680px)',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '10px',
    flexShrink: '0',
    borderRadius: '15px',
    background: '#FFF'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '25px 10px',
    width: '100%'
  };

  const inputStyle = {
    width: '100%',
    marginBottom: '10px'
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Box display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          alignSelf="stretch">
          <Typography style={{
            margin: '10px 15px'
          }} variant='h4'>
            Edit Appointment
          </Typography>
          <IconButton onClick={onClose} style={{padding: '0px'}}>
            <CloseIcon style={{width: '30px', height: '30px'}}/>
          </IconButton>
        </Box>
        {errorOpen && (
          <Alert severity="error" sx={{
            padding: '5px',
            margin: '0px 15px',
            marginLeft: '30px',
            width: 'calc(100% - 40px)'
          }}>
            {error}
          </Alert>
        )}
        <Box style={{
          display: 'flex',
          padding: '15px',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          alignSelf: 'stretch',
          flex: '1 0 0',
          overflowY: 'auto',
          height: '100%'
        }}>

          {!isSmallScreen && (
            <Box style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flex: '1 0 0',
              width: '100%',
            }}>
              <Box sx={gridStyle}>
                <TextField
                  select
                  label="Patient"
                  value={appointData.patient}
                  onChange={handleInputChange}
                  name='patient'
                  required
                >
                  {patientlist.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  required
                  InputLabelProps={{ shrink: true }}
                  type='date'
                  label="Date"
                  onChange={handleInputChange}
                  value={appointData.appointment_date}
                  name='appointment_date'
                  style={inputStyle}
                />
                <TextField
                  select
                  label="Time"
                  onChange={handleInputChange}
                  value={convertSecondsTo24HourTime(appointData.appointment_time)}
                  name='appointment_time'
                  required
                >
                  {times.map((option) => (
                    <MenuItem key={option.time} value={option.time}>
                      {option.time}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  select
                  label="Duration"
                  onChange={handleInputChange}
                  value={convertSecondsToDuration(appointData.appointment_length)}
                  name='appointment_length'
                  required
                >
                  {durations.map((option) => (
                    <MenuItem key={option.time} value={option.time}>
                      {option.time}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  select
                  label="Host"
                  onChange={handleInputChange}
                  value={appointData.provider}
                  name='provider'
                  required
                >
                  {doctorlist.map((option: Doctors) => (
                    <MenuItem key={option.name} value={option.name}>
                      {option.name}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  select
                  label="Urgent"
                  onChange={handleInputChange}
                  value={appointData.urgent}
                  name='urgent'
                  required
                >
                  {urgentOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  select
                  label="Appointment Type"
                  onChange={handleInputChange}
                  value={appointData.appointment_type}
                  name='appointment_type'
                  required
                >
                  {sampleType.map((option) => (
                    <MenuItem key={option.type} value={option.type}>
                      {option.type}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  select
                  label="Status"
                  onChange={handleInputChange}
                  value={appointData.status.trim()}
                  name='status'
                  required
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  select
                  label="Arrival Time"
                  onChange={handleInputChange}
                  value={convertSecondsTo24HourTime(appointData.arrival_time)}
                  name='arrival_time'
                >
                  {times.map((option) => (
                    <MenuItem key={option.time} value={option.time}>
                      {option.time}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  select
                  label="Consultation Time"
                  onChange={handleInputChange}
                  value={convertSecondsTo24HourTime(appointData.consultation_time)}
                  name='consultation_time'
                >
                  {times.map((option) => (
                    <MenuItem key={option.time} value={option.time}>
                      {option.time}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            </Box>
          )}

          {isSmallScreen && (
            <Box style={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
            }}>
              <Box sx={{ width: '100%', marginBottom: 2 }}>
                <TextField
                  select
                  label="Patient"
                  value={appointData.patient}
                  onChange={handleInputChange}
                  name='patient'
                  required
                  fullWidth
                >
                  {patientlist.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            
              <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, marginBottom: 2 }}>
                <TextField
                  required
                  InputLabelProps={{ shrink: true }}
                  type='date'
                  label="Date"
                  onChange={handleInputChange}
                  value={appointData.appointment_date}
                  name='appointment_date'
                  fullWidth
                />
                <TextField
                  select
                  label="Time"
                  onChange={handleInputChange}
                  value={convertSecondsTo24HourTime(appointData.appointment_time)}
                  name='appointment_time'
                  required
                  fullWidth
                >
                  {times.map((option) => (
                    <MenuItem key={option.time} value={option.time}>
                      {option.time}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, marginBottom: 2 }}>
                <TextField
                  select
                  label="Duration"
                  onChange={handleInputChange}
                  value={convertSecondsToDuration(appointData.appointment_length)}
                  name='appointment_length'
                  required
                  fullWidth
                >
                  {durations.map((option) => (
                    <MenuItem key={option.time} value={option.time}>
                      {option.time}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  select
                  label="Urgent"
                  onChange={handleInputChange}
                  value={appointData.urgent}
                  name='urgent'
                  required
                  fullWidth
                >
                  {urgentOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            
              <Box sx={{ width: '100%', marginBottom: 2 }}>
                <TextField
                  select
                  label="Host"
                  onChange={handleInputChange}
                  value={appointData.provider}
                  name='provider'
                  required
                  fullWidth
                >
                  {doctorlist.map((option: Doctors) => (
                    <MenuItem key={option.name} value={option.name}>
                      {option.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            
              <Box sx={{ width: '100%', marginBottom: 2 }}>
                <TextField
                  select
                  label="Appointment Type"
                  onChange={handleInputChange}
                  value={appointData.appointment_type}
                  name='appointment_type'
                  required
                  fullWidth
                >
                  {sampleType.map((option) => (
                    <MenuItem key={option.type} value={option.type}>
                      {option.type}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            
              <Box sx={{ width: '100%', marginBottom: 2 }}>
                <TextField
                  select
                  label="Status"
                  onChange={handleInputChange}
                  value={appointData.status.trim()}
                  name='status'
                  required
                  fullWidth
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, marginBottom: 2 }}>
                <TextField
                  select
                  label="Arrival Time"
                  onChange={handleInputChange}
                  value={convertSecondsTo24HourTime(appointData.arrival_time)}
                  name='arrival_time'
                  fullWidth
                >
                  <MenuItem value="0">N/A</MenuItem>
                  {times.map((option) => (
                    <MenuItem key={option.time} value={option.time}>
                      {option.time}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  select
                  label="Consultation Time"
                  onChange={handleInputChange}
                  value={convertSecondsTo24HourTime(appointData.consultation_time)}
                  name='consultation_time'
                  fullWidth
                >
                  <MenuItem value="0">N/A</MenuItem>
                  {times.map((option) => (
                    <MenuItem key={option.time} value={option.time}>
                      {option.time}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            </Box>
          )}

          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flex: '1 0 0',
            alignSelf: 'stretch',
            paddingY: '10px',
            marginTop: isSmallScreen ? '0px' : '10px',
          }}>
            <TextField
              label="Note"
              multiline
              fullWidth
              name = "notes"
              variant="outlined"
              style={{ display:"flex", flexDirection:"column", alignItems:"flex-start", alignSelf:"stretch", flex: '1'}}
              value = {
                notes
              }
              onChange={handleInputChange}
              InputProps={{
                style: {
                  color: 'var(--text-primary, rgba(0, 0, 0, 0.87))',
                  fontSize: '16px',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  lineHeight: '24px',
                  letterSpacing: '0.15px',
                  flex: '1 0 0',
                  alignSelf: 'stretch',    
                  alignItems: 'flex-start',
                }
              }}
              InputLabelProps={{shrink: true}}
            />
          </Box>
        </Box>
        <Box style={{
          display: 'flex',
          padding: '10px',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          alignSelf: 'stretch',
        }}>
          <Button 
            onClick={handleCancel} 
            style={{
              color: 'var(--primary-main, #2196F3)',
              display: 'flex',
              padding: '8px 22px',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 'var(--borderRadius, 4px)',
              background: '#FFFFFF',
              border: 'solid',
              borderWidth: '1px',
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit} 
            id='submit-edit-appoint'
            style={{
              color: '#FFF',
              display: 'flex',
              padding: '8px 22px',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 'var(--borderRadius, 4px)',
              background: 'var(--primary-main, #2196F3)',
            }}
          >
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
