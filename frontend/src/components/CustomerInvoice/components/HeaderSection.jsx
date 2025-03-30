
import React from 'react';
import { Grid, TextField, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { updateFormField, setLoadNumber } from '@/redux/Slice/invoiceSlice';

const HeaderSection = ({ formData, loadNumber }) => {
  const dispatch = useDispatch();

  const handleChange = (field) => (event) => {
    dispatch(updateFormField({ field, value: event.target.value }));
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h6" color="primary">Invoice Details</Typography>
      </Grid>
      <Grid item xs={6}>
        <TextField
          fullWidth
          label="Load Number"
          value={loadNumber || ''}
          onChange={(e) => dispatch(setLoadNumber(e.target.value))}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          fullWidth
          label="Invoice Number"
          value={formData.invoiceNumber || ''}
          onChange={handleChange('invoiceNumber')}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          fullWidth
          type="date"
          label="Invoice Date"
          InputLabelProps={{ shrink: true }}
          value={formData.invoiceDate || ''}
          onChange={handleChange('invoiceDate')}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          fullWidth
          type="date"
          label="Due Date"
          InputLabelProps={{ shrink: true }}
          value={formData.dueDate || ''}
          onChange={handleChange('dueDate')}
        />
      </Grid>
    </Grid>
  );
};

export default HeaderSection;
