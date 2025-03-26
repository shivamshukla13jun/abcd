import apiService from '@/service/apiService';
import { useState } from 'react';
import toast from 'react-hot-toast';

export const useCarrierModal = (setCarriers,setLoading) => {
    const [showCarrierModal, setShowCarrierModal] = useState(false);
    const [showDriversModal, setShowDriversModal] = useState(false);
    const [selectedCarrier, setSelectedCarrier] = useState(null);
  
    const fetchCarriers = async (setCarriers,setLoading) => {
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
        fetchCarriers(setCarriers,setLoading);
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
        fetchCarriers(setCarriers,setLoading);
      } catch (error) {
        console.log("errrr",error)
        toast.error(error.message || 'Failed to save driver');
      }
    };
  return {
    showCarrierModal,
    setShowCarrierModal,
    showDriversModal,
    setShowDriversModal,
    selectedCarrier,
    setSelectedCarrier,
    handleAddCarrier,fetchCarriers,
    handleEditCarrier,handleDeleteCarrier,
    handleViewDrivers,handleCarrierChange,handleCarrierSubmit,handleDriverSubmit
  };
};
