import React, { useState, useEffect } from 'react';
import { Grid, TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import apiService from '@/service/apiService';
import CustomDatePicker from '@/components/common/CommonDatePicker';
import dayjs from 'dayjs';

const CustomerSection = ({ register, errors, watch, setValue }) => {
 const [loading, setLoading] = useState(false);
  const [terms, setTerms] = useState([]);
  useEffect(() => {
    const fetchTerms = async () => {
     try {
      setLoading(true);
      const response = await apiService.getPaymentTerms();
      setTerms(response.data);
   
     } catch (error) {
      console.error('Error fetching payment terms:', error);
      setLoading(false);
     }finally {
      setLoading(false);
     }
    };
    fetchTerms();
  }, []);
  
  useEffect(() => {
    const selectedTerm = terms.find(term => term._id === watch('terms'));
    if (selectedTerm) {
      const dueDate = dayjs(watch('dueDate')).add(selectedTerm.days, 'day').format('YYYY-MM-DD');
      setValue('dueDate', dueDate);
    }
  }, [watch('terms')]);

  const handleCHangeDueDate = (e) => {
    if(watch('terms')){
      const selectedTerm = terms.find(term => term._id === watch('terms'));
      const dueDate = dayjs(e.target.value).add(selectedTerm.days, 'day').format('YYYY-MM-DD');
      setValue('dueDate', dueDate);
      return 
    }
    setValue('dueDate', e.target.value);
  };

  return (
    <Grid item xs={12}>
      <Grid container spacing={3}>
        <Grid item md={6}>
          <TextField
            fullWidth
            label="Carrier Email"
            type="email"
            {...register('customerEmail')}
            error={!!errors.customerEmail}  
            helperText={errors.customerEmail?.message}
            InputProps={{ readOnly: true }}
            InputLabelProps={{ shrink: true }}
            placeholder="Customer email will auto-fill"
          />
        </Grid>
        <Grid item md={6}>
          <FormControl fullWidth error={!!errors.paymentOptions}>
            <InputLabel>Payment Options</InputLabel>
            <Select
              {...register('paymentOptions')}
              aria-hidden={false}
              label="Payment Options"
              value={watch('paymentOptions')}
              disabled={loading}
              InputLabelProps={{ shrink: true }}
            >
              <MenuItem value="">Select payment option</MenuItem>
              <MenuItem value="Credit Card">Credit Card</MenuItem>
              <MenuItem value="Cash">Cash</MenuItem>
              <MenuItem value="Check">Check</MenuItem>
              <MenuItem value="Wire">Wire</MenuItem>
            </Select>
            {errors.paymentOptions && (
              <FormHelperText>{errors.paymentOptions.message}</FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item md={6}>
          <CustomDatePicker
            label="Invoice Date"
            placeholder='Enter invoice date'
            name="invoiceDate"
            register={register}
            value={watch('invoiceDate')}
            onChange={register('invoiceDate').onChange}
            errors={errors}
          />
          {errors.invoiceDate && (
            <FormHelperText error>{errors.invoiceDate.message}</FormHelperText>
          )}
        </Grid>
        <Grid item md={6}>
          <CustomDatePicker
            label="Invoice Due Date"
            placeholder='Enter invoice due date'
            name="dueDate"
            register={register}
            value={watch('dueDate')}
            onChange={handleCHangeDueDate}
            errors={errors}
          />
          {errors.dueDate && (
            <FormHelperText error>{errors.dueDate.message}</FormHelperText>
          )}
        </Grid>
        <Grid item md={6}>
          <TextField
            fullWidth
            label="Location"
            type="text"
            {...register('location')}
            error={!!errors.location}
            helperText={errors.location?.message}
            InputLabelProps={{ shrink: true }}
            placeholder="Enter location"
          />
          {errors.location && (
            <FormHelperText error>{errors.location.message}</FormHelperText>
          )}
        </Grid>
        <Grid item md={6}>
          <FormControl fullWidth error={!!errors.terms}>
            <InputLabel>Terms</InputLabel>
            <Select
              {...register('terms')}
              aria-hidden={false}
              label="Terms"
              value={watch('terms')}
              InputLabelProps={{ shrink: true }}
            >
              <MenuItem value="">Select Terms</MenuItem>
              {terms.map((term) => (
                <MenuItem key={term._id} value={term._id}>
                  {term.name}
                </MenuItem>
              ))}
            </Select>
            {errors.terms && (
              <FormHelperText>{errors.terms.message}</FormHelperText>
            )}
          </FormControl>
        </Grid>
    
      </Grid>
    </Grid>
  );
};

export default CustomerSection;