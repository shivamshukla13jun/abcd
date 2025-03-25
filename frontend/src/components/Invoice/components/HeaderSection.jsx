import React, { useState, useEffect } from 'react';
import { Grid, TextField, Typography, Box, FormControl, InputLabel, Select, MenuItem, CircularProgress, FormHelperText } from '@mui/material';
import apiService from '@/service/apiService';

const HeaderSection = ({ searchTerm, setSearchTerm, register, balanceDue, errors, setValue, watch }) => {
   const [customers, setCustomers] = useState([]);
   const [loading, setLoading] = useState(false);

   useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const response = await apiService.getCustomers();
        console.log("response",response)
        setCustomers(response.data);
      } catch (err) {
        console.error('Error fetching customers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const handleCustomerSelect = (e) => {
    const selectedCustomer = customers.find(customer => customer._id === e.target.value);
    if (selectedCustomer) {
      setValue('customerEmail', selectedCustomer.email);
      setValue('customerName', selectedCustomer.customerName);
      setValue('customerAddress', selectedCustomer.address);
      setValue('terms', selectedCustomer.paymentTerms?._id);
      setValue('customerId', selectedCustomer._id);
      setValue('customerEmail', selectedCustomer.email);
    }
  };

  return (
    <Grid item xs={12}>
      <Grid container spacing={3}>
        <Grid item md={6}>
          <FormControl fullWidth error={!!errors.customerId}>
            <InputLabel>Select Customer</InputLabel>
            <Select
              label="Select Customer"
              {...register('customerId')}
              value={watch('customerId')}
              disabled={loading}
              onChange={handleCustomerSelect}
              defaultValue=""
            >
              <MenuItem value="">
                {loading ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <CircularProgress size={20} />
                    Loading customers...
                  </div>
                ) : (
                  'Select a customer'
                )}
              </MenuItem>
              {customers.map((customer) => (
                <MenuItem key={customer._id} value={customer._id}>
                  {customer.customerName} - {customer.mcNumber}
                </MenuItem>
              ))}
            </Select>
            {errors.customerId && (
              <FormHelperText>{errors.customerId.message}</FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item md={4}>
          <FormControl fullWidth error={!!errors.invoiceNumber}>
            <TextField
              fullWidth
              label="Invoice Number"
              {...register('invoiceNumber')}
              InputLabelProps={{ shrink: true }}
              onChange={(e) => setSearchTerm(e.target.value)}
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
