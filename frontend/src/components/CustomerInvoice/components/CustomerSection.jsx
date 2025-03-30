
import React from 'react';
import { Grid, TextField, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { updateFormField } from '@/redux/Slice/invoiceSlice';

const CustomerSection = ({ formData }) => {
  const dispatch = useDispatch();

  const handleChange = (field) => (event) => {
    dispatch(updateFormField({ field, value: event.target.value }));
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h6" color="primary">Customer Information</Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Company Name"
          value={formData.customerCompany || ''}
          onChange={handleChange('customerCompany')}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          fullWidth
          label="Contact Name"
          value={formData.customerContact || ''}
          onChange={handleChange('customerContact')}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          fullWidth
          label="Phone"
          value={formData.customerPhone || ''}
          onChange={handleChange('customerPhone')}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Address"
          multiline
          rows={2}
          value={formData.customerAddress || ''}
          onChange={handleChange('customerAddress')}
        />
      </Grid>
    </Grid>
  );
};

export default CustomerSection;
