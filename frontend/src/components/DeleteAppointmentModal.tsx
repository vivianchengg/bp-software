import React from 'react';
import { Box, Button, Dialog, DialogContent, DialogTitle, Typography } from "@mui/material";
import { apiCall } from "../helper";

interface Props {
  open: boolean;
  onClose: () => void;
  id: number;
  refresh: boolean;
  setRefresh: (refresh: boolean) => void;
}

export const DeleteAppointmentModal = ({ open, onClose, id, refresh, setRefresh }: Props) => {
  // On Submit, call api to delete the appointment via appointment ID.
  const handleSubmit = async () => {
    const res = await apiCall('DELETE', `appointments/delete/${id}`, {});
    if (res.error) {
      console.log(res.error);
    } else {
      console.log(`Appointment ${id} deleted successfully`);
    }

    onClose();
    setRefresh(!refresh);
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
          Delete Appointment
        </Typography>
      </DialogTitle>
      <DialogContent style={{ paddingTop: '8px' }}>
        <Box m={'0 15px'} height={'100%'}>
          <Box>
            <Typography>Are you sure?</Typography>
          </Box>
          <Box display={'flex'} justifyContent={'space-between'} mt={2}>
            <Button onClick={onClose} variant="outlined">Cancel</Button>
            <Button onClick={handleSubmit} id='delete-appoint' variant="outlined">Confirm</Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};