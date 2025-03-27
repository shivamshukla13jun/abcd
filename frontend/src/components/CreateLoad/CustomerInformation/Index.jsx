import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCustomerInformation, toggleCustomerVisibility, setCustomerExpense } from '@redux/Slice/loadSlice';
import apiService from '@service/apiService';
import AddCustomer from '@/components/Customers/AddCustomer';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  TextField,
  MenuItem,
  Button,
  IconButton,
  Radio,
  RadioGroup,
  FormControlLabel,
  Paper,
  Stack,
  Divider,
  Checkbox
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Numbers as NumbersIcon
} from '@mui/icons-material';
import { getServiceType } from '@/utils/getServicetype';

const CustomerInformation = () => {
  const dispatch = useDispatch();
  const { customerInformation = {}, customerExpense = [] } = useSelector((state) => state.load || {});
  const [customers, setCustomers] = useState([]);
  const [itemServices, setItemServices] = useState([]);
  const [showCustomerForm, setShowCustomerForm] = useState(false);

  // Fetch Customers and Item Services
  const fetchData = async () => {
    try {
      const [customersResponse, itemServicesResponse] = await Promise.all([
        apiService.getCustomers(),
        apiService.getItemServices()
      ]);
      setCustomers(customersResponse.data);
      setItemServices(itemServicesResponse.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };
 
  useEffect(() => {
    fetchData();
  }, []);

  const handleCustomerChange = async (e) => {
    const selectedCustomerId = e.target.value;
    
    if (selectedCustomerId && selectedCustomerId !== '') {
      try {
        const response = await apiService.getCustomer(selectedCustomerId);
        dispatch(setCustomerInformation(response.data));
        dispatch(toggleCustomerVisibility(true));
      } catch (err) {
        console.error('Error fetching customer data:', err);
      }
    } else if (selectedCustomerId === '') {
      setShowCustomerForm(true);
    }
  };

  const handleAddExpense = () => {
    const newExpense = {
      customerId: customerInformation._id,
      value: '',
      service:null,
      positive:false,
      desc:""

    };
    dispatch(setCustomerExpense([...customerExpense, newExpense]));
  };

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
  if(field === 'positive'){
    updatedExpenses[index] = {
      ...updatedExpenses[index],
      positive: value
    };
  }
  if(field=="desc"){
    updatedExpenses[index] = {
      ...updatedExpenses[index],
      desc: value
    };
  }

  dispatch(setCustomerExpense(updatedExpenses));
};
const handleRemoveExpense = (index) => {
    const updatedExpenses = customerExpense.filter((_, idx) => idx !== index);
    dispatch(setCustomerExpense(updatedExpenses));
  };

  const customerFields = [
    { icon: <BusinessIcon />, label: "Company Name", name: "company" },
    { icon: <PersonIcon />, label: "Contact Name", name: "customerName" },
    { icon: <EmailIcon />, label: "Contact Email", name: "email" },
    { icon: <PhoneIcon />, label: "Contact Phone", name: "phone" },
    { icon: <LocationIcon />, label: "Address", name: "address", multiline: true },
    { icon: <NumbersIcon />, label: "MC Number", name: "mcNumber" },
    { icon: <NumbersIcon />, label: "USDOT Number", name: "usdot" },
    { icon: <NumbersIcon />, label: "UTR Number", name: "utrNumber" }
  ];

  return (
    <Box sx={{ p: 2 }}>
      <Card elevation={3}>
        <CardContent>
          <Stack spacing={3}>
            {/* Customer Selection */}
            <Box>
              <Typography variant="h6" gutterBottom color="primary">
                Customer Information
              </Typography>
              <TextField
                select
                fullWidth
                label="Select Customer"
                value={customerInformation._id || ""}
                onChange={handleCustomerChange}
                variant="outlined"
                size="small"
              >
                <MenuItem value="">
                  <em>Create New Customer</em>
                </MenuItem>
            {customers.map((customer) => (
                  <MenuItem key={customer._id} value={customer._id}>
                {customer.customerName}
                  </MenuItem>
            ))}
              </TextField>
            </Box>

      {/* Customer Details */}
            {customerInformation._id && (
              <>
                <Grid container spacing={2}>
                  {customerFields.map(({ icon, label, name, multiline }) => (
                    <Grid item xs={12} md={multiline ? 6 : 3} key={name}>
                      <Paper 
                        elevation={0} 
                        sx={{ 
                          p: 2, 
                          bgcolor: 'background.default',
                          height: '100%'
                        }}
                      >
                        <Stack spacing={1}>
                          <Box display="flex" alignItems="center" gap={1}>
                            {icon}
                            <Typography variant="caption" color="textSecondary">
                              {label}
                            </Typography>
                          </Box>
                          <TextField
                            fullWidth
                            size="small"
                            value={customerInformation[name] || ""}
                            InputProps={{ readOnly: true }}
                            multiline={multiline}
                            rows={multiline ? 3 : 1}
                            variant="outlined"
                          />
                        </Stack>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>

                {/* Customer Expenses */}
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
                              type={getServiceType(expense.service,itemServices) === "number" ? "number" : "text"} 
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
                  </Stack>
                </Box>
              </>
            )}
          </Stack>
        </CardContent>
      </Card>

      {showCustomerForm && (
        <AddCustomer
          open={showCustomerForm}
          onClose={() => setShowCustomerForm(false)}
          onSuccess={() => {
            setShowCustomerForm(false);
            fetchData();
          }}
        />
      )}
    </Box>
  );
};

export default CustomerInformation;