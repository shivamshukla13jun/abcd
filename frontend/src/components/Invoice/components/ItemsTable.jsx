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
import { formatCurrency } from '@/utils/formatCurrency';
import { getServiceType } from '@/utils/getServicetype';
import { toast } from 'react-toastify';

const ItemsTable = ({ fields, register, remove, append, watch, setValue, totals, setTotals ,errors}) => {
  const [itemServices, setItemServices] = useState([]);
  const [customerExpenseData, setCustomerExpenseData] = useState(watch("customerExpense") || []);
  const [selectedService, setSelectedService] = useState(""); // New state for selected service
  const baseAmount = parseFloat(watch("customerRate")) || 0;
  useEffect(() => {
    fetchItemServices();
  }, []);

  useEffect(() => {
    setCustomerExpenseData(watch("customerExpense") || []);
  }, []);

  useEffect(() => {
    setValue("customerExpense", customerExpenseData);
    setTotals(prev => ({ ...prev, subTotal: getSubtotal() }));
  }, [customerExpenseData]);

  const getSubtotal = () => {
   
    const totalExpenses = customerExpenseData.reduce((sum, expense) => {
      const amount = parseFloat(expense.value) || 0;
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
   const newExpense={ value: null, service: null, positive: true, desc: "" }
  const handleAddExpense = () => {
    setCustomerExpenseData(prev => [...prev,newExpense ]);
    setSelectedService(""); // Reset service selection after adding expense
  };

  const handleExpenseChange = (index, field, checked) => (e) => {
    const value = field === "positive" ? checked : e.target.value;
    if (field !== 'service' && !customerExpenseData[index]?.service) {
      toast.info('Please add a service first.')
      return
    }

    if (field === "service") {
      setCustomerExpenseData(prev => {
        const updatedExpenses = [...prev];
        updatedExpenses[index] = {
          ...updatedExpenses[index],
          ...newExpense,
          [field]: value
        };
        return updatedExpenses;
      });
    } else {
      setCustomerExpenseData(prev => {
        const updatedExpenses = [...prev];
        updatedExpenses[index] = {
          ...updatedExpenses[index],
          [field]: value
        };
        return updatedExpenses;
      });
    }
  };

  const handleRemoveExpense = (index) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      setCustomerExpenseData(prev => prev.filter((_, i) => i !== index));
    }
  };

  return (
    <Grid item xs={12}>
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" color="primary">
        Customer Expenses | Flat Rate ({formatCurrency(baseAmount)})
</Typography>

        </Box>

        {/* Select Service Dropdown */}
        {/* <Select
          fullWidth
          size="small"
          value={selectedService}
          onChange={(e) => setSelectedService(e.target.value)}
        >
          <MenuItem value="">Select Service</MenuItem>
          {itemServices.map((service) => (
            <MenuItem key={service._id} value={service._id}>
              {service.label}
            </MenuItem>
          ))}
        </Select> */}

        {/* Add Expense Button (Disabled if no service is selected) */}
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddExpense}
          size="small"
          sx={{ mt: 2 }}
          // disabled={!selectedService} // Disable button until service is selected
        >
          Add Expense
        </Button>

        <Stack spacing={2} mt={2}>
          {customerExpenseData.map((expense, index) => (
            <Paper key={index} elevation={1} sx={{ p: 2, '&:hover': { bgcolor: 'background.default' } }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={3}>
                  <Select
                    fullWidth
                    size="small"
                    value={expense.service || ''}
                    onChange={handleExpenseChange(index, 'service')}
                    error={Boolean(errors?.customerExpense?.[index]?.service)}
                  >
                    <MenuItem value="">Select Service</MenuItem>
                    {itemServices.map((service) => (
                      <MenuItem key={service._id} value={service._id}>
                        {service.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors?.customerExpense?.[index]?.service && (
                    <Typography variant="caption" color="error">
                      {errors.customerExpense[index].service.message}
                    </Typography>
                  )}
                </Grid>

                <Grid item xs={12} md={3}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <TextField
                      fullWidth
                      size="small"
                      type={getServiceType(expense.service, itemServices)}
                      label="Value"
                      value={expense.value || ''}
                      onChange={handleExpenseChange(index, 'value')}
                      error={Boolean(errors?.customerExpense?.[index]?.value)}
                      helperText={errors?.customerExpense?.[index]?.value?.message}
                    />
                    <Box display="flex" alignItems="center" gap={1}>
                      <FormControlLabel
                        control={<Checkbox checked={expense.positive === true} onChange={handleExpenseChange(index, 'positive', true)} />}
                        label="+"
                      />
                      <FormControlLabel
                        control={<Checkbox checked={expense.positive === false} onChange={handleExpenseChange(index, 'positive', false)} />}
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
                    error={Boolean(errors?.customerExpense?.[index]?.desc)}
                    helperText={errors?.customerExpense?.[index]?.desc?.message}
                  />
                </Grid>

                <Grid item xs={12} md={1}>
                  <IconButton color="error" onClick={() => handleRemoveExpense(index)} size="small">
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </Paper>
          ))}

          {/* Subtotal Calculation */}
          <Typography variant="h6" sx={{ mt: 2, padding: 2 }} color="primary">
            Sub Total: <Typography component="span" color="text.primary">{formatCurrency(totals.subTotal)}</Typography>
          </Typography>
        </Stack>
      </Box>
    </Grid>
  );
};

export default ItemsTable;
