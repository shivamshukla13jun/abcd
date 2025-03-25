import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Typography,
  Box,
} from '@mui/material';
import CustomDatePicker from "@components/common/CommonDatePicker";
import DriverList from './DriverList';

const CarrierModal = ({ 
  open, 
  onClose, 
  carrierData, 
  onChange, 
  onSubmit,
  onDriverAdd,
  onDriverRemove,
  onDriverChange
}) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Create New Carrier</DialogTitle>
      <DialogContent>
        <Box sx={{ p: 2 }}>
          <Grid container spacing={3}>
            {/* Company Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Company Information</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Company Name"
                name="companyName"
                value={carrierData.companyName}
                onChange={onChange}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="MC Number"
                name="mcNumber"
                value={carrierData.mcNumber}
                onChange={onChange}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="USDOT"
                name="usdot"
                value={carrierData.usdot}
                onChange={onChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={carrierData.address}
                onChange={onChange}
                multiline
                rows={2}
              />
            </Grid>

            {/* Contact Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Contact Information</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Primary Contact"
                name="primaryContact"
                value={carrierData.primaryContact}
                onChange={onChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Contact Email"
                name="contactEmail"
                type="email"
                value={carrierData.contactEmail}
                onChange={onChange}
              />
            </Grid>

            {/* <DriverList
              drivers={carrierData.drivers}
              onDriverAdd={onDriverAdd}
              onDriverRemove={onDriverRemove}
              onDriverChange={onDriverChange}
            /> */}
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={onSubmit}
        >
          Create Carrier
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CarrierModal; 