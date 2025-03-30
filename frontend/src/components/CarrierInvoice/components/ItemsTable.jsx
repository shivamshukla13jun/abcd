import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Grid, Typography, Paper, Stack } from '@mui/material';
import { updateFormField } from '@/redux/Slice/invoiceSlice';

const ItemsTable = ({ items, onChange, totals }) => {
  const dispatch = useDispatch();

  const handleItemChange = (value) => {
    dispatch(updateFormField({ field: 'carrierRate', value }));
  };

  return (
    <Grid item xs={12}>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Invoice Items
        </Typography>
        <Box>
          <Stack spacing={2}>
            <Typography>Rate: ${items || 0}</Typography>
            <Typography>Subtotal: ${totals?.subTotal || 0}</Typography>
          </Stack>
        </Box>
      </Paper>
    </Grid>
  );
};

export default ItemsTable;