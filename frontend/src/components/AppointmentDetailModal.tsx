import React, { useEffect, useState } from 'react';
import { Modal, Box, Typography, Button, Chip, IconButton, TextField, useMediaQuery } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { apiCall } from '../helper';
import { AppointmentDetails } from '../interfaces';
import dayjs from 'dayjs';

interface AppointmentDetailModalProps {
  open: boolean;
  onClose: () => void;
  patient: AppointmentDetails | null;
  date: string;
  onEditClick: (patient: AppointmentDetails | null) => void;
  onDeleteClick: (patient: AppointmentDetails | null) => void;
}

function convertSecondsTo24HourTime(seconds: number): string {
  const totalSeconds = seconds % (24 * 3600);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

export const AppointmentDetailModal: React.FC<AppointmentDetailModalProps> = ({ open, onClose, patient, date, onEditClick, onDeleteClick }) => {
  const [notes, setNotes] = useState<string>("");
  const [validMedicare, setValidMedicare] = useState(false);
  const isSmallScreen = useMediaQuery('(max-width:598px)');

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

  const infoBoxStyle = {
    display: 'flex',
    paddingTop: '20px',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    maxWidth: '100%',
  };

  const infoTextStyle = {
    color: '#000',
    textAlign: 'center',
    fontSize: '14px',
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: '143%',
    letterSpacing: '0.17px',
  };

  const infoHeaderStyle = {
    color: 'rgba(0, 0, 0, 0.47)',
    textAlign: 'center',
    fontSize: '14px',
    fontStyle: 'normal',
    fontWeight: 500,
    lineHeight: '157%',
    letterSpacing: '0.1px',
  }

  useEffect(()=> {

    // Function to fetch notes for a specific patient by id
    const fetchNotes = async (id: number) => {
      if (id === -1) {
        return;
      }
      // Make API call to fetch notes of the patient's appointment
      const res = await apiCall('GET', `appointments/notes/${id}`, {});
      if (res.error) {
        console.log(res.error);
        return;
      }

      // Check if response contains a valid note field
      if (res && res.note) {
        setNotes(res.note);
      } else {
        setNotes("");
      }
    };

    try {
      fetchNotes(patient?.id ?? -1);
    } catch (e) {
      console.log(e);
    }
    // Check if the patient's Medicare information is valid
    const temp = patient?.medicare;
    setValidMedicare(temp ?? false);

  }, [open])

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Box display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          alignSelf="stretch"
          >
          <Typography style={{
            margin: '10px 15px'
          }} variant='h4'>
            Appointment
          </Typography>
          <IconButton onClick={onClose} style={{padding: '0px'}}>
            <CloseIcon style={{width: '30px', height: '30px'}}/>
          </IconButton>
        </Box>
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
          <Box style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            alignSelf: 'stretch',
          }}>
            <Typography variant="h6" textAlign='center'>
              {patient?.name || "No Name"}
            </Typography>
            <Box style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '10px'
            }}>
              { patient?.appointmentType === 'Telephone Consult' &&
                <Chip label={`Last Visit: ${dayjs(patient?.lastAppointment).format("DD/MM/YYYY")}`}
                  color='primary' variant="outlined" style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '8px',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  fontWeight: 'bold',
                }}/>
              }
              { patient?.medicare ||
                <Chip label='No Medicare'
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '8px',
                    borderColor: 'var(--Semantic-Red, #C72549)',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    backgroundColor: '#FFF',
                    color: 'var(--Semantic-Red, #C72549)',
                    fontWeight: 'bold',
                  }}
                />
              }
            </Box>
          </Box>
          {!isSmallScreen && (
            <Box style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flex: '1 0 0',
              width: '100%',
            }}>
              <Box style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
              }}>
                <Box sx={infoBoxStyle}>
                  <Typography sx={infoHeaderStyle}>Basic Information</Typography>
                  <Typography sx={infoTextStyle}>Gender: {patient?.gender || "N/A"}</Typography>
                  <Typography sx={infoTextStyle}>DOB: {patient?.dob || "N/A"}</Typography>
                </Box>
                <Box sx={infoBoxStyle}>
                  <Typography sx={infoHeaderStyle}>Host</Typography>
                  <Typography sx={infoTextStyle}>{patient?.doctor || "N/A"}</Typography>
                </Box>
                <Box sx={infoBoxStyle}>
                  <Typography sx={infoHeaderStyle}>Date</Typography>
                  <Typography sx={infoTextStyle}>{date || "N/A"}</Typography>
                </Box>
              </Box>
              <Box style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
              }}>
                <Box sx={infoBoxStyle}>
                  <Typography sx={infoHeaderStyle}>Contact</Typography>
                  <Typography sx={infoTextStyle}>E: {patient?.email || "N/A"}</Typography>
                  <Typography sx={infoTextStyle}>M: {patient?.mobile_phone || "N/A"}</Typography>
                </Box>
                <Box sx={infoBoxStyle}>
                  <Typography sx={infoHeaderStyle}>Location</Typography>
                  <Typography sx={infoTextStyle}>{patient?.city || "N/A"}</Typography>
                </Box>
                <Box sx={infoBoxStyle}>
                  <Typography sx={infoHeaderStyle}>Time</Typography>
                  <Typography sx={infoTextStyle}>{convertSecondsTo24HourTime(patient?.time || 0) || "N/A"}</Typography>
                </Box>
              </Box>
              <Box style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
              }}>
                <Box sx={infoBoxStyle}>
                  <Typography sx={infoHeaderStyle}>Medicare</Typography>
                  <Typography sx={infoTextStyle}>{validMedicare ? patient?.medicare_no : "N/A"}</Typography>
                </Box>
                <Box sx={infoBoxStyle}>
                  <Typography sx={infoHeaderStyle}>Health Fund</Typography>
                  <Typography sx={infoTextStyle}>{patient?.health_fund_name || "N/A"}</Typography>
                  <Typography sx={infoTextStyle}>{patient?.health_fund_no || "N/A"}</Typography>
                </Box>
                <Box sx={infoBoxStyle}>
                  <Typography sx={infoHeaderStyle}>Appointment Type</Typography>
                  <Typography sx={infoTextStyle}>{patient?.appointmentType || "N/A"}</Typography>
                </Box>
              </Box>
            </Box>
          )}
          {isSmallScreen && (
            <Box style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              width: '100%',
              flexWrap: 'wrap',
            }}>
              <Box style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                width: '50%',
              }}>
                <Box sx={infoBoxStyle}>
                  <Typography sx={infoHeaderStyle}>Basic Information</Typography>
                  <Typography sx={infoTextStyle}>Gender: {patient?.gender || "N/A"}</Typography>
                  <Typography sx={infoTextStyle}>DOB: {patient?.dob || "N/A"}</Typography>
                </Box>
                <Box sx={infoBoxStyle}>
                  <Typography sx={infoHeaderStyle}>Host</Typography>
                  <Typography sx={infoTextStyle}>{patient?.doctor || "N/A"}</Typography>
                </Box>
                <Box sx={infoBoxStyle}>
                  <Typography sx={infoHeaderStyle}>Date</Typography>
                  <Typography sx={infoTextStyle}>{date || "N/A"}</Typography>
                </Box>
                <Box sx={infoBoxStyle}>
                  <Typography sx={infoHeaderStyle}>Location</Typography>
                  <Typography sx={infoTextStyle}>{patient?.city || "N/A"}</Typography>
                </Box>
                <Box sx={infoBoxStyle}>
                  <Typography sx={infoHeaderStyle}>Time</Typography>
                  <Typography sx={infoTextStyle}>{convertSecondsTo24HourTime(patient?.time || 0) || "N/A"}</Typography>
                </Box>
              </Box>
              
              <Box style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                width: '50%',
              }}>
                <Box sx={infoBoxStyle}>
                  <Typography sx={infoHeaderStyle}>Contact</Typography>
                  <Typography
                    sx={{
                      ...infoTextStyle,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      maxWidth: '100%',
                    }}
                  >
                    E: {patient?.email || "N/A"}
                  </Typography>
                  <Typography sx={infoTextStyle}>M: {patient?.mobile_phone || "N/A"}</Typography>
                </Box>
                <Box sx={infoBoxStyle}>
                  <Typography sx={infoHeaderStyle}>Medicare</Typography>
                  <Typography sx={infoTextStyle}>{validMedicare ? patient?.medicare_no : "N/A"}</Typography>
                </Box>
                <Box sx={infoBoxStyle}>
                  <Typography sx={infoHeaderStyle}>Health Fund</Typography>
                  <Typography sx={infoTextStyle}>{patient?.health_fund_name || "N/A"}</Typography>
                  <Typography sx={infoTextStyle}>{patient?.health_fund_no || "N/A"}</Typography>
                </Box>
                <Box sx={infoBoxStyle}>
                  <Typography sx={infoHeaderStyle}>Appointment Type</Typography>
                  <Typography sx={infoTextStyle}>{patient?.appointmentType || "N/A"}</Typography>
                </Box>
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
            paddingTop: '20px',
          }}>
            <TextField
              label="Note"
              multiline
              fullWidth
              disabled
              variant="outlined"
              value={notes}
              style={{ display:"flex", flexDirection:"column", alignItems:"flex-start", alignSelf:"stretch", flex: '1'}}
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
            />
          </Box>
        </Box>
        <Box sx={{
          display: 'flex',
          flexDirection: 'row-reverse',
          justifyContent: 'space-between',
          padding: '15px',
          width: 'calc(100% - 30px)'
        }}>
          <Box
            gap='15px'
            display={'flex'}
            flexDirection={'row'}
            justifyContent={'space-between'}
          >
            <Button
              variant='outlined'
              size='large'
              onClick={() => {
                onClose();
                onEditClick(patient);
              }}
            >
              Edit
            </Button>
            <Button
              variant='contained'
              size='large'
              onClick={onClose}
            >
              Close
            </Button>
          </Box>
          <Button
            variant='contained'
            size='large'
            color='error'
            onClick={() => {
              onClose();
              onDeleteClick(patient);
            }}
          >
            Delete
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
