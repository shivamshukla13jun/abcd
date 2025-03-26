import React, { useState, useEffect } from 'react';
import {
  Grid,
  TextField,
  Button,
  Box,
  FormControlLabel,
  Switch
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const DriverForm = ({ driver, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    driverName: '',
    driverPhone: '',
    driverCDL: '',
    driverCDLExpiration: null,
    isActive: true,
    ...driver
  });

  useEffect(() => {
    setFormData({
      driverName: '',
      driverPhone: '',
      driverCDL: '',
      driverCDLExpiration: null,
      isActive: true,
      ...driver
    });
  }, [driver]);

  const handleChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Driver Name"
            value={formData.driverName}
            onChange={handleChange('driverName')}
            required
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Driver Phone"
            value={formData.driverPhone}
            onChange={handleChange('driverPhone')}
            required
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="CDL Number"
            value={formData.driverCDL}
            onChange={handleChange('driverCDL')}
            required
          />
        </Grid>
        <Grid item xs={12} md={6}>
          
          <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
  label="CDL Expire Date"
  value={formData.driverCDLExpiration ? dayjs(formData.driverCDLExpiration) : null} // Ensure it's a dayjs object
  onChange={(date) => {
    setFormData(prev => ({
      ...prev,
      driverCDLExpiration: date ? date.toISOString() : null  // Store as ISO string
    }));
  }}
  renderInput={(params) => <TextField {...params} required />}
/>


          </LocalizationProvider>
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={formData.isActive}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  isActive: e.target.checked
                }))}
              />
            }
            label="Active Driver"
          />
        </Grid>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="flex-end" gap={1}>
            <Button onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              {driver?._id ? 'Update Driver' : 'Add Driver'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </form>
  );
};

export default DriverForm;