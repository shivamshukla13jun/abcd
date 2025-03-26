import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IoIosAdd, IoIosTrash } from "react-icons/io";
import { v4 as uuidv4 } from "uuid";
import {
  Button,
  TextField,
  Grid,
  Typography,
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  IconButton,
  Card,
  CardContent,
  Collapse
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon } from '@mui/icons-material';
import { setcarrierIds } from "@redux/Slice/loadSlice";
import apiService from "@service/apiService";
import { initialcarrierIds } from "@redux/InitialData/Load";
import { taransformCarrierData } from "@utils/transformData";
import { toast } from "react-hot-toast";
import CarrierModal from './CarrierModal';
import DriverInfo from './DriverInfo';

const Asset = ({ index, onRemove }) => {
  const dispatch = useDispatch();
  const carrierIds = useSelector((state) => state.load.carrierIds[index]);
  const [carriers, setCarriers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCarrierModal, setShowCarrierModal] = useState(false);
  const [selectedDrivers, setSelectedDrivers] = useState([]);
  const [showAddDriverForm, setShowAddDriverForm] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);

  // Fetch carriers from API
  const fetchCarriers = async () => {
    try {
      const response = await apiService.getCarriers();
      setCarriers(response.data);
    } catch (err) {
      console.error("Error fetching carriers:", err);
    }
  };

  useEffect(() => {
    fetchCarriers();
  }, []);

  // Handle Carrier Selection
  const handleCarrierChange = async (e) => {
    const selectedCarrierId = e.target.value;
    if (selectedCarrierId && selectedCarrierId !== "") {
      try {
        const response = await apiService.getCarrier(selectedCarrierId);
        const transformedCarrierData = taransformCarrierData(response.data);
        dispatch(setcarrierIds({ index, asset: transformedCarrierData }));
        setSelectedDrivers(response.data.drivers || []);
      } catch (err) {
        toast.error("Error fetching carrier data");
      }
    } else {
      dispatch(setcarrierIds({ index, asset: initialcarrierIds }));
      setSelectedDrivers([]);
    }
  };

  // Handle Adding a New Driver
  const handleAddDriver = () => {
    setEditingDriver(null);
    setShowAddDriverForm(true);
  };
const handleCarrierSubmit = async (carrierData) => {
  try {
    const response = await apiService.createCarrier(carrierData);
    if (response.success) {
      setCarriers([...carriers, response.data]);
    }
  }
  catch (error) {
    toast.error(error.message || "Failed to create carrier");
  }
};

  const handleDriverSubmit = async (driverData) => {
    try {
      if (!carrierIds?._id) {
        toast.error("Please select a carrier first");
        return;
      }

      const driverWithUUID = { ...driverData, driverId: uuidv4() };

      // Call the separate API to add the driver
      const response = driverWithUUID?._id ? await apiService.updateDriver({
        carrierId: carrierIds._id,
        ...driverWithUUID,
      }) : await apiService.createDriver({
        carrierId: carrierIds._id,
        ...driverWithUUID,
      });
     
      if (response.success) {
        setSelectedDrivers([...selectedDrivers, driverWithUUID]);
        toast.success("Driver added successfully");
        setShowAddDriverForm(false);
      } else {
        throw new Error(response.message || "Failed to add driver");
      }
    } catch (error) {
      toast.error(error.message || "Failed to update driver information");
    }
  };

  return (
    <div className="pickup-location-container mb-4 p-3 border rounded">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6">Carrier {index + 1}</Typography>
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

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Select Carrier</InputLabel>
            <Select value={carrierIds?._id || ""} onChange={handleCarrierChange}>
              <MenuItem disabled value="">Select Carrier</MenuItem>
              <MenuItem value="" onClick={() => setShowCarrierModal(true)}>
                <IoIosAdd /> Create New Carrier
              </MenuItem>
              {carriers.map((carrier) => (
                <MenuItem key={carrier._id} value={carrier._id}>
                  {carrier.companyName} - {carrier.mcNumber}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {carrierIds?._id && (
        <Box mt={2}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Drivers</Typography>
                <Button
                  startIcon={<AddIcon />}
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={handleAddDriver}
                >
                  Add Driver
                </Button>
              </Box>

              <Grid container spacing={2}>
                {selectedDrivers.map((driver, idx) => (
                  <Grid item xs={12} key={idx}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant="subtitle1">
                            Driver {idx + 1}: {driver.driverName}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              <Collapse in={showAddDriverForm}>
                <Box mt={2} p={2} border={1} borderColor="divider" borderRadius={1}>
                  <Typography variant="h6">{editingDriver ? 'Edit Driver' : 'Add New Driver'}</Typography>
                  <DriverInfo
                    driverData={editingDriver || {}}
                    onSubmit={handleDriverSubmit}
                    onCancel={() => setShowAddDriverForm(false)}
                  />
                </Box>
              </Collapse>
            </CardContent>
          </Card>
        </Box>
      )}
      <CarrierModal
        open={showCarrierModal}
        onClose={() => setShowCarrierModal(false)}
        onSubmit={handleCarrierSubmit}
        onChange={handleCarrierChange}
      />
    </div>
  );
};

export default Asset;
