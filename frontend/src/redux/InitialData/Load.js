export const initalLoadData = {
  deletedfiles: [],
  loadDetails: {
    loadNumber: '',
    loadAmount: '',
    status: '',
    commodity: '',
    loadSize: '',
    declaredValue: '',
    weight: '',
    temperature: '',
    equipmentType: '',
    equipmentLength: '',
    notes: '',
  },
  customerInformation: {
    company: "",
    customerName: "",
    email: "",
    phone: "",
    ext: "",
    fax: "",
    address: "",
    reference: "",
    mcNumber: "",
    usdot: "",
  },
  customerExpense:[],
  carrierIds: [
    {
      carrier:null,
      assignDrivers:[]
    },
  ],
  deliveryLocations: [
    {
      type: "delivery",
      requirements: [],
      address: "",
      state: "",
      city: "",
      zipcode: "",
      locationClass: "",
      date: "",
      time: "",
      notes: "",
    },
  ],
  pickupLocations: [
    {
      type: "pickup",
      requirements: [],
      showPickup: true,
      address: "",
      state: "",
      city: "",
      zipcode: "",
      locationClass: "",
      date: "",
      time: "",
      notes: "",
    },
  ],
  files: [],
  items: [],
  freightCharge: 'Prepaid',
  id: null,
  activeTab: "load",
  showCustomer: false,
  showAsset: false,
  showDriver: false,
  showPickup: false,
  showDelivery: false,
};

export const initialLoadetails = initalLoadData.loadDetails;
export const initialCustomerInformation = initalLoadData.customerInformation;
export const initialcarrierIds = initalLoadData.carrierIds[0];
export const initialDeliveryLocations = initalLoadData.deliveryLocations[0];
export const initialPickupLocations = initalLoadData.pickupLocations[0];  
export const initialDocumentUpload = {
  files: [],
  items: [],
  freightCharge: 'Prepaid'
};