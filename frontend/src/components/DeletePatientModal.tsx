import React from 'react';
import { Box, Button, Dialog, DialogContent, DialogTitle, Typography } from "@mui/material";
import { apiCall } from "../helper";

interface Props {
  open: boolean,
  refresh: boolean,
  setOpen: (open: boolean) => void,
  setRefresh: (open: boolean) => void,
  pid: number,
}

export const DeletePatientModal = ({ open, setOpen, pid, refresh, setRefresh }: Props) => {


  const handleCancel = () => {
    setOpen(false);
  };

  // On Submit, call api to delete the patient via patient ID.
  const handleSubmit = async () => {
    const res = await apiCall('DELETE', `patients/delete/${pid}`, {});
    if (res.error) {
      console.log(res.error);
    } else {
      console.log(`Patient ${pid} deleted successfully`);
      setRefresh(!refresh);
    }

    setOpen(false);
  };

  return (
    <Dialog open={open} PaperProps={{
      style: {
        borderRadius: 10,
        width: '60vw',
        paddingBottom: '10px'
      }
    }}>
      <DialogTitle>
        <Typography sx={{fontSize: { xs: '25px', sm: '34px' }}} m={'10px 15px'} fontWeight={'bold'}>
          Delete Patient
        </Typography>
      </DialogTitle>
      <DialogContent style={{ paddingTop: '8px' }}>
        <Box m={'0 15px'} height={'100%'}>
          <Box>
            <Typography>Are you sure?</Typography>
          </Box>
          <Box display={'flex'} justifyContent={'space-between'} mt={2}>
            <Button onClick={handleCancel} variant="outlined">Cancel</Button>
            <Button onClick={handleSubmit} variant="outlined">Confirm</Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};