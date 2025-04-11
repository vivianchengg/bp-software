import React, { useEffect, useState } from 'react';
import { CalendarBar } from '../components/CalendarBar';
import { TimeSlot } from '../components/TimeSlot';
import { TimeZone } from '../components/TimeZone';
import { TimeBlock } from '../components/TimeBlock';
import Box from '@mui/material/Box';
import dayjs from 'dayjs';
import { WorkerCard } from '../components/WorkerCard';
import { EventBoard } from '../components/EventBoard';
import { AppointmentDetailModal } from '../components/AppointmentDetailModal';
import { EditAppointmentModal } from '../components/EditAppointmentModal';
import { DeleteAppointmentModal } from './DeleteAppointmentModal';
import { apiCall, Mobile, Tablet, useWindowDimensions } from '../helper';
import { Profile, Doctors, AppointmentDetails } from '../interfaces';
import { Typography } from '@mui/material';

interface Props {
  onDateClick: (date: string) => void;
  selectedDate: string;
  setBookingCount: (number: number) => void;
  setHourCount: (number: number) => void;
  refresh: boolean;
  setRefresh: (refresh: boolean) => void;
}

// Get all profiles
const fetchAllProfiles = async (signal: AbortSignal) => {
  const response = await await apiCall("GET", "auth/getAllProfile", {}, true, signal);
  return response.users.map((profile: Profile) => ({
      name: profile.name,
      position: profile.position,
      picture: profile.picture,
      appointments: [],
  }));
};

// Get all appointments for the doctor
const fetchAppointments = async (date: string, doctorId: string, signal: AbortSignal) => {
  const response = await apiCall(
    "GET",
    `appointments/filter?date=${date}&doctor_id=${doctorId}`, {}, false,
    signal
  );
  return response;
};

export const Schedule = ({ onDateClick, selectedDate, setBookingCount, setHourCount, refresh, setRefresh }: Props) => {

  const startTime = 8.5;
  const endTime = 18;

  let timeZone = 'AEST';

  let times : string[] = [];
  for (let i = startTime; i < endTime; i += 0.5) {
    times.push(Math.floor(i).toString().padStart(2, '0') + (i - Math.floor(i) ? ':30' : ':00'));
  }

  const [profile, setProfile] = useState<Doctors[]>([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<AppointmentDetails | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchProfiles = async () => {
      try {
        return await fetchAllProfiles(signal);
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          console.error("Error fetching profiles:", error);
          window.alert("Error: Unable to get doctors");
        } else {
          console.log('Abortted');
        }
        return [];
      }
    };

    const setAppointments = async (signal: AbortSignal, templateProfiles: Doctors[]) => {
      try {
        const date = dayjs(selectedDate).format('YYYY-MM-DD');

        const profileSetted = await Promise.all(
          templateProfiles.map(async (doc) => {
            doc.appointments = await fetchAppointments(date, doc.name, signal);
            return doc;
          })
        );

        if (!signal.aborted) {
          setProfile(profileSetted);

          // Update Stat Card
          const mainUser = profileSetted[0] || [];
          setBookingCount(mainUser.appointments.length);
          setHourCount(mainUser.appointments.reduce((acc, curr) => acc + curr.duration, 0));
        }
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          console.error("Error fetching appointments:", error);
        } else {
          console.log('Abortted');
        }
      }
    };

    const loadScheduleData = async () => {
      setLoading(true);
      const templateProfiles = await fetchProfiles();
      await setAppointments(signal, templateProfiles);
      if (!signal.aborted) {
        setLoading(false);
      }
    };

    loadScheduleData();

    return () => controller.abort();

  }, [selectedDate, refresh]);

  const handleOpenModal = (patient: AppointmentDetails) => {
    setSelectedPatient(patient);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedPatient(null);
  };

  const handleOpenEdit = (patient: AppointmentDetails | null) => {
    setSelectedPatient(patient);
    setEditOpen(true);
  };

  const handleCloseEdit = () => {
    setEditOpen(false);
    setSelectedPatient(null);
  };

  const handleOpenDelete = (patient: AppointmentDetails | null) => {
    setSelectedPatient(patient);
    setDeleteOpen(true);
  };

  const handleCloseDelete = () => {
    setDeleteOpen(false);
    setSelectedPatient(null);
  };

  const { width } = useWindowDimensions();

  // Mobile responsive
  if (width <= Mobile) {
    return (
      <Box
        display={'flex'}
        flexDirection={'column'}
        width={'100vw'}
      >
        <CalendarBar onDateClick={(newDate) => onDateClick(newDate)} selectedDate={selectedDate}/>
        <Box
          display={'flex'}
          flexDirection={'row'}
        >
          {loading ? <Box width='100%' display='flex' justifyContent='center'><Typography variant='h4'>Loading...</Typography></Box> :
          <>
            <Box
              width={`100%`}
              flexShrink={0}
            >
              <Box
                display={'flex'}
                flexDirection={'row'}
                width={'100%'}
                sx={{
                  borderBottom: '1px solid #DCDFE3',
              }}>
                <TimeZone timeZone={timeZone}/>
                <WorkerCard key={profile[0].name} profile={profile[0]} />
              </Box>
              <Box
                display={'flex'}
                flexDirection={'row'}
                sx={{
                  width: '100%',
                  height: 'calc(100vh - 56px - 50px - 64px - 4px)',
                  overflowY: 'scroll',
                  overflowX: 'clip',
                  scrollbarWidth: 'none',
                }}
              >
                <Box display={'flex'} flexDirection={'column'}>
                  {times.map(time => (
                    <TimeBlock time={time}/>
                  ))}
                </Box>
                <Box
                  display={'flex'}
                  flexDirection={'column'}
                  position={'relative'}
                  flexGrow={1}
                  flexShrink={0}
                  flexWrap={'nowrap'}
                  width={'100%'}
                  key={profile[0].name}
                >
                  {times.map(_ => (
                    <TimeSlot key={_} />
                  ))}
                  <EventBoard events={profile[0].appointments} onOpenModal={handleOpenModal} doctor_id={profile[0].name} />
                </Box>
                <AppointmentDetailModal open={modalOpen} onClose={handleCloseModal} patient={selectedPatient} date={selectedDate} onEditClick={handleOpenEdit} onDeleteClick={handleOpenDelete}/>
                <EditAppointmentModal open={editOpen} onClose={handleCloseEdit} id={selectedPatient?.id ?? -1} refresh={refresh} setRefresh={setRefresh}/>
                <DeleteAppointmentModal open={deleteOpen} onClose={handleCloseDelete} id={selectedPatient?.id ?? -1 } refresh={refresh} setRefresh={setRefresh}/>
              </Box>
            </Box>
            <Box sx={{
              minWidth: '16px',
              borderLeft: '2px solid #DCDFE3',
              borderTop: '1px solid #DCDFE3',
              position: 'sticky',
              right: '0',
              backgroundColor: 'white',
              flexGrow: 1
            }}/>
          </>
          }
        </Box>
      </Box>
    )
  }

  // Tablet responsive
  if (width <= Tablet) {
    return (
      <Box
        display={'flex'}
        flexDirection={'column'}
        width={'calc(100vw - 80px)'}
      >
        <CalendarBar onDateClick={(newDate) => onDateClick(newDate)} selectedDate={selectedDate}/>
        <Box
          display={'flex'}
          flexDirection={'row'}
        >
          {loading ? <Box width='100%' display='flex' justifyContent='center'><Typography variant='h4'>Loading...</Typography></Box> :
          <>
            <Box
              width={`min(100%, calc(${profile.length} * 500px))`}
              flexShrink={0}
            >
              <Box
                display={'flex'}
                flexDirection={'row'}
                width={'100%'}
                sx={{
                  borderBottom: '1px solid #DCDFE3',
              }}>
                <TimeZone timeZone={timeZone}/>
                {
                  profile.map(prof => (
                    <WorkerCard key={prof.name} profile={prof} />
                  ))
                }
              </Box>
              <Box
                display={'flex'}
                flexDirection={'row'}
                sx={{
                  width: '100%',
                  height: 'calc(100vh - 56px - 50px - 64px - 4px)',
                  overflowY: 'scroll',
                  overflowX: 'clip',
                  scrollbarWidth: 'none',
                }}
              >
                <Box display={'flex'} flexDirection={'column'}>
                  {times.map(time => (
                    <TimeBlock time={time}/>
                  ))}
                </Box>
                {
                  profile.map(prof => (
                    <Box
                      display={'flex'}
                      flexDirection={'column'}
                      position={'relative'}
                      flexGrow={1}
                      flexWrap={'nowrap'}
                      minWidth={'307px'}
                      maxWidth={'500px'}
                      key={prof.name}
                    >
                      {times.map(_ => (
                        <TimeSlot key={_} />
                      ))}
                      <EventBoard events={prof.appointments} onOpenModal={handleOpenModal} doctor_id={prof.name} />
                    </Box>
                  ))
                }
                <AppointmentDetailModal open={modalOpen} onClose={handleCloseModal} patient={selectedPatient} date={selectedDate} onEditClick={handleOpenEdit} onDeleteClick={handleOpenDelete}/>
                <EditAppointmentModal open={editOpen} onClose={handleCloseEdit} id={selectedPatient?.id ?? -1} refresh={refresh} setRefresh={setRefresh}/>
                <DeleteAppointmentModal open={deleteOpen} onClose={handleCloseDelete} id={selectedPatient?.id ?? -1 } refresh={refresh} setRefresh={setRefresh}/>
              </Box>
            </Box>
            <Box sx={{
              minWidth: '16px',
              borderLeft: '2px solid #DCDFE3',
              borderTop: '1px solid #DCDFE3',
              position: 'sticky',
              right: '0',
              backgroundColor: 'white',
              flexGrow: 1
            }}/>
          </>
          }
        </Box>
      </Box>
    )
  }

  // Full screens
  return (
    <Box
      display={'flex'}
      flexDirection={'column'}
      width={'calc(100vw - 300px)'}
    >
      <CalendarBar onDateClick={(newDate) => onDateClick(newDate)} selectedDate={selectedDate}/>
      <Box
        display={'flex'}
        flexDirection={'row'}
      >
        {loading ? <Box width='100%' display='flex' justifyContent='center'><Typography variant='h4'>Loading...</Typography></Box> :
        <>
          <Box
            width={`min(100%, calc(${profile.length} * 500px))`}
            flexShrink={0}
          >
            <Box
              display={'flex'}
              flexDirection={'row'}
              width={'100%'}
              sx={{
                borderBottom: '1px solid #DCDFE3',
            }}>
              <TimeZone timeZone={timeZone}/>
              {
                profile.map(prof => (
                  <WorkerCard key={prof.name} profile={prof} />
                ))
              }
            </Box>
            <Box
              display={'flex'}
              flexDirection={'row'}
              sx={{
                width: '100%',
                height: 'calc(100vh - 56px - 50px - 64px - 4px)',
                overflowY: 'scroll',
                overflowX: 'clip',
                scrollbarWidth: 'none',
              }}
            >
              <Box display={'flex'} flexDirection={'column'}>
                {times.map(time => (
                  <TimeBlock time={time}/>
                ))}
              </Box>
              {
                profile.map(prof => (
                  <Box
                    display={'flex'}
                    flexDirection={'column'}
                    position={'relative'}
                    flexGrow={1}
                    flexWrap={'nowrap'}
                    minWidth={'307px'}
                    maxWidth={'500px'}
                    key={prof.name}
                  >
                    {times.map(_ => (
                      <TimeSlot key={_} />
                    ))}
                    <EventBoard events={prof.appointments} onOpenModal={handleOpenModal} doctor_id={prof.name} />
                  </Box>
                ))
              }
              <AppointmentDetailModal open={modalOpen} onClose={handleCloseModal} patient={selectedPatient} date={selectedDate} onEditClick={handleOpenEdit} onDeleteClick={handleOpenDelete}/>
              <EditAppointmentModal open={editOpen} onClose={handleCloseEdit} id={selectedPatient?.id ?? -1} refresh={refresh} setRefresh={setRefresh}/>
              <DeleteAppointmentModal open={deleteOpen} onClose={handleCloseDelete} id={selectedPatient?.id ?? -1 } refresh={refresh} setRefresh={setRefresh}/>
            </Box>
          </Box>
          <Box sx={{
            minWidth: '16px',
            borderLeft: '2px solid #DCDFE3',
            borderTop: '1px solid #DCDFE3',
            position: 'sticky',
            right: '0',
            backgroundColor: 'white',
            flexGrow: 1
          }}/>
        </>
        }
      </Box>
    </Box>
  )
}

