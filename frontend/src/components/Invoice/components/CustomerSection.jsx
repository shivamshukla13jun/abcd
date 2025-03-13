import React from 'react';
import { Grid, TextField } from '@mui/material';

const CustomerSection = ({ register, errors }) => {
  return (
    <Grid item xs={12}>
      <Grid container spacing={3}>
        
        <Grid item md={6}>
          <TextField
            fullWidth
            label="Customer Email"
            type="email"
            {...register('customerEmail')}
            error={!!errors.customerEmail}
            helperText={errors.customerEmail?.message}
            InputProps={{ readOnly: true }}
            placeholder="Customer email will auto-fill"
          />
        </Grid>
        <Grid item md={12}>
          <TextField
            fullWidth
            label="Billing Address"
            multiline
            rows={4}
            {...register('customerAddress')}
            error={!!errors.customerAddress}
            helperText={errors.customerAddress?.message}
            placeholder="Enter billing address"
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default CustomerSection; 