import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {  IoIosTrash } from "react-icons/io";
import { Button, Grid, Typography, Box, Select, MenuItem, InputLabel, FormControl, Card, TextField, Stack, Paper, Divider, InputAdornment, Tooltip, CircularProgress } from "@mui/material";
import { useCarrierModal } from "@/hooks/useCarrierModal";
import { setcarrierIds } from "@/redux/Slice/EditloadSlice";
import { Percent as PercentIcon } from '@mui/icons-material';
import Expenses from "./CarrierExpenses";

const Asset = ({ index, onRemove }) => {
  const dispatch = useDispatch();
  const carrierData = useSelector((state) => state.editload.carrierIds[index]);
  const [carriers, setCarriers] = useState([]);
  const [powerunit, setPowerunit] = useState(carrierData?.powerunit || "");
  const [trailer, setTrailer] = useState(carrierData?.trailer || "");
  const [assignDrivers, setAssignDrivers] = useState(carrierData?.assignDrivers || []);
  const [selectedCarrier, setSelectedCarrier] = useState(carrierData?.carrier || null);
  const [carrierExpenses, setCarrierExpenses] = useState(carrierData?.carrierExpense || []);
  const [loading, setLoading] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState("");
  const [dispatchRate, setDispatchRate] = useState(carrierData?.dispatchRate || 0);
  const [isCalculating, setIsCalculating] = useState(false);

  const { fetchCarriers } = useCarrierModal(setCarriers, setLoading);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchCarriers(setCarriers, setLoading);
    
    } catch (err) {
        console.error('Error fetching data:', err);
      }
    };
    fetchData();
  }, []);
  const handleDispatchRateChange = (value) => {
    const newValue = Math.min(100, Math.max(0, Number(value) || 0));
    setDispatchRate(newValue);
    updateCarrierData(selectedCarrier, assignDrivers, carrierExpenses, newValue,powerunit,trailer);
  };

  const updateCarrierData = (carrier, drivers, expenses, rate, powerUnitValue=powerunit, trailerValue=trailer) => {
    dispatch(setcarrierIds({
      index,
      asset: {
        carrier,
        assignDrivers: drivers,
        carrierExpense: expenses,
        dispatchRate: rate,
        powerunit: powerUnitValue,  // Ensure correct update
        trailer: trailerValue,      // Ensure correct update
      },
    }));
  };
  

  const ChangeCarrier = (e) => {
    const carrierId = e.target.value;
    setSelectedCarrier(carrierId);
    setAssignDrivers([]);
    setCarrierExpenses([]);
    updateCarrierData(carrierId, [], [], 0,0,0);
  };
  const handlePowerUnitChange = (e) => {
    const value = e.target.value;
    setPowerunit(value);
    updateCarrierData(selectedCarrier, assignDrivers, carrierExpenses, dispatchRate, value, trailer);
  };
  
  const handleTrailerChange = (e) => {
    const value = e.target.value;
    setTrailer(value);
    updateCarrierData(selectedCarrier, assignDrivers, carrierExpenses, dispatchRate, powerunit, value);
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

  const renderDispatchRateSection = () => (
    <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default' }}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="h6" gutterBottom>
          Dispatch Rate
        </Typography>
        <Tooltip title="Percentage of the total load amount that goes to dispatch">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TextField
              size="small"
              type="number"
              value={dispatchRate}
              onChange={(e) => handleDispatchRateChange(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <PercentIcon color="primary" />
                  </InputAdornment>
                ),
                inputProps: { 
                  min: 0, 
                  max: 100,
                  step: 0.1
                }
              }}
              sx={{ width: '150px' }}
            />
            {isCalculating && (
              <CircularProgress size={20} />
            )}
          </Box>
        </Tooltip>
      </Box>
      {dispatchRate > 0 && (
        <Box mt={1}>
          <Typography variant="body2" color="text.secondary">
            Current Rate: {dispatchRate}%
          </Typography>
        </Box>
      )}
    </Paper>
  );

  return (
    <Card sx={{ mb: 2, p: 2 }}>
      <Stack spacing={3}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          {/* <Typography variant="h6" color="primary">Carrier </Typography> */}
        {/* {onRemove && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<IoIosTrash />}
            onClick={() => onRemove(index)}
              size="small"
            >
              Remove
            </Button>
          )} */}
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
                {/* add power unit */}
                <Grid item xs={12} md={4}>
                  <Typography><b>Power Unit </b></Typography>
                  {/* Text field */}
                  <TextField
                    fullWidth
                    size="small"
                    // label="Power Unit"
                    value={powerunit}
                    onChange={handlePowerUnitChange}
                  />
                  </Grid>
                  <Grid item xs={12} md={4}>
                  <Typography><b>Trailer </b></Typography>
                  {/* Text field */}
                  <TextField
                    fullWidth
                    size="small"
                    // label="Trailer"
                    value={trailer}
                    onChange={handleTrailerChange}
                  />
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
            {/* Add Dispatch Rate Section here */}
            {renderDispatchRateSection()}
            {/* Carrier Expenses Section */}
             <Expenses {...{carrierExpenses,setCarrierExpenses,selectedCarrier ,updateCarrierData,assignDrivers,dispatchRate,powerunit,trailer }} />
          </>
        )}
      </Stack>
    </Card>
  );
};

export default Asset;

