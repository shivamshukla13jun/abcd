import React from 'react';
import { Grid, TextField } from '@mui/material';

const NotesSection = ({ register, errors }) => {
  return (
    <Grid item xs={12}>
      <Grid container spacing={3}>
        <Grid item md={12}>
          <TextField
            fullWidth
            label="Customer Notes"
            multiline
            rows={8}
            {...register('customerNotes')}
            error={!!errors.customerNotes}
            helperText={errors.customerNotes?.message}
            placeholder="Enter Customer Notes"
          />
        </Grid>
        <Grid item md={12}>
          <TextField
            fullWidth
            label="Terms and Conditions"
            multiline
            rows={6.5}
            {...register('terms_conditions')}
            error={!!errors.terms_conditions}
            helperText={errors.terms_conditions?.message}
            placeholder="Enter Terms and Conditions"
          />
        </Grid>
    
      </Grid>
    </Grid>
  );
};

export default NotesSection;