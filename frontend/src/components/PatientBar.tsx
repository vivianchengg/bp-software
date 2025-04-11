import { Box, Button, Checkbox, CircularProgress, Divider, IconButton, InputAdornment, List, ListItem, TextField, Typography, useMediaQuery, useTheme } from "@mui/material";
import React, { useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { apiCall } from "../helper";

interface Patient {
  iid: number,
  firstname: string,
  surname: string,
  phone: string,
  medicare_no: string,
};

interface Props {
  setPid: (pId: number) => void,
  setAddOpen: (open: boolean) => void,
  addOpen: boolean,
  deleteOpen: boolean,
  editOpen: boolean,
  pid: number,
  pBarOpen: boolean,
  refresh: boolean,
  setPBarOpen: (open: boolean) => void;
};

export const PatientBar = ({ setPid, setAddOpen, refresh, pid, pBarOpen, setPBarOpen }: Props) => {
  const [searchInput, setSearchInput] = useState('');
  const [noMedicare, setNoMedicare] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [allPatients, setAllPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleAddButton = () => {
    setAddOpen(true);
  };

  const filteredMPatients = (patients: Patient[]) => {
    return patients.filter((p) => {
      return !p.medicare_no;
    });
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // search icon will reset checkbox filter
  const handleSearch = async() => {
    console.log('SEARCHING>>>')
    setIsLoading(true);
    const input = searchInput.trim();
    let filtered = filterPatient(input);
    if (noMedicare) {
      filtered = filteredMPatients(filtered);
    }

    setPatients(filtered);
    setIsLoading(false);
  };

  const filterPatient = (input: string) => {
    const regex = new RegExp(input, 'i');
    return allPatients.filter((p) => {
      return regex.test(p.firstname) || regex.test(p.surname);
    });
  };

  const handlePatientClick = (p: Patient) => {
    setPid(p.iid);
    setPBarOpen(false);
  };

  useEffect(() => {
    handleSearch();
  }, [noMedicare]);

  useEffect(() => {
    const fetchPatients = async () => {
      setIsLoading(true);
      const res = await apiCall('GET', 'patients', {}, false);
      if (res.error) {
        console.log(res.error);
        return;
      }

      const pList: Patient[] = [];
      const ps = Array.isArray(res) ? res : [];
      ps.forEach((p: any) => {
        const data = {
          iid: p.iid,
          firstname: p.firstname,
          surname: p.surname,
          phone: (p.mobile_phone || p.home_phone || p.work_phone || "-").replace(/\s+/g, ""),
          medicare_no: p.medicare_no,
        }

        pList.push(data);
      });

      console.log(pList);
      setPatients(pList);
      setAllPatients(pList);
      setIsLoading(false);

      // only reset PID if cur pid no longer exists
      if (pList.some(patient => patient.iid === pid)) {
        return;
      }

      console.log('reset to first patient');
      const firstId = res.length > 0 ? res[0].iid : -1;
      setPid(firstId);
    };

    fetchPatients();

  }, [refresh]);

  return (
    <>
      <Box
        padding={'20px'}
        sx={{
          minWidth: '350px',
        }}
        flexGrow={isMobile ? 1 : 0}
        id='pat_bar'
      >
        <List>
          <ListItem>
            <Box display={'flex'} flexGrow={1} justifyContent={'space-between'} alignItems={'center'}>
              <Typography
                fontWeight={'bold'}
                sx={{
                  fontSize: {
                    xs: '30px',
                    sm: '20px'
                  }
                }}
              >
                Patients
              </Typography>
            </Box>
          </ListItem>
          {/* Search Bar */}
          <ListItem>
            <Box display={'flex'} alignItems={'center'} width={'100%'}>
              <TextField
                id="p_search_bar"
                label="Patient name"
                variant="filled"
                size="small"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyUp={handleKeyUp}
                fullWidth
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleSearch}>
                          <SearchIcon />
                        </IconButton>
                      </InputAdornment>
                    )
                  }
                }}
              />
            </Box>
          </ListItem>
          {/* Checkboxes */}
          <ListItem>
            <Box width={'100%'}>
              <Box display={'flex'} alignItems={'center'} id="p_noMCheck">
                <Checkbox
                  checked={noMedicare}
                  onChange={() => setNoMedicare(!noMedicare)}
                  inputProps={{ 'aria-label': 'No Medicare' }}
                />
                <Typography>No Medicare</Typography>
              </Box>
            </Box>
          </ListItem>
          <Box display="flex" justifyContent="center" alignItems="center" marginY={2}>
            <Button variant="outlined" onClick={handleAddButton}>Add New Patient</Button>
          </Box>
          <ListItem>
            <Typography fontWeight={'bold'} fontSize={'20px'} paddingTop={'20px'}>Patients({patients.length})</Typography>
          </ListItem>
          <Box sx={{ maxHeight: 'calc(100vh - 400px)', overflowY: 'auto' }}>
            {isLoading
            ? (
              <Box display={'flex'} flexDirection={'column'} alignItems={'center'}>
                <Typography mb={2}>Loading...</Typography>
                <CircularProgress/>
              </Box>
            )
            : (patients.map((p) => (
              <>
                <ListItem key={p.iid} onClick={() => handlePatientClick(p)} sx={{ cursor: 'pointer' }}>
                  <Box display="flex" justifyContent="space-between" width="100%" id={`pBar_${p.firstname.trim()}_${p.surname.trim()}`}>
                    <Typography>{p.firstname} {p.surname}</Typography>
                    <Typography>{p.phone}</Typography>
                  </Box>
                </ListItem>
              <Divider/>
              </>
            )))}
          </Box>
        </List>
      </Box>
    </>
  );

};
