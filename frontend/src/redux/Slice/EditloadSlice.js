import { initalLoadData } from "@redux/InitialData/Load";
import { createSlice } from "@reduxjs/toolkit";

const initialState = initalLoadData

const loadSlice = createSlice({
  name: "editload",
  initialState,
  reducers: {
     // Document upload actions
     setFiles: (state, action) => {
      state.files = action.payload;
    },
    addFile: (state, action) => {
      state.files.push(action.payload);
    },
    removeFile: (state, action) => {
      // check removed file has a originalname
      const fileToRemove = state.files[action.payload];
      if (fileToRemove.originalname) {
        // Get current deletedfiles array or initialize empty array
        const currentDeletedFiles = state.deletedfiles || [];
        // Add the originalname to deletedfiles array
        state.deletedfiles = [...currentDeletedFiles, fileToRemove.filename];
      }
      state.files = state.files.filter((_, index) => index !== action.payload);
    },
    setItems: (state, action) => {
      state.items = action.payload;
    },
    addItem: (state, action) => {
      state.items.push(action.payload);
    },
    setFreightCharge: (state, action) => {
      state.freightCharge = action.payload;
    },
    setLoadDetails: (state, action) => {
      state.loadDetails = action.payload;
    },
    setCustomerInformation: (state, action) => {
      state.customerInformation = action.payload;
    },
    setcarrierIds: (state, action) => {
      const { index, asset } = action.payload;
      state.carrierIds.splice(index, 1, asset); // Replace the item at `index` with `asset`
    },
    setDeliveryInfo: (state, action) => {
      state.deliveryInfo = action.payload;
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    toggleCustomerVisibility: (state) => {
      state.showCustomer = !state.showCustomer;
    },
    setCustomerVisibility: (state, { payload }) => {
      state.showCustomer = payload;
    },
    togglecarrierIdsVisibility: (state) => {
      state.showAsset = !state.showAsset;
    },
    setcarrierIdsVisibility: (state, { payload }) => {
      state.showAsset = payload;
    },
    setDriverInfo: (state, action) => {
      const { index, driverInfo } = action.payload;
      state.carrierIds[index].driverInfo = driverInfo;
    },
    toggleDriverInfoVisibility: (state) => {
      state.showDriver = !state.showDriver;
    },
    setDriverInfoVisibility: (state, { payload }) => {
      state.showDriver = payload;
    },
    // Updated for multiple pickup locations
    setPickupInfo: (state, action) => {
      const { index, pickup } = action.payload;
      state.pickupLocations[index] = pickup;
    },
    addPickupLocation: (state, action) => {
      state.pickupLocations.push(initialState.pickupLocations[0]);
    },
    removePickupLocation: (state, action) => {
      state.pickupLocations = state.pickupLocations.filter((_, index) => index !== action.payload);
    },
    updatePickupLocation: (state, action) => {
      state.pickupLocations[action.payload.index] = action.payload;
    },
    // update for multiple delivery location
    updateDeliveryLocation: (state, action) => {
      state.deliveryLocations[action.payload.index] = action.payload;
    },
    addDeliveryLocation: (state, action) => {
      state.deliveryLocations.push(initialState.deliveryLocations[0]);
    },
    removeDeliveryLocation: (state, action) => {
      state.deliveryLocations = state.deliveryLocations.filter((_, index) => index !== action.payload);
    },
    // update multiple ccarrierIds
    updateCarierLocation: (state, action) => {
      state.carrierIds[action.payload.index] = action.payload;
    },
    addCarierLocation: (state, action) => {
      state.carrierIds.push(initialState.carrierIds[0]);
    },
    removeCarierLocation: (state, action) => {
      state.carrierIds = state.carrierIds.filter((_, index) => index !== action.payload);
    },

    togglePickupVisibility: (state, action) => {
      state.showPickup = action.payload;
    },
    setPickupVisibility: (state, { payload }) => {
      state.showPickup = payload;
    },
    setNewDeliveryInfo: (state) => {
      state.deliveryInfo = {
        type: "delivery",
      };
    },
    setLoadId: (state, action) => {
      state.id = action.payload;
    },
    setDeliveryVisibility: (state, { payload }) => {
      state.showDelivery = payload;
    },
    toggleDeliveryVisibility: (state) => {
      state.showDelivery = !state.showDelivery;
    },
    // Inside your loadSlice reducers:
initializeLoadData: (state, action) => {
  return {
    ...action.payload, // Merge with the incoming payload
    activeTab: "load",
  };
},
    resetLoad: () => initialState,
  },
});

export const {
  setLoadDetails,
  setCustomerInformation,
  setcarrierIds,
  toggleDeliveryVisibility,
  setDeliveryInfo,
  setLoadId,
  setDeliveryVisibility,
  setActiveTab,
  setNewDeliveryInfo,
  toggleCustomerVisibility,
  setPickupInfo,
  togglePickupVisibility,
  setPickupVisibility,
  addPickupLocation,
  removePickupLocation,
  
  resetLoad,
  setCustomerVisibility,
  togglecarrierIdsVisibility,
  setcarrierIdsVisibility,
  setDriverInfo,
  toggleDriverInfoVisibility,
  setDriverInfoVisibility,updatePickupLocation,
  addDeliveryLocation, setFiles,
  addFile,
  removeFile,
  setItems,
  updateCarierLocation,
  addCarierLocation,
  removeCarierLocation,

  addItem,
  setFreightCharge,
  removeDeliveryLocation,
  updateDeliveryLocation,initializeLoadData
  
} = loadSlice.actions;

export default loadSlice.reducer;