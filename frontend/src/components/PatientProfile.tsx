import { Avatar, Box, Button, Chip, CircularProgress, Switch, Typography, useMediaQuery, useTheme } from "@mui/material";
import React, { useEffect, useRef, useState } from 'react';
import { apiCall } from "../helper";
import dayjs from "dayjs";
import Grid from '@mui/material/Grid2';
import { AppointmentCard } from "./AppointmentCard";

interface Props {
  pid: number,
  setDeleteOpen: (open: boolean) => void,
  setEditOpen: (open: boolean) => void,
  setPatientId: (iid: number) => void,
  refresh: boolean,
  setPBarOpen: (open: boolean) => void,
}

export interface Patient {
  iid: number,
  title: string,
  firstname: string,
  surname: string,
  gender: string,
  dob: string,
  email: string,
  phone: string,
  address1: string,
  address2: string,
  city: string,
  postcode: string,
  medicare_no: string,
  health_fund_name: string,
  health_fund_no: string,
  appointments: Appointment[], // all past and future appointments
};

export interface Appointment {
  appointment_id: number,
  appointment_date: string,
  appointment_time: number,
  appointment_length: number,
  provider: string,
  appointment_type: string,
  status: string,
  urgent: string
};

// convert second and format as "HH:mm"
export const convertTime = (s: number) => {
  const hours = Math.floor(s / 3600);
  const minutes = Math.floor((s % 3600) / 60);
  return `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
};

export const PatientProfile = ({ pid, setDeleteOpen, setEditOpen, setPatientId, refresh, setPBarOpen }: Props) => {
  const [patient, setPatient] = useState<Patient>();
  const [pastApps, setPastApps] = useState<Appointment[]>([]);
  const [futureApps, setFutureApps] = useState<Appointment[]>([]);
  const [isMTag, setIsMTag] = useState(false);
  const [isPast, setIsPast] = useState(false);
  const [address, setAddress] = useState('NA');
  const now = dayjs();
  const [isLoading, setIsLoading] = useState(false);

  const sectionRef = useRef<HTMLDivElement>(null);
  const [isMed, setIsMed] = useState(false);
  const [isNarrow, setIsNarrow] = useState(false);
  const [isBlur, setIsBlur] = useState(false);
  const [isMoreScroll, setIsMoreScroll] = useState(false);
  const [isMMoreScroll, setIsMMoreScroll] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleDelete = () => {
    setDeleteOpen(true);
  };

  const handleEdit = () => {
    setPatientId(patient ? patient.iid : -1);
    setEditOpen(true);
  };

  const handleBackButton = () => {
    setPBarOpen(true);
  };

  const formatDOB = (dob: string | undefined) => {
    const date = dayjs(dob);
    const today = dayjs();

    const formatted = date.format('DD/MM/YYYY');
    const age = today.diff(date, 'year');

    return `${formatted} (${age} y/o)`;
  };

  const checkStr = (str: string) => {
    return str ? String(str).trim() : '';
  };

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (entry.contentRect.width < 586) {
          setIsMed(true);
        } else {
          setIsMed(false);
        }

        // If on narrow mobile, blur out the patient details, show only
        // list
        if (entry.contentRect.width < 400) {
          setIsNarrow(true);
          setIsMed(false);
        } else {
          setIsNarrow(false);
        }

        setIsBlur(entry.contentRect.width < 230);
        setIsMoreScroll(entry.contentRect.width < 268);
        setIsMMoreScroll(entry.contentRect.width < 202);

      }
    });

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [refresh]);


  useEffect(() => {

    setIsLoading(true);
    
    if (pid === -1) {
      return;
    }
    
    try {
      const fetchPatientData = async (id: number) => {
        const res = await apiCall('GET', `patients/${pid}`, {}, false);
        if (res.error) {
          console.log(res.error);
          return;
        }

        const p = res;
        setPatient(p);
        console.log(p);
  
        const tempAddressParts = [
          checkStr(p.address1),
          checkStr(p.address2),
          checkStr(p.city),
          checkStr(p.postcode),
        ]
        const tempAddress = tempAddressParts.filter(Boolean).join(', ');
        setAddress(tempAddress)
        setIsMTag(!p.medicare_no);
  
        const apps = p.appointments || [];

        // handle appointments
        const pastList: Appointment[] = [];
        const futureList: Appointment[] = [];
  
        apps.forEach((a: Appointment) => {
          const appTime = dayjs(`${a.appointment_date} ${convertTime(a.appointment_time)}`);
          if (appTime.isBefore(now)) {
            pastList.push(a);
          } else {
            futureList.push(a);
          }
        });
        
        // sort app list
        pastList.sort((a, b) => {
          if (a.appointment_date !== b.appointment_date) {
            return a.appointment_date.localeCompare(b.appointment_date);
          }
          return a.appointment_time - b.appointment_time;
        });

        futureList.sort((a, b) => {
          if (a.appointment_date !== b.appointment_date) {
            return a.appointment_date.localeCompare(b.appointment_date);
          }
          return a.appointment_time - b.appointment_time;
        });

        setPastApps(pastList);
        setFutureApps(futureList);

        setIsLoading(false);

      };
      fetchPatientData(pid);
    } catch (error) {
      if ((error as Error).name !== "AbortError") {
        console.error("Error fetching appointments:", error);
      } else {
        console.log('Abortted');
      }
    }

  }, [pid, refresh]);

  return (
    <>
      <Box
        padding={'40px'}
        flexGrow={'1'}
        maxWidth={'1100px'}
        ref={sectionRef}
        sx={{
          filter: isBlur ? 'blur(5px)' : 'blur(0px)',
        }}
      >
        <Box
          mb={2}
          sx={{
            display: {
              xs: 'block',
              sm: 'None'
            }
          }}
        >
          <Button variant="contained" onClick={handleBackButton} disabled={isBlur}>Back</Button>
        </Box>
        <Typography
          fontWeight={'bold'}
          sx={{
            fontSize: {
              xs: '30px',
              sm: '40px'
            }
          }}
        >
          Patient Details
        </Typography>
        {
          pid === -1
          ? <Typography>
            No Patients
          </Typography>
          : isLoading
          ? (
            <Box display={'flex'} flexDirection={'column'} alignItems={'center'}>
              <Typography mb={2}>Loading...</Typography>
              <CircularProgress/>
            </Box>
          )
          : <Box
            sx={{
              height: isMobile ? isMMoreScroll ? 'calc(100vh - 245px)' : 'calc(100vh - 200px)' : isMoreScroll ? 'calc(100vh - 230px)' : 'calc(100vh - 170px)',
              overflow: 'auto'
            }}
          >
            <Box>
              <Box display={'flex'} mt={2} mb={4}>
                {!(isNarrow || isMed) &&
                  <Box mr={3}>
                    <Avatar src="patientImageUrl" alt="Patient Image" sx={{ width: 150, height: 150 }} />
                  </Box>
                }
                <Box>
                  <Grid container rowSpacing={2} columnSpacing={2}>
                    <Grid size={ (isMed || isNarrow) ? 12 : 4.5 }>
                      <Box>
                        <Typography variant="h6" id='pp_name'>{patient?.title} {patient?.firstname} {patient?.surname}</Typography>
                        <Box display={'flex'} gap={'5px'}>
                          {
                            isMTag
                            ? <Box>
                              <Chip label="No Medicare" color="error" />
                            </Box>
                            : <></>
                          }
                        </Box>
                      </Box>
                    </Grid>
                    <Grid size={ isMed ? 6 : isNarrow ? 12 : 4.5 } sx={{ wordBreak: 'break-word' }} pr={'40px'} order={ (isMed || isNarrow) ? 2 : 0 }>
                      <Box>
                        <Typography color="#868686">Contact</Typography>
                        <Typography>E: {patient?.email ? patient?.email : 'NA'}</Typography>
                        <Typography display="inline">M: {patient?.phone}</Typography>
                      </Box>
                    </Grid>
                    <Grid size={ isMed ? 6 : isNarrow ? 12 : 3 } order={ (isMed || isNarrow) ? 4 : 0 }>
                      <Box>
                        <Typography color="#868686">Medicare</Typography>
                        <Typography>{isMTag ? 'NA' : patient?.medicare_no}</Typography>
                      </Box>
                    </Grid>
                    <Grid size={ isMed ? 6 : isNarrow ? 12 : 4.5 } order={ (isMed || isNarrow) ? 1 : 0 }>
                      <Box display={'flex'} flexDirection={'column'} flex={1}>
                        <Typography color="#868686">Basic Information</Typography>
                        <Typography>Gender: {patient?.gender ? patient?.gender : 'NA'}</Typography>
                        <Typography>DOB: {patient?.dob ? formatDOB(patient?.dob) : 'NA'}</Typography>
                      </Box>
                    </Grid>
                    <Grid size={ isMed ? 6 : isNarrow ? 12 : 4.5 } order={ (isMed || isNarrow) ? 3 : 0 }>
                      <Box>
                        <Typography color="#868686">Residential Address</Typography>
                        <Typography>{address}</Typography>
                      </Box>
                    </Grid>
                    <Grid size={ isMed ? 6 : isNarrow ? 12 : 3 } order={ (isMed || isNarrow) ? 5 : 0 }>
                      <Box>
                        <Typography color="#868686">Health Fund</Typography>
                        {
                          patient?.health_fund_name
                          ? <Box>
                            <Typography>{patient.health_fund_name}</Typography>
                            <Typography>No.: {patient.health_fund_no}</Typography>
                          </Box>
                          : <Typography>NA</Typography>
                        }

                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Box>

              {/* Button Section */}
              <Box
                display="flex"
                flexDirection={isNarrow ? 'column' : 'row'}
                gap={isNarrow ? 2 : 0}
                justifyContent="space-between"
              >
                <Button variant="outlined" onClick={handleEdit} disabled={isBlur}>
                  Edit Patient
                </Button>
                <Button variant="outlined" color="error" onClick={handleDelete} disabled={isBlur}>
                  Delete Patient
                </Button>
              </Box>
            </Box>

            {/* Appointments Section */}
            <Box mt={4} mb={2}>
              <Box
                display={'flex'}
                flexDirection={isNarrow ? 'column' : 'row'}
              >
                <Typography variant="h6" flexGrow={1}>Appointments</Typography>
                <Box display="flex" alignItems="center">
                  <Typography color={isPast ? 'textPrimary' : 'textSecondary'}>Past</Typography>
                  <Switch
                    checked={!isPast}
                    onChange={() => setIsPast(!isPast)}
                    color="primary"
                    disabled={isBlur}
                  />
                  <Typography color={isPast ? 'textSecondary' : 'textPrimary'}>Future</Typography>
                </Box>
              </Box>
              <Box mt={2} display={'flex'} flexDirection={'column'} rowGap={2} mb={2}>
                {isPast ? (
                  pastApps.length === 0
                  ? <Typography>No Past Appointments</Typography>
                  : pastApps.map((a) => (
                    <AppointmentCard appointment={a} isNarrow={isNarrow}/>
                  ))) : (
                    futureApps.length === 0
                    ? <Typography>No Upcoming Appointments</Typography>
                    : futureApps.map((a) => (
                      <AppointmentCard appointment={a} isNarrow={isNarrow}/>
                    ))
                )
                }
              </Box>
            </Box>
          </Box>
        }
      </Box>
    </>
  );
};