import React, { useState, useEffect } from 'react';
import {
  Grid,
  TextField,
  Button,
  Box,
  FormControlLabel,
  Switch
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';

const DriverInfo = ({ driverData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    driverName: '',
    driverPhone: '',
    driverCDL: '',
    driverCDLExpiration: null,
    isActive: true,
    ...driverData
  });

  useEffect(() => {
    setFormData({
      driverName: '',
      driverPhone: '',
      driverCDL: '',
      driverCDLExpiration: null,
      isActive: true,
      ...driverData
    });
  }, [driverData]);

  const handleChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      driverCDLExpiration: date ? dayjs(date).format('YYYY-MM-DD') : null
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
            label="CDL Expiration"
            value={formData.driverCDLExpiration ? dayjs(formData.driverCDLExpiration) : null}
            onChange={handleDateChange}
            format="YYYY-MM-DD"
            renderInput={(params) => <TextField fullWidth {...params} />}
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
              {driverData?.driverName ? 'Update Driver' : 'Add Driver'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </form>
  );
};

export default DriverInfo;
