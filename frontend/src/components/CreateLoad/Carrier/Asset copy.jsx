import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IoIosAdd, IoIosTrash } from "react-icons/io";
import {
  Button,
  Grid,
  Typography,
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Card,
  CardContent,
  TextField,
  Stack,
  Paper,
  IconButton,
  FormControlLabel,
  Checkbox,
  Divider
} from "@mui/material";
import { useCarrierModal } from "@/hooks/useCarrierModal";
import { setcarrierIds } from "@/redux/Slice/loadSlice";
import { getServiceType } from '@/utils/getServicetype';
import apiService from "@/service/apiService";

const Asset = ({ index, onRemove }) => {
  const dispatch = useDispatch();
  const carrierData = useSelector((state) => state.load.carrierIds[index]);

  const [carriers, setCarriers] = useState([]);
  const [itemServices, setItemServices] = useState([]);
  const [assignDrivers, setAssignDrivers] = useState(carrierData?.assignDrivers || []);
  const [selectedCarrier, setSelectedCarrier] = useState(carrierData?.carrier || null);
  const [carrierExpenses, setCarrierExpenses] = useState(carrierData?.carrierExpense || []);
  const [loading, setLoading] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState("");

  const { fetchCarriers } = useCarrierModal(setCarriers, setLoading);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchCarriers(setCarriers, setLoading);
        const itemServicesResponse = await apiService.getItemServices();
        console.log("itemServicesResponse",itemServicesResponse)
        setItemServices(itemServicesResponse.data);
    } catch (err) {
        console.error('Error fetching data:', err);
      }
    };
    fetchData();
  }, []);
 console.log("itemServices",itemServices)
  const handleAddExpense = () => {
    const newExpense = {
      value: '',
      service: null,
      positive: false,
      desc: ""
    };
    const updatedExpenses = [...carrierExpenses, newExpense];
    setCarrierExpenses(updatedExpenses);
    updateCarrierData(selectedCarrier, assignDrivers, updatedExpenses);
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
    updateCarrierData(selectedCarrier, assignDrivers, updatedExpenses);
  };

  const handleRemoveExpense = (index) => {
    const updatedExpenses = carrierExpenses.filter((_, idx) => idx !== index);
    setCarrierExpenses(updatedExpenses);
    updateCarrierData(selectedCarrier, assignDrivers, updatedExpenses);
  };

  const updateCarrierData = (carrier, drivers, expenses) => {
    dispatch(setcarrierIds({
      index,
      asset: {
        carrier,
        assignDrivers: drivers,
        carrierExpense: expenses
      }
    }));
  };

  const ChangeCarrier = (e) => {
    const carrierId = e.target.value;
    setSelectedCarrier(carrierId);
    setAssignDrivers([]);
    setCarrierExpenses([]);
    updateCarrierData(carrierId, [], []);
  };

  const AddDriver = (e) => {
    let value=e.target.value
    if (!value) return;
    if (!assignDrivers.includes(value)) {
      const updatedDrivers = [...assignDrivers, value];
      setAssignDrivers(updatedDrivers);
      dispatch(setcarrierIds({ index, asset: { carrier: selectedCarrier, assignDrivers: updatedDrivers } }));
    }
  };

  const removeDriver = (driverId) => {
    const updatedDrivers = assignDrivers.filter((id) => id !== driverId);
    setAssignDrivers(updatedDrivers);
    dispatch(setcarrierIds({ index, asset: { carrier: selectedCarrier, assignDrivers: updatedDrivers } }));
  };

  const carrierInfo = carriers.find((c) => c._id === selectedCarrier);

  return (
    <Card sx={{ mb: 2, p: 2 }}>
      <Stack spacing={3}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" color="primary">Carrier {index + 1}</Typography>
        {onRemove && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<IoIosTrash />}
            onClick={() => onRemove(index)}
              size="small"
            >
              Remove
            </Button>
          )}
        </Box>

        {/* Carrier Selection */}
        <FormControl fullWidth>
          <InputLabel>Select Carrier</InputLabel>
          <Select value={selectedCarrier || ""} onChange={ChangeCarrier} size="small">
            <MenuItem disabled value="">Select Carrier</MenuItem>
            {carriers.map((carrier) => (
              <MenuItem key={carrier._id} value={carrier._id}>
                {carrier.companyName} - {carrier.mcNumber}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {selectedCarrier && (
          <>
            {/* Carrier Details Section */}
            <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default' }}>
              <Typography variant="h6" gutterBottom>Carrier Details</Typography>
              <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                  <Typography><b>Company Name:</b> {carrierInfo?.companyName}</Typography>
                </Grid>
              <Grid item xs={12} md={4}>
                  <Typography><b>MC Number:</b> {carrierInfo?.mcNumber}</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography><b>USDOT Number:</b> {carrierInfo?.usdot}</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography><b>Address:</b> {carrierInfo?.address}</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography><b>Primary Contact:</b> {carrierInfo?.primaryContact}</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography><b>Contact Email:</b> {carrierInfo?.contactEmail}</Typography>
                </Grid>
                
              </Grid>
            </Paper>
            {/* Add matetial ui divider */}
            <Divider sx={{ mt: 2, mb: 2  }}  />
            
            {/* Driver Assignment Section */}
            <Box mt={2}>
              <FormControl fullWidth>
                <InputLabel>Select a Driver</InputLabel>
                <Select value={selectedDriver} onChange={AddDriver}>
                  <MenuItem disabled value="">Select a Driver</MenuItem>
                  {carrierInfo?.drivers
                    ?.filter((driver) => !assignDrivers.includes(driver._id)) // Prevent duplicate selection
                    .map((driver) => (
                      <MenuItem key={driver._id} value={driver._id}>
                        {driver.driverName}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>

             
            </Box>

            {/* Assigned Drivers List */}
            <Box mt={2}>
              <Typography variant="h6">Assigned Drivers</Typography>
              {assignDrivers.length > 0 ? (
                assignDrivers.map((driverId, idx) => {
                  const driver = carrierInfo?.drivers?.find((d) => d._id === driverId);
                  return (
                    <Card variant="outlined" key={idx} sx={{ mt: 1, p: 1, display: "flex", justifyContent: "space-between" }}>
                      <Box>
                        <Typography><b>Driver {idx + 1}:</b> {driver?.driverName || "Unknown Driver"}</Typography>
                      </Box>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={<IoIosTrash />}
                        onClick={() => removeDriver(driverId)}
                      >
                        Remove
                      </Button>
                    </Card>
                  );
                })
              ) : (
                <Typography>No drivers assigned</Typography>
              )}
            </Box>

            {/* Carrier Expenses Section */}
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
              </Stack>
            </Box>
          </>
        )}
      </Stack>
    </Card>
  );
};

export default Asset;

