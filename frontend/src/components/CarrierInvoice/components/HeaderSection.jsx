import React from 'react';
import { Grid, TextField, Typography } from '@mui/material';

const HeaderSection = ({ formData, onChange, loadNumber, setLoadNumber }) => {
  return (
    <>
      <Typography variant="h6" color="primary" gutterBottom>
        Invoice Details
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Load Number"
            value={loadNumber || ''}
            onChange={(e) => setLoadNumber(e.target.value)}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            type="date"
            label="Due Date"
            value={formData.dueDate || ''}
            onChange={(e) => onChange('dueDate', e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Terms"
            value={formData.terms || ''}
            onChange={(e) => onChange('terms', e.target.value)}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default HeaderSection;