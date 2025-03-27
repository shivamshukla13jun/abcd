import React, { useEffect, useState } from 'react'
import {
  Box, Grid, MenuItem, Paper, Stack, TextField, Typography, Button,
  IconButton,
  Radio,
  RadioGroup,
  FormControlLabel,
  Divider,
  Checkbox
} from '@mui/material'
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux';
import { setCustomerExpense } from '@/redux/Slice/loadSlice';
import { getServiceType } from '@/utils/getServicetype';
import apiService from '@/service/apiService';
const CustomerExpense = () => {
  const dispatch = useDispatch();
  const { customerInformation = {}, customerExpense = [],loadDetails={} } = useSelector((state) => state.load || {});
  const [itemServices, setItemServices] = useState([]);
  // Fetch item services 
  useEffect(() => {
    fetchItemServices();
  }, []);
  const getSubtotal = () => {
    const baseAmount =  0; // Ensure valid number
    // const baseAmount = parseFloat(loadDetails.loadAmount) || 0; // Ensure valid number
    const totalExpenses = customerExpense
      .filter(expense => !isNaN(parseFloat(expense.value))) // Only valid numbers
      .reduce((sum, expense) => {
        const amount = parseFloat(expense.value);
        return expense.positive ? sum + amount : sum - amount;
      }, 0);
  
    return baseAmount + totalExpenses; // Adjust subtotal based on load amount
  };
  
  // Fetch item services from the API
  const fetchItemServices = async () => {
    try {
      const itemServicesResponse = await apiService.getItemServices();
      console.log("itemServicesResponse", itemServicesResponse)
      setItemServices(itemServicesResponse.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };
  // Add a new expense
  const handleAddExpense = () => {
    const newExpense = {
      customerId: customerInformation._id,
      value: '',
      service: null,
      positive: false,
      desc: ""

    };
    dispatch(setCustomerExpense([...customerExpense, newExpense]));
  };
  // Handle expense change
  const handleExpenseChange = (index, field, value) => {
    const updatedExpenses = [...customerExpense];

    if (field === 'service') {
      // Find the selected service and get its input type
      const selectedService = itemServices.find(service => service._id === value);
      if (selectedService) {
        updatedExpenses[index] = {
          ...updatedExpenses[index],
          customerId: customerInformation._id,
          service: selectedService._id, // Store service ID
        };
      }
    }
    if (!updatedExpenses[index].service) {
      alert("Please select a service first.");
      return;
    }
    if (field === 'value') {
      updatedExpenses[index] = {
        ...updatedExpenses[index],
        value: value
      };
    }
    if (field === 'positive') {
      updatedExpenses[index] = {
        ...updatedExpenses[index],
        positive: value
      };
    }
    if (field == "desc") {
      updatedExpenses[index] = {
        ...updatedExpenses[index],
        desc: value
      };
    }

    dispatch(setCustomerExpense(updatedExpenses));
  };
  // Remove an expense
  const handleRemoveExpense = (index) => {
    const updatedExpenses = customerExpense.filter((_, idx) => idx !== index);
    dispatch(setCustomerExpense(updatedExpenses));
  };
  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6" color="primary">
          Customer Expenses
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddExpense}
          size="small"
        >
          Add Expense
        </Button>
      </Box>

      <Stack spacing={2}>
        {customerExpense.map((expense, index) => (
          <Paper
            key={index}
            elevation={1}
            sx={{
              p: 2,
              '&:hover': {
                bgcolor: 'background.default'
              }
            }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={3}>
                <TextField
                  select
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
                </TextField>
              </Grid>

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
         <Typography variant="strong" sx={{ mt: 2, padding: 2 }} color="primary">
          Sub Total:  <Typography variant="strong" sx={{ mt: 2, padding: 2 }} color="black">
            {getSubtotal()}
          </  Typography> 
      </Typography>
      
      </Stack>
    </Box>
  )
}

export default CustomerExpense