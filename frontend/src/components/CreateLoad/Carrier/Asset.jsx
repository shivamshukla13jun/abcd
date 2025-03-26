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
} from '@mui/material';
import { useCarrierModal } from "@/hooks/useCarrierModal";
import { setcarrierIds } from "@/redux/Slice/loadSlice";

const Asset = ({ index, onRemove }) => {
  const dispatch = useDispatch();
  const carrierData = useSelector((state) => state.load.carrierIds[index]);
  const [carriers, setCarriers] = useState([]);
  const [assignDrivers, setAssignDrivers] = useState(carrierData?.assignDrivers || []);
  const [selectedCarrier, setSelectedCarrier] = useState(carrierData?.carrier || null);
  const [loading, setLoading] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(""); // Track selected driver

  const { fetchCarriers } = useCarrierModal(setCarriers, setLoading);

  useEffect(() => {
    fetchCarriers(setCarriers, setLoading);
  }, []);

  const ChangeCarrier = (e) => {
    const carrierId = e.target.value;
    if (!carrierId) {
      setSelectedCarrier(null);
      setAssignDrivers([]);
    } else {
      const carrier = carriers.find((item) => item._id === carrierId);
      setSelectedCarrier(carrier);
      setAssignDrivers([]); // Reset assigned drivers
      dispatch(setcarrierIds({ index, asset: { carrier, assignDrivers: [] } }));
    }
  };

  const AddDriver = () => {
    if (!selectedDriver) return; // Prevent adding empty driver

    const driver = selectedCarrier?.drivers?.find((d) => d._id === selectedDriver);
    if (driver && !assignDrivers.some((d) => d._id === driver._id)) {
      const updatedDrivers = [...assignDrivers, driver];
      setAssignDrivers(updatedDrivers);
      dispatch(setcarrierIds({ index, asset: { carrier: selectedCarrier, assignDrivers: updatedDrivers } }));
    }
    setSelectedDriver(""); // Reset selection
  };

  const removeDriver = (driverId) => {
    const updatedDrivers = assignDrivers.filter((driver) => driver._id !== driverId);
    setAssignDrivers(updatedDrivers);
    dispatch(setcarrierIds({ index, asset: { carrier: selectedCarrier, assignDrivers: updatedDrivers } }));
  };

  return (
    <div className="pickup-location-container mb-4 p-3 border rounded">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6">Carrier {index + 1}</Typography>
        {onRemove && (
          <Button variant="outlined" color="error" startIcon={<IoIosTrash />} onClick={() => onRemove(index)} size="small">
            Remove
          </Button>
        )}
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Select Carrier</InputLabel>
            <Select value={selectedCarrier?._id || ""} onChange={ChangeCarrier}>
              <MenuItem disabled value="">Select Carrier</MenuItem>
              {carriers.map((carrier) => (
                <MenuItem key={carrier._id} value={carrier._id}>
                  {carrier.companyName} - {carrier.mcNumber}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Carrier Details & Drivers Section */}
      {selectedCarrier && (
        <Box mt={2}>
          <Card>
            <CardContent>
              <Typography variant="h6">Carrier Details</Typography>
              <Typography><b>Company Name:</b> {selectedCarrier.companyName}</Typography>
              <Typography><b>MC Number:</b> {selectedCarrier.mcNumber}</Typography>

              {/* Driver Selection Dropdown */}
              <Box mt={2}>
                {/* <Typography variant="h6">Assign Drivers</Typography> */}
                <FormControl fullWidth>
  <InputLabel>Select a Driver</InputLabel>
  <Select value={selectedDriver} onChange={(e) => setSelectedDriver(e.target.value)}>
    <MenuItem disabled value="">Select a Driver</MenuItem>
    {selectedCarrier.drivers
      ?.filter(driver => !assignDrivers.some(d => d._id === driver._id)) // ✅ Filter already assigned drivers
      .map((driver) => (
        <MenuItem key={driver._id} value={driver._id}>
          {driver.driverName}
        </MenuItem>
      ))}
  </Select>
</FormControl>

                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<IoIosAdd />}
                  onClick={AddDriver}
                  sx={{ mt: 1 }}
                >
                  Assign Driver
                </Button>
              </Box>

              {/* Assigned Drivers List */}
              <Box mt={2}>
                <Typography variant="h6">Assigned Drivers</Typography>
                {assignDrivers.length > 0 ? (
                  assignDrivers.map((driver, idx) => (
                    <Card variant="outlined" key={idx} sx={{ mt: 1, p: 1, display: "flex", justifyContent: "space-between" }}>
                      <Box>
                        <Typography><b>Driver {idx + 1}:</b> {driver.driverName}</Typography>
                      </Box>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={<IoIosTrash />}
                        onClick={() => removeDriver(driver._id)}
                      >
                        Remove
                      </Button>
                    </Card>
                  ))
                ) : (
                  <Typography>No drivers assigned</Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}
    </div>
  );
};

export default Asset;
