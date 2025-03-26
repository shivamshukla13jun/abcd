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
import CarrierModal from '../../../pages/Carriers/CarrierModal';
import DriverInfo from './DriverInfo';
import { useCarrierModal } from "@/hooks/useCarrierModal";

const Asset = ({ index, onRemove }) => {
  const dispatch = useDispatch();
  const carrierIds = useSelector((state) => state.load.carrierIds[index]);
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
const ChangeCarrier=(e)=>{
 try {
  if(!e.target.value){
    handleAddCarrier()
  }
  if(e.target.value){
    let data=JSON.parse(e.target.value)
    handleEditCarrier(data)
  }
  console.log("events",e.target.value)
 } catch (error) {
    setSelectedCarrier(null)
 }

}
  
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
            <Select value={carrierIds?._id || ""} onChange={ChangeCarrier}>
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
       {
        selectedCarrier && <CarrierModal
        open={showCarrierModal}
        onChange={handleCarrierChange}
        onClose={() => setShowCarrierModal(false)}
        carrierData={selectedCarrier}
        onSubmit={handleCarrierSubmit}
      />
      }
      
    </div>
  );
};

export default Asset;
