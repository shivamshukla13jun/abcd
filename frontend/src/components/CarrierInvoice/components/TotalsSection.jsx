
import React from 'react';
import { Grid, TextField, Typography, MenuItem } from '@mui/material';
import { TAX_OPTIONS } from '../constants';

const TotalsSection = ({ formData, onChange, totals }) => {
  return (
    <>
      <Typography variant="h6" color="primary" gutterBottom>
        Totals
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            fullWidth
            type="number"
            label="Discount %"
            value={formData.discountPercent || ''}
            onChange={(e) => onChange('discountPercent', e.target.value)}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            select
            fullWidth
            label="Tax"
            value={formData.tax || ''}
            onChange={(e) => onChange('tax', e.target.value)}
          >
            {TAX_OPTIONS.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.name} ({option.rate}%)
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            type="number"
            label="Deposit"
            value={formData.deposit || ''}
            onChange={(e) => onChange('deposit', e.target.value)}
          />
        </Grid>
        
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Sub Total"
            value={totals.subTotal || 0}
            InputProps={{ readOnly: true }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Total Tax"
            value={totals.taxAmount || 0}
            InputProps={{ readOnly: true }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Total Discount"
            value={totals.totalDiscount || 0}
            InputProps={{ readOnly: true }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Balance Due"
            value={totals.balanceDue || 0}
            InputProps={{ readOnly: true }}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default TotalsSection;
