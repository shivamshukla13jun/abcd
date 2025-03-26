import apiService from './apiService';
import { toast } from 'react-toastify';

export const fetchCarriers = async (setCarriers, setLoading) => {
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

export const deleteCarrier = async (carrierId, fetchCarriers) => {
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

export const saveCarrier = async (carrier, fetchCarriers, setShowCarrierModal) => {
  try {
    if (carrier._id) {
      await apiService.updateCarrier(carrier._id, carrier);
      toast.success('Carrier updated successfully');
    } else {
      await apiService.createCarrier(carrier);
      toast.success('Carrier created successfully');
    }
    setShowCarrierModal(false);
    fetchCarriers();
  } catch (error) {
    toast.error(error.message || 'Failed to save carrier');
  }
};

export const saveDriver = async (driverData, carrierId, fetchCarriers) => {
  try {
    const data = { carrierId, ...driverData };
    if (driverData._id) {
      await apiService.updateDriver(driverData._id, data);
      toast.success('Driver updated successfully');
    } else {
      await apiService.createDriver(data);
      toast.success('Driver added successfully');
    }
    fetchCarriers();
  } catch (error) {
    toast.error(error.message || 'Failed to save driver');
  }
};
