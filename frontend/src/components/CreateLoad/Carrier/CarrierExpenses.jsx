import React, { useEffect, useState } from 'react';
import {
  Box, Button, FormControlLabel, Grid, MenuItem, Paper, Stack, TextField, Typography,
  IconButton, Checkbox
} from '@mui/material';
import { IoIosAdd, IoIosTrash } from 'react-icons/io';
import apiService from '@/service/apiService';
import { useSelector } from 'react-redux';
const Expenses = ({ carrierExpenses, setCarrierExpenses, selectedCarrier, updateCarrierData, assignDrivers, dispatchRate = 0, powerunit, trailer }) => {
  const { loadDetails = {} } = useSelector((state) => state.load || {});
  const [itemServices, setItemServices] = useState([]);
  const [selectedService, setSelectedService] = useState(""); // Store selected service

  useEffect(() => {
    fetchItemServices();
  }, []);

  const fetchItemServices = async () => {
    try {
      const itemServicesResponse = await apiService.getItemServices();
      setItemServices(itemServicesResponse.data);
    } catch (err) {
      console.error('Error fetching services:', err);
    }
  };

  const handleAddExpense = () => {
    if (!selectedService) {
      alert("Please select a service before adding an expense.");
      return;
    }

    const newExpense = {
      value: '',
      service: selectedService, // Use the selected service
      positive: false,
      desc: ""
    };

    const updatedExpenses = [...carrierExpenses, newExpense];
    setCarrierExpenses(updatedExpenses);
    updateCarrierData(selectedCarrier, assignDrivers, updatedExpenses, powerunit, trailer);
    setSelectedService(""); // Reset service selection after adding expense
  };

  const handleExpenseChange = (index, field, value) => {
    const updatedExpenses = [...carrierExpenses];

    if (field === 'service') {
      updatedExpenses[index] = { ...updatedExpenses[index], service: value };
    } else if (field === 'value') {
      updatedExpenses[index] = { ...updatedExpenses[index], value };
    } else if (field === 'positive') {
      updatedExpenses[index] = { ...updatedExpenses[index], positive: value };
    } else if (field === 'desc') {
      updatedExpenses[index] = { ...updatedExpenses[index], desc: value };
    }

    setCarrierExpenses(updatedExpenses);
    updateCarrierData(selectedCarrier, assignDrivers, updatedExpenses, powerunit, trailer);
  };

  const handleRemoveExpense = (index) => {
    const updatedExpenses = carrierExpenses.filter((_, idx) => idx !== index);
    setCarrierExpenses(updatedExpenses);
    updateCarrierData(selectedCarrier, assignDrivers, updatedExpenses, powerunit, trailer);
  };

  const getSubtotal = () => {
    console.log("loadAmount ???",loadDetails)
    const loadAmount = parseFloat(loadDetails.loadAmount) || 0;
    const baseAmount = (dispatchRate / 100) * loadAmount;
    console.log("loadAmount",loadAmount)
    console.log("baseamount",baseAmount)
    console.log("dispatchRate",dispatchRate)
    const totalExpenses = carrierExpenses.reduce((sum, expense) => {
      const amount = parseFloat(expense.value) || 0;
      return expense.positive ? sum + amount : sum - amount;
    }, 0);
    return baseAmount + totalExpenses;
  };

  return (
    <Box>
      <Typography variant="h6" color="primary" mb={2}>
        Carrier Expenses
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

      {/* Expense List */}
      <Stack spacing={2} mt={2}>
        {carrierExpenses.map((expense, idx) => (
          <Paper key={idx} elevation={1} sx={{ p: 2, '&:hover': { bgcolor: 'background.default' } }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={3}>
                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Service"
                  value={expense.service || ''}
                  onChange={(e) => handleExpenseChange(idx, 'service', e.target.value)}
                >
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
                    type="number"
                    label="Value"
                    value={expense.value || ''}
                    onChange={(e) => handleExpenseChange(idx, 'value', e.target.value)}
                  />
                  <Box display="flex" alignItems="center" gap={1}>
                    <FormControlLabel
                      control={<Checkbox checked={expense.positive === true} onChange={() => handleExpenseChange(idx, 'positive', true)} />}
                      label="+"
                    />
                    <FormControlLabel
                      control={<Checkbox checked={expense.positive === false} onChange={() => handleExpenseChange(idx, 'positive', false)} />}
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
                  onChange={(e) => handleExpenseChange(idx, 'desc', e.target.value)}
                />
              </Grid>

              <Grid item xs={12} md={1}>
                <IconButton color="error" onClick={() => handleRemoveExpense(idx)} size="small">
                  <IoIosTrash />
                </IconButton>
              </Grid>
            </Grid>
          </Paper>
        ))}

        {/* Subtotal Calculation */}
        <Typography variant="strong" sx={{ mt: 2, padding: 2 }} color="primary">
          Sub Total:  
          <Typography variant="strong" sx={{ mt: 2, padding: 2 }} color="black">
            {getSubtotal()}
          </Typography>
        </Typography>
      </Stack>
    </Box>
  );
};

export default Expenses;
