import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';
import apiService from '@/service/apiService';
import CarrierModal from './CarrierModal';
import DriversModal from './DriversModal';

const Carriers = () => {
  const [carriers, setCarriers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCarrierModal, setShowCarrierModal] = useState(false);
  const [showDriversModal, setShowDriversModal] = useState(false);
  const [selectedCarrier, setSelectedCarrier] = useState(null);

  const fetchCarriers = async () => {
    try {
      setLoading(true);
      const response = await apiService.getCarriers();
      setCarriers(response.data);
    } catch (error) {
      toast.error(error.message || 'Failed to fetch carriers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCarriers();
  }, []);

  const handleAddCarrier = () => {
    setSelectedCarrier({
      _id: null,
      companyName: '',
      mcNumber: '',
      usdot: '',
      primaryContact: '',
      contactEmail: '',
      isActive: true,
    });
    setShowCarrierModal(true);
  };

  const handleEditCarrier = (carrier) => {
    setSelectedCarrier(carrier);
    setShowCarrierModal(true);
  };

  const handleViewDrivers = (carrier) => {
    setSelectedCarrier(carrier);
    setShowDriversModal(true);
  };

  const handleDeleteCarrier = async (carrierId) => {
    if (window.confirm('Are you sure you want to delete this carrier?')) {
      try {
        await apiService.deleteCarrier(carrierId);
        toast.success('Carrier deleted successfully');
        fetchCarriers();
      } catch (error) {
        toast.error(error.message || 'Failed to delete carrier');
      }
    }
  };

  const handleCarrierChange = (event) => {
    const { name, value } = event.target;
    setSelectedCarrier(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCarrierSubmit = async () => {
    try {
      if (selectedCarrier._id) {
        await apiService.updateCarrier(selectedCarrier._id, selectedCarrier);
        toast.success('Carrier updated successfully');
      } else {
        await apiService.createCarrier(selectedCarrier);
        toast.success('Carrier created successfully');
      }
      setShowCarrierModal(false);
      fetchCarriers();
    } catch (error) {
      
      toast.error(error.message || 'Failed to save carrier');
    }
  };

  const handleDriverSubmit = async (driverData) => {
    try {
      console.log("driverData???",driverData)
      const data={carrierId:selectedCarrier._id,...driverData}
      if (driverData._id) {
        // Update existing driver
        await apiService.updateDriver(driverData._id,data );
        toast.success('Driver updated successfully');
      } else {
        // Add new driver
        await apiService.createDriver(data);
        toast.success('Driver added successfully');
      }
      fetchCarriers();
    } catch (error) {
      console.log("errrr",error)
      toast.error(error.message || 'Failed to save driver');
    }
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Carriers Management</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddCarrier}
        >
          Add New Carrier
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Company Name</TableCell>
              <TableCell>MC Number</TableCell>
              <TableCell>USDOT</TableCell>
              <TableCell>Primary Contact</TableCell>
              <TableCell>Drivers</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {carriers.map((carrier) => (
              <TableRow key={carrier._id}>
                <TableCell>{carrier.companyName}</TableCell>
                <TableCell>{carrier.mcNumber}</TableCell>
                <TableCell>{carrier.usdot}</TableCell>
                <TableCell>
                  <Typography variant="body2">{carrier.primaryContact}</Typography>
                  <Typography variant="caption" color="textSecondary">
                    {carrier.contactEmail}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Button
                    size="small"
                    onClick={() => handleViewDrivers(carrier)}
                  >
                    View Drivers ({carrier.drivers?.length || 0})
                  </Button>
                </TableCell>
                <TableCell>
                  <Chip
                    label={carrier.isActive ? 'Active' : 'Inactive'}
                    color={carrier.isActive ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => handleEditCarrier(carrier)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDeleteCarrier(carrier._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {
        selectedCarrier && <CarrierModal
        open={showCarrierModal}
        onChange={handleCarrierChange}
        onClose={() => setShowCarrierModal(false)}
        carrierData={selectedCarrier}
        onSubmit={handleCarrierSubmit}
      />
      }
      {
        selectedCarrier &&
      <DriversModal
        open={showDriversModal}
        onClose={() => setShowDriversModal(false)}
        carrier={selectedCarrier}
        onUpdate={fetchCarriers}
        onSubmit={handleDriverSubmit}
      />
      }
    </Box>
  );
};

export default Carriers; 