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

const ItemsTable = ({ fields, register, remove, append, watch, setValue, totals, setTotals }) => {
  console.log("totals",totals)
  const [itemServices, setItemServices] = useState([]);
  useEffect(() => {
    fetchItemServices();
  }, []);
  
  // Add this useEffect to watch for changes
  useEffect(() => {
    const subtotal = getSubtotal();
    const carrierSubtotal = getCarrierSubtotal();
    setTotals(prev => ({ 
      ...prev, 
      subTotal: subtotal,
      carrierSubTotal: carrierSubtotal 
    }));
  }, [watch("customerRate"), watch("carrierRate"), fields]);

  const getSubtotal = () => {
    const baseAmount = parseFloat(watch("customerRate")) || 0;
    const totalExpenses = fields.reduce((sum, expense) => {
      const amount = parseFloat(watch(`carrierExpense.${expense.id}.value`)) || 0;
      const isPositive = watch(`carrierExpense.${expense.id}.positive`);
      return isPositive ? sum + amount : sum - amount;
    }, 0);
    return baseAmount + totalExpenses;
  };

  const getCarrierSubtotal = () => {
    const baseAmount = parseFloat(watch("carrierRate")) || 0;
    const totalExpenses = fields.reduce((sum, expense) => {
      const amount = parseFloat(watch(`carrierExpense.${expense.id}.value`)) || 0;
      const isPositive = watch(`carrierExpense.${expense.id}.positive`);
      return isPositive ? sum + amount : sum - amount;
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

  const handleExpenseChange = (index, field,checked) => (e) => {
    const value = e.target.value;
     
    // Special handling for service to ensure it's a valid service
    if (field === 'service') {
      const selectedService = itemServices.find(service => service._id === value);
      if (!selectedService) {
        return;
      }
    }

    // Special handling for positive checkbox
    if (field === 'positive') {
      setValue(`carrierExpense.${index}.positive`,checked);
      const subtotal=getSubtotal()
      setTotals((prev=>({...prev,subTotal:subtotal})))
      return;
    }

    // Set the value for other fields
    setValue(`carrierExpense.${index}.${field}`, value);
    const subtotal=getSubtotal()
    setTotals((prev=>({...prev,subTotal:subtotal})))
  };

  const handleRemoveExpense = (index) => {
    let alert = window.confirm("Are you sure you want to delete this expense?");
    if (!alert) return;
    remove(index);
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
          {fields.map((expense, index) => (
            <Paper key={expense.id} elevation={1} sx={{ p: 2, '&:hover': { bgcolor: 'background.default' } }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={3}>
                  <Select
                    fullWidth
                    size="small"
                    label="Service"
                    value={watch(`carrierExpense.${index}.service`) || ''}
                    onChange={handleExpenseChange(index, 'service')}
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
                      value={watch(`carrierExpense.${index}.value`) || ''}
                      onChange={handleExpenseChange(index, 'value')}
                    />
                    <Box display="flex" alignItems="center" gap={1}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={watch(`carrierExpense.${index}.positive`) === true}
                            onChange={handleExpenseChange(index, 'positive',true)}
                          />
                        }
                        label="+"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={watch(`carrierExpense.${index}.positive`) === false}
                            onChange={handleExpenseChange(index, 'positive',false)}
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
                    value={watch(`carrierExpense.${index}.desc`) || ''}
                    onChange={handleExpenseChange(index, 'desc')}
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
              {totals.subTotal}
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