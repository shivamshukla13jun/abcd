import React, { useEffect, useState } from 'react'
import {
  Box, Button, FormControlLabel, Grid, MenuItem, Paper, Stack, TextField, Typography, CardContent,
  IconButton,

  Checkbox,
} from '@mui/material'
import { IoIosAdd, IoIosTrash } from 'react-icons/io'
import apiService from '@/service/apiService';
import { getServiceType } from '@/utils/getServicetype';
import { useSelector } from 'react-redux';

const Expenses = ({ carrierExpenses, setCarrierExpenses, selectedCarrier, updateCarrierData, assignDrivers,dispatchRate=0,powerunit,trailer }) => {
  const { loadDetails = {} } = useSelector((state) => state.load || {});

  const [itemServices, setItemServices] = useState([]);
  useEffect(() => {
    fetchItemServices();
  }, []);

  const fetchItemServices = async () => {
    try {
      const itemServicesResponse = await apiService.getItemServices();
      console.log("itemServicesResponse", itemServicesResponse)
      setItemServices(itemServicesResponse.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const handleAddExpense = () => {
    const newExpense = {
      value: '',
      service: null,
      positive: false,
      desc: ""
    };
    const updatedExpenses = [...carrierExpenses, newExpense];
    setCarrierExpenses(updatedExpenses);
    updateCarrierData(selectedCarrier, assignDrivers, updatedExpenses,powerunit,trailer);
  };

  const handleExpenseChange = (index, field, value) => {
    const updatedExpenses = [...carrierExpenses];

    if (field === 'service') {
      const selectedService = itemServices.find(service => service._id === value);
      if (selectedService) {
        updatedExpenses[index] = {
          ...updatedExpenses[index],
          service: selectedService._id,
        };
      }
    } else if (field === 'value') {
      updatedExpenses[index] = {
        ...updatedExpenses[index],
        value: value
      };
    } else if (field === 'positive') {
      updatedExpenses[index] = {
        ...updatedExpenses[index],
        positive: value
      };
    } else if (field === 'desc') {
      updatedExpenses[index] = {
        ...updatedExpenses[index],
        desc: value
      };
    }

    setCarrierExpenses(updatedExpenses);
    updateCarrierData(selectedCarrier, assignDrivers, updatedExpenses,powerunit,trailer);
  };

  const handleRemoveExpense = (index) => {
    const updatedExpenses = carrierExpenses.filter((_, idx) => idx !== index);
    setCarrierExpenses(updatedExpenses);
    updateCarrierData(selectedCarrier, assignDrivers, updatedExpenses,powerunit,trailer);
  };
  const getSubtotal = () => {
    console.log("dispatchRate", dispatchRate)
    console.log("loadAmount", loadDetails.loadAmount)
   const LoadAmount = parseFloat(loadDetails.loadAmount) || 0; // Ensure valid number
   const baseAmount=(dispatchRate/100)*LoadAmount
    const totalExpenses = carrierExpenses
      .filter(expense => !isNaN(parseFloat(expense.value))) // Only valid numbers
      .reduce((sum, expense) => {
        const amount = parseFloat(expense.value);
        return expense.positive ? sum + amount : sum - amount;
      }, 0);
    console.log("baseAmount", baseAmount)
    console.log("totalExpenses", totalExpenses)
    return baseAmount + totalExpenses; // Adjust subtotal based on load amount
  };
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" color="primary">
          Carrier Expenses
        </Typography>
        <Button
          variant="contained"
          startIcon={<IoIosAdd />}
          onClick={handleAddExpense}
          size="small"
        >
          Add Expense
        </Button>
      </Box>

      <Stack spacing={2}>
        {carrierExpenses.map((expense, idx) => (
          <Paper
            key={idx}
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
                  onChange={(e) => handleExpenseChange(idx, 'service', e.target.value)}
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
                    onChange={(e) => handleExpenseChange(idx, 'value', e.target.value)}
                  />
                  <Box display="flex" alignItems="center" gap={1}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={expense.positive === true}
                          onChange={() => handleExpenseChange(idx, 'positive', true)}
                        />
                      }
                      label="+"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={expense.positive === false}
                          onChange={() => handleExpenseChange(idx, 'positive', false)}
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
                  onChange={(e) => handleExpenseChange(idx, 'desc', e.target.value)}
                />
              </Grid>

              <Grid item xs={12} md={1}>
                <IconButton
                  color="error"
                  onClick={() => handleRemoveExpense(idx)}
                  size="small"
                >
                  <IoIosTrash />
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

export default Expenses