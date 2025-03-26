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

import CarrierModal from './CarrierModal';
import DriversModal from './DriversModal';
import { useCarrierModal } from '@/hooks/useCarrierModal';
const Carriers = () => {
  const [carriers, setCarriers] = useState([]);
  const [loading, setLoading] = useState(false);

  const {
    showCarrierModal,
    setShowCarrierModal,
    showDriversModal,
    setShowDriversModal,
    selectedCarrier,
    setSelectedCarrier,
    handleAddCarrier,fetchCarriers,
    handleEditCarrier,handleDeleteCarrier,
    handleViewDrivers,handleCarrierChange,handleCarrierSubmit,handleDriverSubmit
  } = useCarrierModal(setCarriers,setLoading);

  useEffect(() => {
    fetchCarriers(setCarriers, setLoading);
  }, []);


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