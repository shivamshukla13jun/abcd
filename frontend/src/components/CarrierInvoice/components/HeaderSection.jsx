import React, { useState, useEffect } from 'react';
import { Grid, TextField, Typography, Box, FormControl, InputLabel, Select, MenuItem, CircularProgress, FormHelperText } from '@mui/material';
import apiService from '@/service/apiService';

const HeaderSection = ({ register, errors, setValue, watch,customerId }) => {
   const [customers, setCustomers] = useState([]);
   const [loading, setLoading] = useState(false);
  
  return (
    <Grid item xs={12}>
      <Grid container spacing={3}>
        <Grid item md={6}>
        <FormControl fullWidth error={!!errors.customerName}>
            <TextField
              fullWidth
              label="Carrier Name"
              value={watch('customerName')}
              {...register('customerName')}
              // placeholder="Enter billing address"
              InputLabelProps={{ shrink: true }}
            />
            {errors.customerName && (
              <FormHelperText>{errors.customerName.message}</FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item md={4}>
          <FormControl fullWidth error={!!errors.invoiceNumber}>
            <TextField
              fullWidth
              readOnly={true}
              label="Invoice Number"
              value={watch('invoiceNumber')}
              // {...register('invoiceNumber')}
              InputLabelProps={{ shrink: true }}
              // onChange={(e) => setSearchTerm(e.target.value)}
            />
            {errors.invoiceNumber && (
              <FormHelperText>{errors.invoiceNumber.message}</FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item md={12}>
          <FormControl fullWidth error={!!errors.customerAddress}>
            <TextField
              fullWidth
              label="Billing Address"
              multiline
              rows={4}
              {...register('customerAddress')}
              placeholder="Enter billing address"
              InputLabelProps={{ shrink: true }}
            />
            {errors.customerAddress && (
              <FormHelperText>{errors.customerAddress.message}</FormHelperText>
            )}
          </FormControl>
        </Grid>
    
      
      </Grid>
    </Grid>
  );
};

export default HeaderSection;
