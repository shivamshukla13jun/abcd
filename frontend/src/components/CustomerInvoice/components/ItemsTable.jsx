import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Grid, Typography, Paper, Stack, Select, MenuItem } from '@mui/material';
import { updateFormField } from '@/redux/Slice/invoiceSlice';

const ItemsTable = () => {
  const dispatch = useDispatch();
  const { formData, itemServices } = useSelector(state => state.invoice);
  const customerExpenses = formData.customerExpense || [];

  const handleExpenseChange = (index, field) => (event) => {
    const newExpenses = [...customerExpenses];
    newExpenses[index][field] = event.target.value;
    dispatch(updateFormField({ field: 'customerExpense', value: newExpenses }));
  };

  return (
    <Grid item xs={12}>
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" color="primary">
            Customer Expenses
          </Typography>
        </Box>

        <Stack spacing={2}>
          {customerExpenses.map((expense, index) => (
            <Paper key={index} elevation={1} sx={{ p: 2, '&:hover': { bgcolor: 'background.default' } }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={3}>
                  <Select
                    fullWidth
                    size="small"
                    label="Service"
                    value={expense.service || ''}
                    onChange={handleExpenseChange(index, 'service')}
                  >
                    <MenuItem value="">Select Service</MenuItem>
                    {itemServices?.map((service) => (
                      <MenuItem key={service._id} value={service._id}>
                        {service.label}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      label="Value"
                      value={expense.value || ''}
                      onChange={handleExpenseChange(index, 'value')}
                    />
                    <Box display="flex" alignItems="center" gap={1}>
                      {/* Positive/Negative checkboxes removed due to incompatibility with edited code */}
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} md={5}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Description"
                    value={expense.desc || ''}
                    onChange={handleExpenseChange(index, 'desc')}
                  />
                </Grid>
                {/* Remove button removed due to incompatibility with edited code */}
              </Grid>
            </Paper>
          ))}
        </Stack>
      </Box>
    </Grid>
  );
};

export default ItemsTable;