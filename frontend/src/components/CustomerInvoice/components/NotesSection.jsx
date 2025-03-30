
import React from 'react';
import { TextField, Typography, Box } from '@mui/material';
import { useDispatch } from 'react-redux';
import { updateFormField } from '@/redux/Slice/invoiceSlice';

const NotesSection = ({ formData }) => {
  const dispatch = useDispatch();

  return (
    <Box>
      <Typography variant="h6" color="primary" gutterBottom>
        Notes
      </Typography>
      <TextField
        fullWidth
        multiline
        rows={4}
        value={formData.notes || ''}
        onChange={(e) => dispatch(updateFormField({ field: 'notes', value: e.target.value }))}
        placeholder="Add any additional notes here..."
      />
    </Box>
  );
};

export default NotesSection;
