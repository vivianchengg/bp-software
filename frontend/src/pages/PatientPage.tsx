import { Box, Divider, useMediaQuery, useTheme } from '@mui/material';
import React, { useState } from 'react';
import { PatientBar } from '../components/PatientBar';
import { PatientProfile } from '../components/PatientProfile';
import { AddPatientModal } from '../components/AddPatientModal';
import { DeletePatientModal } from '../components/DeletePatientModal';
import { EditPatientModal } from '../components/EditPatientModal';
import { useWindowDimensions } from '../helper';

interface Props {
  pBarOpen: boolean,
  setPBarOpen: (open: boolean) => void;
}

export const PatientPage = ({ pBarOpen, setPBarOpen }: Props) => {
  const [pid, setPid] = useState<number>(-1);
  const [addOpen, setAddOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [patientId, setPatientId] = useState(-1);

  // for mobile
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [refresh, setRefresh] = useState(false);

  const { width } = useWindowDimensions();
  const tablet = width < 782;

  return (
    <>
      <Box display={'flex'}>
        <AddPatientModal open={addOpen} setOpen={setAddOpen} setRefresh={setRefresh} refresh={refresh}/>
        <DeletePatientModal open={deleteOpen} setOpen={setDeleteOpen} pid={pid} setRefresh={setRefresh} refresh={refresh}/>
        <EditPatientModal open={editOpen} setOpen={setEditOpen} setPatientId={setPatientId} patientId={patientId} setRefresh={setRefresh} refresh={refresh}/>
        {isMobile
        ? (
          (pBarOpen
            ? (<PatientBar setPid={setPid} setAddOpen={setAddOpen} addOpen={addOpen} deleteOpen={deleteOpen} editOpen={editOpen} pid={pid} pBarOpen={pBarOpen} refresh={refresh} setPBarOpen={setPBarOpen}/>)
            : (<PatientProfile pid={pid} setDeleteOpen={setDeleteOpen} setEditOpen={setEditOpen} setPatientId={setPatientId} refresh={refresh} setPBarOpen={setPBarOpen}/>)
          )
        )
        :(
          <>
            {((tablet && pBarOpen) || (!tablet)) &&
              <>
                <PatientBar setPid={setPid} setAddOpen={setAddOpen} addOpen={addOpen} deleteOpen={deleteOpen} editOpen={editOpen} pid={pid} pBarOpen={pBarOpen} refresh={refresh} setPBarOpen={setPBarOpen}/>
                <Divider orientation="vertical" flexItem />
              </>
            }
            <PatientProfile pid={pid} setDeleteOpen={setDeleteOpen} setEditOpen={setEditOpen} setPatientId={setPatientId} refresh={refresh} setPBarOpen={setPBarOpen}/>
          </>
        )
        }
      </Box>
    </>
  );
};
