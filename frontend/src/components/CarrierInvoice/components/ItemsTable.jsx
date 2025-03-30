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

const ItemsTable = () => {
  const dispatch = useDispatch();
  const { formData, itemServices } = useSelector(state => state.invoice);
  const carrierExpenses = formData.carrierExpense || [];

  const handleExpenseChange = (index, field) => (event) => {
    const newExpenses = [...carrierExpenses];
    newExpenses[index][field] = event.target.value;
    dispatch(updateFormField({ field: 'carrierExpense', value: newExpenses }));
  };

  return (
    <Grid item xs={12}>
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" color="primary">
            Carrier Expenses
          </Typography>
        </Box>

        <Stack spacing={2}>
          {carrierExpenses.map((expense, index) => (
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
                {/* Added back other fields from original code */}
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
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={expense.positive === true}
                            onChange={handleExpenseChange(index, 'positive')}
                          />
                        }
                        label="+"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={expense.positive === false}
                            onChange={handleExpenseChange(index, 'positive')}
                          />
                        }
                        label="-"
                      />
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

              </Grid>
            </Paper>
          ))}
        </Stack>
      </Box>
    </Grid>
  );
};

export default ItemsTable;