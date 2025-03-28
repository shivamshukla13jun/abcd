import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Select,
  MenuItem,
  Button,
  Grid,
  Paper,
  Stack,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import apiService from '@/service/apiService';

const ItemsTable = ({ fields, register, remove, append, watch, setValue }) => {
  const [itemServices, setItemServices] = useState([]);

  useEffect(() => {
    fetchItemServices();
  }, []);

  const getSubtotal = () => {
    const baseAmount = watch("customerRate") || 0;
    const totalExpenses = fields
      .filter(expense => !isNaN(parseFloat(expense.value)))
      .reduce((sum, expense) => {
        const amount = parseFloat(expense.value);
        return expense.positive ? sum + amount : sum - amount;
      }, 0);

    return baseAmount + totalExpenses;
  };

  const fetchItemServices = async () => {
    try {
      const response = await apiService.getItemServices();
      setItemServices(response.data);
    } catch (err) {
      console.error('Error fetching services:', err);
    }
  };

  const handleAddExpense = () => {
    append({ value: null, service: null, positive: false, desc: "" });
  };

  const handleExpenseChange = (index, field, value) => {
    console.log("field",field)
    console.log("value",value)
    if (field === 'service') {
      const selectedService = itemServices.find(service => service._id === value);
      if (selectedService) {
        setValue(`expenses.${index}.service`, value);
      }
    } else if (field === 'value') {
      if (!fields[index].service) {
        alert("Please select a service first.");
        return;
      }
      setValue(`expenses.${index}.value`, value);
    } else if (field === 'positive') {
      setValue(`expenses.${index}.positive`, value);
    } else if (field === 'desc') {
      setValue(`expenses.${index}.desc`, value);
    }
  };

  const handleRemoveExpense = (index) => {
    remove(index);
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
          {fields.map((expense, index) => (
            <Paper key={expense.id} elevation={1} sx={{ p: 2, '&:hover': { bgcolor: 'background.default' } }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={3}>
                  <Select
                    fullWidth
                    size="small"
                    label="Service"
                    value={expense.service || ''}
                    onChange={(e) => handleExpenseChange(index, 'service', e.target.value)}
                  >
                    <MenuItem value="">Select Service</MenuItem>
                    {itemServices.map((service) => (
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
                      onChange={(e) => handleExpenseChange(index, 'value', e.target.value)}
                    />
                    <Box display="flex" alignItems="center" gap={1}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={expense.positive === true}
                            onChange={() => handleExpenseChange(index, 'positive', true)}
                          />
                        }
                        label="+"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={expense.positive === false}
                            onChange={() => handleExpenseChange(index, 'positive', false)}
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
                    onChange={(e) => handleExpenseChange(index, 'desc', e.target.value)}
                  />
                </Grid>

                <Grid item xs={12} md={1}>
                  <IconButton
                    color="error"
                    onClick={() => handleRemoveExpense(index)}
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </Paper>
          ))}
          
          <Typography variant="h6" sx={{ mt: 2, padding: 2 }} color="primary">
            Sub Total: <Typography component="span" color="text.primary">
              {getSubtotal()}
            </Typography>
          </Typography>
        </Stack>
      </Box>
      
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={handleAddExpense}
        size="small"
        sx={{ mt: 2 }}
      >
        Add Expense
      </Button>
    </Grid>
  );
};

export default ItemsTable;