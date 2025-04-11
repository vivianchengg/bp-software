import React from 'react';
import { Alert, Box, Button, IconButton, MenuItem, Modal, TextField, Typography, useMediaQuery } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { useState, useEffect } from "react";
import { apiCall } from "../helper";

interface Props {
  open: boolean,
  refresh: boolean,
  setOpen: (open: boolean) => void
  setRefresh: (open: boolean) => void
  setPatientId: (open: number) => void
  patientId: number,
}

interface Patient {
  title: string,
  firstname: string,
  surname: string,
  gender: string, // sex
  dob: string,
  email: string, // contact
  mobile_phone: string,
  address1: string, // address
  address2: string,
  city: string,
  postcode: string,
  medicare_no: string, // medicare
  health_fund_name: string, // health fund
  health_fund_no: string
};

const initData = {
  title: '',
  firstname: '',
  surname: '',
  gender: '',
  dob: '',
  email: '',
  mobile_phone: '',
  address1: '',
  address2: '',
  city: '',
  postcode: '',
  medicare_no: '',
  health_fund_name: '',
  health_fund_no: ''
}

const isValidEmail = (email: string): boolean => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
};

export const EditPatientModal = ({ refresh, open, setOpen, setPatientId, patientId, setRefresh }: Props) => {
  const [patientData, setPatientData] = useState<Patient>(initData);
  const [medicareSelected, setMedicareSelected] = useState(false);
  const [healthFundSelected, setHealthFundSelected] = useState(false);
  const title = ['Mr.', 'Miss', 'Mrs.', 'Dr', 'Mast.'];
  const gender = ['Male', 'Female'];
  const [openError, setOpenError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Please fill out all values");
  const isSmallScreen = useMediaQuery('(max-width:634px)');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setPatientData(prevState => ({
      ...prevState,
      [name!]: value
    }));
  };

  const handleCancel = () => {
    setOpen(false);
    setPatientData(initData);
    setPatientId(-1);
    setOpenError(false);
    setMedicareSelected(false);
    setHealthFundSelected(false);
  };

  useEffect(() => {
    // Fetch patient data by current selected patient id
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
      setPatientData(p);
      console.log(p);

      if (p.medicare_no !== null && p.medicare_no !== undefined && p.medicare_no !== '') {
        setMedicareSelected(true);
      }
      if (p.health_fund_name !== null && p.health_fund_name !== undefined && p.health_fund_name !== '') {
        setHealthFundSelected(true);
      }
    };

    fetchPatientData(patientId);

  }, [patientId]);

  const handleSubmit = async() => {
    console.log(patientData);

    const apiData = {
      'title': patientData.title,
      'firstname': patientData.firstname,
      'surname': patientData.surname,
      'sex': patientData.gender,
      'dob': patientData.dob,
      'email': patientData.email,
      'mobile_phone': patientData.mobile_phone,
      'address1': patientData.address1,
      'address2': patientData.address2,
      'city': patientData.city,
      'postcode': patientData.postcode,
      'medicare_no': patientData.medicare_no,
      'health_fund_name': patientData.health_fund_name,
      'health_fund_no': patientData.health_fund_no
    };

    // Error check for if compulsory values not filled
    const allValuesFilled = Object.entries(apiData).every(([key, value]) => {
      if (key === 'address2') return true;
      if (key === 'medicare_no' && !medicareSelected) return true;
      if ((key === 'health_fund_name' || key === 'health_fund_no') && !healthFundSelected) return true;
  
      return value !== null && value !== undefined && value !== '';
    });

    if (!allValuesFilled) {
      setErrorMessage("Please fill out all values");
      handleDialogOpen();
      return;
    }

    if (!isValidEmail(apiData.email)) {
      setErrorMessage("Please enter a valid email");
      handleDialogOpen();
      return;
    }

    if (apiData.firstname.length > 50) {
      setErrorMessage("Please enter a valid first name (50 chars)");
      handleDialogOpen();
      return;
    }

    if (apiData.surname.length > 40) {
      setErrorMessage("Please enter a valid surname (40 chars)");
      handleDialogOpen();
      return;
    }

    if (new Date(apiData.dob) > new Date()) {
      setErrorMessage("Please enter a valid birthday");
      handleDialogOpen();
      return;
    }

    if (apiData.email.length > 100) {
      setErrorMessage("Please enter a valid email (100 chars)");
      handleDialogOpen();
      return;
    }

    if (apiData.mobile_phone.length > 15) {
      setErrorMessage("Please enter a valid mobile number");
      handleDialogOpen();
      return;
    }

    if (apiData.address1.length > 40) {
      setErrorMessage("Please enter a valid address line 1 (40 chars)");
      handleDialogOpen();
      return;
    }

    if (apiData.address2 !== null && apiData.address2 !== undefined) {
      if (apiData.address2.length > 40) {
        setErrorMessage("Please enter a valid address line 2 (40 chars)");
        handleDialogOpen();
        return;
      }
    }

    if (apiData.postcode.length !== 4) {
      setErrorMessage("Please enter a valid postcode");
      handleDialogOpen();
      return;
    }

    if (apiData.medicare_no !== null && apiData.medicare_no !== undefined) {
      if (apiData.medicare_no.length !== 10 && medicareSelected) {
        setErrorMessage("Please enter a valid medicare number (10 digits)");
        handleDialogOpen();
        return;
      }
    }

    if (apiData.health_fund_name !== null && apiData.health_fund_name !== undefined) {
      if (apiData.health_fund_name.length > 100 && healthFundSelected) {
        setErrorMessage("Please enter a valid health fund name (100 chars)");
        handleDialogOpen();
        return;
      }
    }

    if (apiData.health_fund_no !== null && apiData.health_fund_no !== undefined) {
      if (apiData.health_fund_no.length > 20 && healthFundSelected) {
        setErrorMessage("Please enter a valid health fund number");
        handleDialogOpen();
        return;
      }
    }

    const res = await apiCall('PUT', `patients/edit/${patientId}`, apiData);
    console.log(res);
    if (res.error) {
      console.log(res.error);
    } else {
      console.log(`Patient ${patientId} edited successfully`);
      setRefresh(!refresh);
    }
    setPatientData(initData);
    setPatientId(-1);
    setOpen(false);
    setOpenError(false);
    setMedicareSelected(false);
    setHealthFundSelected(false);
  };

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    padding: '15px',
    transform: 'translate(-50%, -50%)',
    width: isSmallScreen ? '80%' : '507px',
    display: 'flex',
    height: isSmallScreen ? '80%' : 'min(calc(100vh - 90px), 754px)',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '10px',
    flexShrink: '0',
    borderRadius: '15px',
    background: '#FFF'
  };

  const handleMedicareChange = (e: { target: { value: any; }; }) => {
    const value = e.target.value;
    setMedicareSelected(value === "Yes");
    if (value === "No") {
      setPatientData(prevState => ({
        ...prevState,
        medicare_no: ''
      }));
    }
  };
  
  const handleHealthFundChange = (e: { target: { value: any; }; }) => {
    const value = e.target.value;
    setHealthFundSelected(value === "Yes");
    if (value === "No") {
      setPatientData(prevState => ({
        ...prevState,
        health_fund_name: '',
        health_fund_no: ''
      }));
    }
  };

  const handleDialogOpen = () => {
    setOpenError(true);
  };

  return (
    <>
      <Modal open={open} onClose={handleCancel}>
        <Box sx={style}>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" alignSelf="stretch">
            <Typography style={{ margin: '10px 15px' }} variant='h4'>
              Edit Patient
            </Typography>
            <IconButton onClick={handleCancel} style={{ padding: '0px' }}>
              <CloseIcon style={{ width: '30px', height: '30px' }} />
            </IconButton>
          </Box>
          {openError && (
          <Alert severity="error" sx={{
            padding: '5px',
            margin: '0px 13px',
            marginLeft: '25px',
            width: 'calc(100% - 30px)'
          }}>
            {errorMessage}
          </Alert>
        )}
          <Box style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            alignSelf: 'stretch',
            flex: '1 0 0',
            padding: '10px',
            overflowY: 'auto',
            height: '100%',
          }}>
    
            <Box style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
            }}>
              <TextField
                required
                label="First Name"
                name="firstname"
                value={patientData.firstname}
                onChange={handleInputChange}
                style={{ flex: '1 0 45%' }}
              />
              <Box sx={{ height: '20px', width: '10px' }} />
              <TextField
                required
                label="Surname"
                name="surname"
                value={patientData.surname}
                onChange={handleInputChange}
                style={{ flex: '1 0 45%' }}
              />
            </Box>

            <Box style={{
              display: 'flex',
              justifyContent: 'space-between',
              flexDirection: 'row',
              alignItems: 'center',
              width: '100%',
              marginTop: isSmallScreen ? '15px' : '0px'
            }}>
              <TextField
                required
                select
                label="Title"
                name="title"
                value={patientData.title}
                onChange={handleInputChange}
                style={{ flex: isSmallScreen ? '1 0 45%' : '1 0 19.5%' }}
              >
                {title.map((t) => (
                  <MenuItem key={t} value={t}>
                    {t}
                  </MenuItem>
                ))}
              </TextField>
              <Box sx={{ height: '20px', width: '10px' }} />  
              <TextField
                required
                select
                label="Gender"
                name="gender"
                value={patientData.gender}
                onChange={handleInputChange}
                style={{ flex: isSmallScreen ? '1 0 45%' : '1 0 19.5%' }}
              >
                {gender.map((g) => (
                  <MenuItem key={g} value={g}>
                    {g}
                  </MenuItem>
                ))}
              </TextField>
              {!isSmallScreen && (
                <>
                  <Box sx={{ height: '20px', width: '10px' }} />
                  <TextField
                    required
                    label="Date of Birth"
                    name="dob"
                    value={patientData.dob}
                    onChange={handleInputChange}
                    type="date"
                    style={{ flex: '1 0 45%' }}
                    InputLabelProps={{ shrink: true }}
                  />
                </>
              )}
            </Box>

            {isSmallScreen && (
                <Box style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: '100%',
                  marginTop: '15px'
                }}>
                  <TextField
                    required
                    label="Date of Birth"
                    name="dob"
                    value={patientData.dob}
                    onChange={handleInputChange}
                    type="date"
                    style={{ flex: '1 0 45%' }}
                    InputLabelProps={{ shrink: true }}
                  />
                  <Box sx={{ height: '20px', width: '10px' }} />
                  <TextField
                    required
                    fullWidth
                    label="Mobile Phone"
                    name="mobile_phone"
                    value={patientData.mobile_phone}
                    onChange={handleInputChange}
                    type="number"
                    style={{ flex: '1 0 45%' }}
                  />
                </Box>
              )}
    
            <Box style={{
              display: 'flex',
              justifyContent: 'space-between',
              flexDirection: isSmallScreen ? 'column' : 'row',
              alignItems: 'center',
              width: '100%',
              marginTop: isSmallScreen ? '15px' : '0px'
            }}>
              <TextField
                required
                fullWidth
                label="Email"
                name="email"
                value={patientData.email}
                onChange={handleInputChange}
                style={{ flex: isSmallScreen ? '0 1 100%' : '1 0 45%', width: isSmallScreen ? '100%' : 'auto' }}
              />
              {!isSmallScreen && (
                <>
                  <Box sx={{ height: '20px', width: '10px' }} />
                  <TextField
                    required
                    fullWidth
                    label="Mobile Phone"
                    name="mobile_phone"
                    value={patientData.mobile_phone}
                    onChange={handleInputChange}
                    type="number"
                    style={{ flex: '1 0 45%' }}
                  />
                </>
              )}
            </Box>
    
            <Box style={{
              display: 'flex',
              justifyContent: 'space-between',
              flexDirection: isSmallScreen ? 'column' : 'row',
              alignItems: 'center',
              width: '100%',
              marginTop: isSmallScreen ? '15px' : '0px'
            }}>
              <TextField
                required
                fullWidth
                label="Address 1"
                name="address1"
                value={patientData.address1}
                onChange={handleInputChange}
                style={{ flex: isSmallScreen ? '0 1 100%' : '1 0 45%', width: isSmallScreen ? '100%' : 'auto' }}
              />
              <Box sx={{ height: '20px', width: '10px' }} />
              <TextField
                fullWidth
                label="Address 2"
                name="address2"
                value={patientData.address2}
                onChange={handleInputChange}
                style={{ flex: isSmallScreen ? '0 1 100%' : '1 0 45%', width: isSmallScreen ? '100%' : 'auto' }}
              />
            </Box>

            <Box style={{
              display: 'flex',
              justifyContent: 'space-between',
              flexDirection: 'row',
              alignItems: 'center',
              width: '100%',
              marginTop: isSmallScreen ? '15px' : '0px'
            }}>
              <TextField
                required
                fullWidth
                label="City"
                name="city"
                value={patientData.city}
                onChange={handleInputChange}
                style={{ flex: '1 0 45%' }}
              />
              <Box sx={{ height: '20px', width: '10px' }} />
              <TextField
                required
                fullWidth
                label="Postcode"
                name="postcode"
                type="number"
                value={patientData.postcode}
                onChange={handleInputChange}
                style={{ flex: '1 0 45%' }}
              />
            </Box>
    
            <Box style={{
              display: 'flex',
              justifyContent: 'space-between',
              flexDirection: 'row',
              alignItems: 'center',
              width: '100%',
              marginTop: isSmallScreen ? '15px' : '0px'
            }}>
              <TextField
                required
                select
                label="Medicare?"
                name="medicare"
                value={medicareSelected ? "Yes" : "No"}
                onChange={handleMedicareChange}
                style={{ flex: '1 0 25%' }}
              >
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </TextField>
              <Box sx={{ height: '20px', width: '10px' }} />
              <TextField
                fullWidth
                label="Medicare No"
                name="medicare_no"
                value={patientData.medicare_no}
                onChange={handleInputChange}
                type="number"
                style={{ flex: '1 0 70%' }}
                disabled={!medicareSelected}
              />
            </Box>

            <Box style={{
              display: 'flex',
              justifyContent: 'space-between',
              flexDirection: 'row',
              alignItems: 'center',
              width: '100%',
              marginTop: isSmallScreen ? '15px' : '0px'
            }}>
              <TextField
                required
                select
                label="Health Fund?"
                value={healthFundSelected ? "Yes" : "No"}
                name="health_fund"
                onChange={handleHealthFundChange}
                style={{ flex: '1 0 25%' }}
              >
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </TextField>
              <Box sx={{ height: '20px', width: '10px' }} />
              <TextField
                fullWidth
                label="Health Fund Name"
                name="health_fund_name"
                value={patientData.health_fund_name}
                onChange={handleInputChange}
                style={{ flex: isSmallScreen ? '1 0 70%' : '1 0 33.25%' }}
                disabled={!healthFundSelected}
              />
              {!isSmallScreen && (
                <>
                  <Box sx={{ height: '20px', width: '10px' }} />
                  <TextField
                    fullWidth
                    label="Health Fund No"
                    type="number"
                    name="health_fund_no"
                    value={patientData.health_fund_no}
                    onChange={handleInputChange}
                    style={{ flex: '1 0 33.25%' }}
                    disabled={!healthFundSelected}
                  />
                </>
              )}
            </Box>

            {isSmallScreen && (
                <Box style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: '100%',
                  marginTop: '15px'
                }}>
                  <TextField
                    fullWidth
                    label="Health Fund No"
                    type="number"
                    name="health_fund_no"
                    value={patientData.health_fund_no}
                    onChange={handleInputChange}
                    style={{ flex: '1 0 100%' }}
                    disabled={!healthFundSelected}
                  />
                </Box>
              )}

          </Box>
          <Box style={{
            display: 'flex',
            padding: '10px',
            marginTop: '10px',
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
              Submit
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};