import React, { useEffect, useState } from 'react';
import {
  Box, Grid, MenuItem, Paper, Stack, TextField, Typography, Button,
  IconButton, Checkbox, FormControlLabel
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { setCustomerExpense } from '@/redux/Slice/EditloadSlice';
import { getServiceType } from '@/utils/getServicetype';
import apiService from '@/service/apiService';
import { IoIosAdd } from 'react-icons/io';
const CustomerExpense = () => {
  const dispatch = useDispatch();
  const { customerInformation = {}, customerRate = 0, customerExpense = [] } = useSelector((state) => state.editload || {});
  
  const [itemServices, setItemServices] = useState([]);
  const [selectedService, setSelectedService] = useState(''); // Track selected service

  useEffect(() => {
    fetchItemServices();
  }, []);

  const fetchItemServices = async () => {
    try {
      const itemServicesResponse = await apiService.getItemServices();
      setItemServices(itemServicesResponse.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const handleAddExpense = () => {
    if (!selectedService) {
      alert("Please select a service before adding an expense.");
      return;
    }

    const newExpense = {
      customerId: customerInformation._id,
      value: '',
      service: selectedService, // Use selected service
      positive: false,
      desc: ""
    };

    dispatch(setCustomerExpense([...customerExpense, newExpense]));
    setSelectedService(''); // Reset service selection
  };

  const handleExpenseChange = (index, field, value) => {
    const updatedExpenses = [...customerExpense];

    if (field === 'service') {
      const selectedService = itemServices.find(service => service._id === value);
      if (selectedService) {
        updatedExpenses[index] = { ...updatedExpenses[index], service: selectedService._id };
      }
    }
    
    if (!updatedExpenses[index].service) {
      alert("Please select a service first.");
      return;
    }

    updatedExpenses[index] = { ...updatedExpenses[index], [field]: value };
    dispatch(setCustomerExpense(updatedExpenses));
  };

  const handleRemoveExpense = (index) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      const updatedExpenses = customerExpense.filter((_, idx) => idx !== index);
      dispatch(setCustomerExpense(updatedExpenses));
    }
  };
  const getSubtotal = () => {
    // const baseAmount =  0; // Ensure valid number
    const baseAmount = parseFloat(customerRate) || 0; // Ensure valid number
      const totalExpenses = customerExpense
        .filter(expense => !isNaN(parseFloat(expense.value))) // Only valid numbers
        .reduce((sum, expense) => {
          const amount = parseFloat(expense.value);
          return expense.positive ? sum + amount : sum - amount;
        }, 0);
    
      return baseAmount + totalExpenses; // Adjust subtotal based on load amount
    };
    
  return (
    <Box>
      {/* Service Dropdown Before Adding an Expense */}
       <Typography variant="h6" color="primary" mb={2}>
              Customer Expenses
            </Typography>
          {/* Select Service Dropdown */}
           <TextField
             select
             fullWidth
             size="small"
             label="Select Service"
             value={selectedService}
             onChange={(e) => setSelectedService(e.target.value)}
           >
             <MenuItem value="">Select Service</MenuItem>
             {itemServices.map((service) => (
               <MenuItem key={service._id} value={service._id}>
                 {service.label}
               </MenuItem>
             ))}
           </TextField>
     
           {/* Add Expense Button (Disabled until a service is selected) */}
           <Button
             variant="contained"
             startIcon={<IoIosAdd />}
             onClick={handleAddExpense}
             size="small"
             sx={{ mt: 2 }}
             disabled={!selectedService} // Disable button if no service selected
           >
             Add Expense
           </Button>

      <Stack spacing={2}>
        {customerExpense.map((expense, index) => (
          <Paper key={index} elevation={1} sx={{ p: 2, '&:hover': { bgcolor: 'background.default' } }}>
            <Grid container spacing={2} alignItems="center">
              {/* Service Dropdown (Already Selected) */}
              <Grid item xs={12} md={3}>
                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Service"
                  value={expense.service || ''}
                  onChange={(e) => handleExpenseChange(index, 'service', e.target.value)}
                >
                  {itemServices.map((service) => (
                    <MenuItem key={service._id} value={service._id}>
                      {service.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Value Input */}
              <Grid item xs={12} md={3}>
                <Box display="flex" alignItems="center" gap={1}>
                  <TextField
                    fullWidth
                    size="small"
                    type={getServiceType(expense.service, itemServices) === "number" ? "number" : "text"}
                    label="Value"
                    value={expense.value || ''}
                    onChange={(e) => handleExpenseChange(index, 'value', e.target.value)}
                  />
                  <Box display="flex" alignItems="center" gap={1}>
                    <FormControlLabel
                      control={<Checkbox checked={expense.positive === true} onChange={() => handleExpenseChange(index, 'positive', true)} />}
                      label="+"
                    />
                    <FormControlLabel
                      control={<Checkbox checked={expense.positive === false} onChange={() => handleExpenseChange(index, 'positive', false)} />}
                      label="-"
                    />
                  </Box>
                </Box>
              </Grid>

              {/* Description */}
              <Grid item xs={12} md={5}>
                <TextField
                  fullWidth
                  size="small"
                  label="Description"
                  value={expense.desc || ''}
                  onChange={(e) => handleExpenseChange(index, 'desc', e.target.value)}
                />
              </Grid>

              {/* Delete Button */}
              <Grid item xs={12} md={1}>
                <IconButton color="error" onClick={() => handleRemoveExpense(index)} size="small">
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Paper>
        ))}
           <Typography variant="strong" sx={{ mt: 2, padding: 2 }} color="primary">
          Sub Total:  <Typography variant="strong" sx={{ mt: 2, padding: 2 }} color="black">
            {getSubtotal()}
          </  Typography>
        </Typography>
      </Stack>
    </Box>
  );
};

export default CustomerExpense;
