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
      state.documentUpload.files = state.documentUpload.files.filter((_, index) => index !== action.payload);
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
    setAssetInfo: (state, action) => {
      const { index, asset } = action.payload;
      state.assetInfo.splice(index, 1, asset); // Replace the item at `index` with `asset`
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
    toggleassetInfoVisibility: (state) => {
      state.showAsset = !state.showAsset;
    },
    setassetInfoVisibility: (state, { payload }) => {
      state.showAsset = payload;
    },
    setDriverInfo: (state, action) => {
      const { index, driverInfo } = action.payload;
      state.assetInfo[index].driverInfo = driverInfo;
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
    // update multiple cassetinfo
    updateCarierLocation: (state, action) => {
      state.assetInfo[action.payload.index] = action.payload;
    },
    addCarierLocation: (state, action) => {
      state.assetInfo.push(initialState.assetInfo[0]);
    },
    removeCarierLocation: (state, action) => {
      state.assetInfo = state.assetInfo.filter((_, index) => index !== action.payload);
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
  setAssetInfo,
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
  toggleassetInfoVisibility,
  setassetInfoVisibility,
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