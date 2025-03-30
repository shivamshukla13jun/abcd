import React from 'react';
import { Grid, TextField, Typography } from '@mui/material';

const CustomerSection = ({ formData, onChange }) => {
  return (
    <>
      <Typography variant="h6" color="primary" gutterBottom>
        Customer Details
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Customer Name"
            value={formData.customerName || ''}
            onChange={(e) => onChange('customerName', e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Customer Email"
            value={formData.customerEmail || ''}
            onChange={(e) => onChange('customerEmail', e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Customer Address"
            value={formData.customerAddress || ''}
            onChange={(e) => onChange('customerAddress', e.target.value)}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default CustomerSection;