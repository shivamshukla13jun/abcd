
import React from 'react';
import { Grid, TextField, Typography, MenuItem } from '@mui/material';
import { useDispatch } from 'react-redux';
import { updateFormField } from '@/redux/Slice/invoiceSlice';
import { TAX_OPTIONS } from '../constants';

const TotalsSection = ({ formData, totals }) => {
  const dispatch = useDispatch();

  const handleChange = (field) => (event) => {
    dispatch(updateFormField({ field, value: event.target.value }));
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h6" color="primary">Totals</Typography>
      </Grid>
      
      <Grid item xs={6}>
        <TextField
          fullWidth
          label="Subtotal"
          value={totals.subTotal || 0}
          disabled
        />
      </Grid>
      
      <Grid item xs={6}>
        <TextField
          fullWidth
          type="number"
          label="Discount %"
          value={formData.discountPercent || 0}
          onChange={handleChange('discountPercent')}
        />
      </Grid>

      <Grid item xs={6}>
        <TextField
          select
          fullWidth
          label="Tax"
          value={formData.tax || ''}
          onChange={handleChange('tax')}
        >
          {TAX_OPTIONS.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {option.name} ({option.rate}%)
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      <Grid item xs={6}>
        <TextField
          fullWidth
          label="Tax Amount"
          value={totals.taxAmount || 0}
          disabled
        />
      </Grid>

      <Grid item xs={6}>
        <TextField
          fullWidth
          type="number"
          label="Deposit"
          value={formData.deposit || 0}
          onChange={handleChange('deposit')}
        />
      </Grid>

      <Grid item xs={6}>
        <TextField
          fullWidth
          label="Balance Due"
          value={totals.balanceDue || 0}
          disabled
        />
      </Grid>
    </Grid>
  );
};

export default TotalsSection;
