import React from 'react';
import { Grid, TextField } from '@mui/material';

const NotesSection = ({ register, errors }) => {
  return (
    <Grid item xs={12}>
      <Grid container spacing={3}>
        <Grid item md={12}>
          <TextField
            fullWidth
            label="Message on Invoice"
            multiline
            rows={3}
            {...register('customerNotes')}
            error={!!errors.customerNotes}
            helperText={errors.customerNotes?.message}
            placeholder="Thank you for your business!"
          />
        </Grid>
        <Grid item md={12}>
          <TextField
            fullWidth
            label="Terms and Conditions"
            multiline
            rows={3}
            {...register('terms_conditions')}
            error={!!errors.terms_conditions}
            helperText={errors.terms_conditions?.message}
            placeholder="Statement message..."
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default NotesSection; 