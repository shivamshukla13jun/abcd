import React from 'react';
import {
  Grid,
  Typography,
  IconButton,
  Button,
  Box
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import DriverInfo from './DriverInfo';

const DriverList = ({ 
  drivers, 
  onDriverAdd, 
  onDriverRemove, 
  onDriverChange 
}) => {
  return (
    <Box sx={{ mt: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Drivers</Typography>
        <Button
          startIcon={<AddIcon />}
          onClick={onDriverAdd}
          variant="outlined"
          size="small"
        >
          Add Driver
        </Button>
      </Box>

      {drivers.map((driver, index) => (
        <Box key={index} sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="subtitle1">Driver {index + 1}</Typography>
            <IconButton 
              size="small" 
              color="error" 
              onClick={() => onDriverRemove(index)}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
          
          <DriverInfo
            driverData={driver}
            onChange={(field, value) => onDriverChange(index, field, value)}
          />
        </Box>
      ))}
    </Box>
  );
};

export default DriverList; 