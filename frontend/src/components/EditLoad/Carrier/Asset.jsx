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
} from "@mui/material";
import { useCarrierModal } from "@/hooks/useCarrierModal";
import { setcarrierIds } from "@/redux/Slice/EditloadSlice";

const Asset = ({ index, onRemove }) => {
  const dispatch = useDispatch();
  const carrierData = useSelector((state) => state.editload.carrierIds[index]);

  const [carriers, setCarriers] = useState([]);
  const [assignDrivers, setAssignDrivers] = useState(carrierData?.assignDrivers || []);
  const [selectedCarrier, setSelectedCarrier] = useState(carrierData?.carrier || null);
  const [loading, setLoading] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState("");

  const { fetchCarriers } = useCarrierModal(setCarriers, setLoading);

  useEffect(() => {
    fetchCarriers(setCarriers, setLoading);
  }, []);

  const ChangeCarrier = (e) => {
    const carrierId = e.target.value;
    setSelectedCarrier(carrierId);
    setAssignDrivers([]); // Reset assigned drivers
    dispatch(setcarrierIds({ index, asset: { carrier: carrierId, assignDrivers: [] } }));
  };

  const AddDriver = () => {
    if (!selectedDriver) return;

    if (!assignDrivers.includes(selectedDriver)) {
      const updatedDrivers = [...assignDrivers, selectedDriver];
      setAssignDrivers(updatedDrivers);
      dispatch(setcarrierIds({ index, asset: { carrier: selectedCarrier, assignDrivers: updatedDrivers } }));
    }
    setSelectedDriver("");
  };

  const removeDriver = (driverId) => {
    const updatedDrivers = assignDrivers.filter((id) => id !== driverId);
    setAssignDrivers(updatedDrivers);
    dispatch(setcarrierIds({ index, asset: { carrier: selectedCarrier, assignDrivers: updatedDrivers } }));
  };

  const carrierInfo = carriers.find((c) => c._id === selectedCarrier);

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
            <Select value={selectedCarrier || ""} onChange={ChangeCarrier}>
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
              <Typography><b>Company Name:</b> {carrierInfo?.companyName || "Unknown Carrier"}</Typography>
              <Typography><b>MC Number:</b> {carrierInfo?.mcNumber || "N/A"}</Typography>

              {/* Driver Selection Dropdown */}
              <Box mt={2}>
                <FormControl fullWidth>
                  <InputLabel>Select a Driver</InputLabel>
                  <Select value={selectedDriver} onChange={(e) => setSelectedDriver(e.target.value)}>
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
            </CardContent>
          </Card>
        </Box>
      )}
    </div>
  );
};

export default Asset;

