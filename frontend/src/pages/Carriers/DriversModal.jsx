import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Box,
  Divider,
  Chip
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { toast } from 'react-hot-toast';
import apiService from '@/service/apiService';
import DriverForm from './DriverForm';

const DriversModal = ({ open, onClose, carrier, onUpdate,onSubmit }) => {
  const [showDriverForm, setShowDriverForm] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAddDriver = () => {
    setSelectedDriver(null);
    setShowDriverForm(true);
  };

  const handleEditDriver = (driver) => {
    setSelectedDriver(driver);
    setShowDriverForm(true);
  };

  const handleDeleteDriver = async (driverIndex) => {
    if (window.confirm('Are you sure you want to remove this driver?')) {
      try {
        setLoading(true);
        const updatedDrivers = carrier.drivers.filter((_, idx) => idx !== driverIndex);
        await apiService.updateCarrier(carrier._id, {
          drivers: updatedDrivers
        });
        toast.success('Driver removed successfully');
        onUpdate();
      } catch (error) {
        toast.error('Failed to remove driver');
      } finally {
        setLoading(false);
      }
    }
  };


  const handleClose = () => {
    setShowDriverForm(false);
    setSelectedDriver(null);
    onClose();
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            Manage Drivers - {carrier?.companyName}
          </Typography>
          {!showDriverForm && (
            <Button
              startIcon={<AddIcon />}
              variant="contained"
              color="primary"
              onClick={handleAddDriver}
              disabled={loading}
            >
              Add Driver
            </Button>
          )}
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        {showDriverForm ? (
          <DriverForm
            driver={selectedDriver}
            onSubmit={onSubmit}
            onCancel={() => {
              setShowDriverForm(false);
              setSelectedDriver(null);
            }}
            loading={loading}
          />
        ) : (
          <List>
            {carrier?.drivers?.map((driver, index) => (
              <React.Fragment key={index}>
                <ListItem
                  alignItems="flex-start"
                  secondaryAction={
                    <Box>
                      <IconButton
                        edge="end"
                        onClick={() => handleEditDriver({ ...driver, index })}
                        disabled={loading}
                        color="primary"
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        edge="end"
                        onClick={() => handleDeleteDriver(index)}
                        disabled={loading}
                        color="error"
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  }
                >
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="subtitle1">
                          {driver.driverName}
                        </Typography>
                        <Chip
                          label={driver.isActive ? 'Active' : 'Inactive'}
                          color={driver.isActive ? 'success' : 'default'}
                          size="small"
                        />
                      </Box>
                    }
                    secondary={
                      <Box sx={{ mt: 1 }}>
                        <Typography component="div" variant="body2" color="text.secondary">
                          Phone: {driver.driverPhone}
                        </Typography>
                        <Typography component="div" variant="body2" color="text.secondary">
                          CDL: {driver.driverCDL}
                        </Typography>
                        <Typography component="div" variant="body2" color="text.secondary">
                          CDL Expiration: {formatDate(driver.driverCDLExpiration)}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            ))}
            {(!carrier?.drivers || carrier.drivers.length === 0) && (
              <ListItem>
                <ListItemText
                  primary={
                    <Typography color="text.secondary" align="center">
                      No drivers added yet
                    </Typography>
                  }
                  secondary={
                    <Typography color="text.secondary" align="center" variant="body2">
                      Click the Add Driver button to add drivers
                    </Typography>
                  }
                />
              </ListItem>
            )}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={handleClose}
          disabled={loading}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DriversModal; 