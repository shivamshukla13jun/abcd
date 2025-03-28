import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCustomerInformation, toggleCustomerVisibility, setCustomerExpense, setCustomerRate } from '@redux/Slice/EditloadSlice';
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

  Paper,
  Stack,
 
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
import CustomerExpense from './customerExpense';

const CustomerInformation = () => {
  const dispatch = useDispatch();
  const { customerInformation = {},customerRate=0 } = useSelector((state) => state.editload || {});
  const [customers, setCustomers] = useState([]);
  const [showCustomerForm, setShowCustomerForm] = useState(false);

  // Fetch Customers and Item Services
  const fetchData = async () => {
    try {
      const [customersResponse] = await Promise.all([
        apiService.getCustomers(),
      ]);
      setCustomers(customersResponse.data);
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
                  {/* customer rate field add changeable  */}
                  <Grid item xs={12} md={3}>
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
                          <NumbersIcon />
                          <Typography variant="caption" color="textSecondary">
                            Rate
                          </Typography>
                        </Box>
                        <TextField
                          fullWidth
                          size="small"
                          value={customerRate || 0}
                          onChange={(e) => dispatch(setCustomerRate(e.target.value))}
                          // InputProps={{ readOnly: true }}
                          variant="outlined"
                        />
                      </Stack>
                    </Paper>
                    </Grid>
                </Grid>

                {/* Customer Expenses */}
                <CustomerExpense />
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