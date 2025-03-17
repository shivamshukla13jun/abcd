import React, { useState, useEffect } from 'react';
import { Grid, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import apiService from '@/service/apiService';

const CustomerSection = ({ register, errors }) => {
  const [terms, setTerms] = useState([]);
  useEffect(() => {
    const fetchTerms = async () => {
      const response = await apiService.getPaymentTerms();
      setTerms(response.data);
    };
    fetchTerms();
  }, []);
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
        {/* invoice due date */}
        <Grid item md={6}>
          <TextField
            fullWidth
            label="Invoice Due Date"
            type="date"
            {...register('invoiceDueDate')}
            error={!!errors.invoiceDueDate}
            helperText={errors.invoiceDueDate?.message}
          />  
        </Grid>
        {/* location */}
        <Grid item md={6}>
          <TextField
            fullWidth
            label="Location"
            type="text"
            {...register('location')}
            error={!!errors.location}
            helperText={errors.location?.message}
          />  
        </Grid>
        {/*select  terms */}
        <Grid item md={6}>
          <FormControl fullWidth>
            <InputLabel>Terms</InputLabel>
            <Select
              {...register('terms')}
              label="Terms"
            >
              <MenuItem value="">Select Terms</MenuItem>
              {terms.map((term) => (
                <MenuItem key={term._id} value={term._id}>
                  {term.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default CustomerSection; 