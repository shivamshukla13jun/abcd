import React from 'react';
import { Grid, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

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
         {/* payment options select */}
        <Grid item md={6}>
          <FormControl fullWidth>
            <InputLabel>Payment Options</InputLabel>
            <Select
              {...register('paymentOptions')}
              label="Payment Options"
            >
              <MenuItem value="Credit Card">Credit Card</MenuItem>
              <MenuItem value="Cash">Cash</MenuItem>
              <MenuItem value="Check">Check</MenuItem>
              <MenuItem value="Wire">Wire</MenuItem>
            </Select> 
          </FormControl>
        </Grid>
        {/* invoice date  */}
        <Grid item md={6}>
          <TextField
            fullWidth
            label="Invoice Date"
            type="date"
            {...register('invoiceDate')}
            error={!!errors.invoiceDate}
            helperText={errors.invoiceDate?.message}
          />  
        </Grid>
      </Grid>
    </Grid>
  );
};

export default CustomerSection; 