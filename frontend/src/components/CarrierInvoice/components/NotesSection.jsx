import React from 'react';
import { TextField, Typography } from '@mui/material';

const NotesSection = ({ notes, onChange }) => {
  return (
    <>
      <Typography variant="h6" color="primary" gutterBottom>
        Notes
      </Typography>
      <TextField
        fullWidth
        multiline
        rows={4}
        value={notes || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Add any additional notes here..."
      />
    </>
  );
};

export default NotesSection;