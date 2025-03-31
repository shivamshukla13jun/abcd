import * as Yup from "yup";
import { EquipmentType, LoadSize, LoadStatus } from "../models/Load.model";
import { LocationClass } from "../models/Location.model";

// Load Schema

// Location Schema
 const LocationSchema = Yup.object().shape({
  type: Yup.mixed().oneOf(['pickup', 'delivery']).required('Location type is required'),
  address: Yup.string().required('Address is required'),
  city: Yup.string().required('City is required'),
  state: Yup.string().required('State is required'),
  zipcode: Yup.string().required('Zipcode is required'),
  country: Yup.string().nullable(),
  locationClass: Yup.mixed().oneOf(Object.values(LocationClass)).required('Location class is required'),
  date: Yup.date().required('Date is required'),
  time: Yup.string().required('Time is required'),
  requirements: Yup.array(),
  notes: Yup.string().nullable(),
});

// const LoadStatudData=LoadStatus.map((item)=>item.name)
// const LoadSizeData=LoadSize.map((item)=>item.id)
// const EquipmentTypeData=EquipmentType.map((item)=>item.options.map((item)=>item.value))

// Define the validation schema for an individual item
const itemSchema = Yup.object().shape({
  id: Yup.number().transform((value, originalValue) => {
      // Convert empty strings or invalid numbers to `null`
      return isNaN(value) || originalValue === '' ? null : value;
    }).required('ID is required'),
  itemDetails: Yup.string().required('Item details are required'),
  description: Yup.string(),
  qty: Yup.number().transform((value, originalValue) => {
      // Convert empty strings or invalid numbers to `null`
      return isNaN(value) || originalValue === '' ? null : value;
    })
    .required('Quantity is required')
    .positive('Quantity must be positive')
    .integer('Quantity must be an integer'),
  rate: Yup.number().transform((value, originalValue) => {
      // Convert empty strings or invalid numbers to `null`
      return isNaN(value) || originalValue === '' ? null : value;
    })
    .required('Rate is required')
    .min(0, 'Rate cannot be negative'),
  discount: Yup.number().transform((value, originalValue) => {
      // Convert empty strings or invalid numbers to `null`
      return isNaN(value) || originalValue === '' ? null : value;
    })
    .required('Discount is required')
    .min(0, 'Discount cannot be negative')
    .max(100, 'Discount cannot exceed 100%'),
  tax: Yup.number().transform((value, originalValue) => {
      // Convert empty strings or invalid numbers to `null`
      return isNaN(value) || originalValue === '' ? null : value;
    })
    .required('Tax is required')
    .min(0, 'Tax cannot be negative'),
  amount: Yup.number().transform((value, originalValue) => {
      // Convert empty strings or invalid numbers to `null`
      return isNaN(value) || originalValue === '' ? null : value;
    })
    .required('Amount is required')
    .min(0, 'Amount cannot be negative'),
});


// Load Schema
const LoadSchema = Yup.object().shape({
  loadNumber: Yup.string().required('Load number is required'),
  loadAmount: Yup.number().transform((value, originalValue) => {
      // Convert empty strings or invalid numbers to `null`
      return isNaN(value) || originalValue === '' ? null : value;
    }).required('Load amount is required'),
  status: Yup.string().required('Status is required'),
  commodity: Yup.string().required('Commodity is required'),
  loadSize: Yup.string().required('Load size is required'),
  declaredValue: Yup.number().transform((value, originalValue) => {
      // Convert empty strings or invalid numbers to `null`
      return isNaN(value) || originalValue === '' ? null : value;
    }).nullable(),
  weight: Yup.number().transform((value, originalValue) => {
      // Convert empty strings or invalid numbers to `null`
      return isNaN(value) || originalValue === '' ? null : value;
    }).nullable(),
  temperature: Yup.number().transform((value, originalValue) => {
      // Convert empty strings or invalid numbers to `null`
      return isNaN(value) || originalValue === '' ? null : value;
    }).nullable(),
  equipmentType: Yup.string().required('Equipment type is required'),
  equipmentLength: Yup.mixed().required('Equipment length is required'),
  notes: Yup.string().nullable(),
  customerId: Yup.string().required('Customer ID is required'),
  carrierIds: Yup.array().min(1).of(Yup.string()).required('Carrier ID is required'),
  pickupLocationId: Yup.array().of(Yup.string()).required('Pickup location IDs are required'),
  deliveryLocationId: Yup.array().of(Yup.string()).required('Delivery location IDs are required'),
  //  documentUpload: documentUploadSchema,
  files: Yup.array()
  .of(Yup.object())
  .max(10, 'Maximum 10 files allowed'),

items: Yup.array()
  .of(itemSchema)
  .min(1, 'At least one item is required'),

freightCharge: Yup.string()
  .required('Freight charge terms are required')
  .oneOf(['Prepaid', 'Collect', '3rd Party'], 'Invalid freight charge option'),

// Adding financial fields
subTotal: Yup.number().transform((value, originalValue) => {
    // Convert empty strings or invalid numbers to `null`
    return isNaN(value) || originalValue === '' ? null : value;
  })
  .min(0, 'Sub-total cannot be negative'),

total: Yup.number().transform((value, originalValue) => {
    // Convert empty strings or invalid numbers to `null`
    return isNaN(value) || originalValue === '' ? null : value;
  })
  .min(0, 'Total cannot be negative'),

deposit: Yup.number().transform((value, originalValue) => {
    // Convert empty strings or invalid numbers to `null`
    return isNaN(value) || originalValue === '' ? null : value;
  })
  .min(0, 'Deposit cannot be negative'),
  deletedfiles: Yup.array().of(Yup.string()).transform((value, originalValue) => {
    if (!originalValue || originalValue === '') {
      return [];
    }
  
    // Parse data if it's a string
    if (typeof originalValue === 'string') {
      try {
        const parsed = JSON.parse(originalValue);
        return Array.isArray(parsed) ? parsed : [];
      } catch (error) {
        return [];
      }
    }
  
    // If it's already an array, return it as-is
    return value;
  }),
  

balanceDue: Yup.number().transform((value, originalValue) => {
    // Convert empty strings or invalid numbers to `null`
    return isNaN(value) || originalValue === '' ? null : value;
  })
  .min(0, 'Balance due cannot be negative'),
});

// Pickup Schema
const PickupLocationSchema = Yup.array().of(
  Yup.object().shape({
    type: Yup.mixed().oneOf(['pickup']).required('Location type is required'),
    address: Yup.string().required('Address is required'),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    zipcode: Yup.string().required('Zipcode is required'),
    country: Yup.string().nullable(),
    locationClass: Yup.string().oneOf(Object.values(LocationClass)).required('Location class is required'),
    date: Yup.date().required('Date is required'),
    time: Yup.string().required('Time is required'),
    requirements: Yup.array(),
    notes: Yup.string().nullable(),
  })
);

const DeliveryLocationSchema = Yup.array().of(
  Yup.object().shape({
    type: Yup.mixed().oneOf(['delivery']).required('Location type is required'),
    address: Yup.string().required('Address is required'),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    zipcode: Yup.string().required('Zipcode is required'),
    country: Yup.string().nullable(),
    locationClass: Yup.mixed().oneOf(Object.values(LocationClass)).required('Location class is required'),
    date: Yup.date().required('Date is required'),
    time: Yup.string().required('Time is required'),
    requirements: Yup.array(),
    notes: Yup.string().nullable(),
  })
);


// Driver Schema
const DriverSchema = Yup.object().shape({
  carrierId: Yup.string().required('Carrier ID is required'),
  driverName: Yup.string().required('Driver name is required'),
  driverPhone: Yup.string().required('Driver phone is required'),
  driverCDL: Yup.string().required('Driver CDL is required'),
  driverCDLExpiration: Yup.date().required('Driver CDL expiration is required'),
  isActive: Yup.boolean().default(true),
  // driverId: Yup.string().required('Driver ID is required'),
  
});

const VehicleSchema = Yup.object().shape({
  powerUnits: Yup.array().of(
    Yup.object().shape({
      number: Yup.string().required('Power unit number is required'),
      type: Yup.string().required('Power unit type is required'),
      make: Yup.string(),
      model: Yup.string(),
      year: Yup.string(),
      vin: Yup.string()
    })
  ),
  trailers: Yup.array().of(
    Yup.object().shape({
      number: Yup.string().required('Trailer number is required'),
      type: Yup.string().required('Trailer type is required'),
      make: Yup.string(),
      model: Yup.string(),
      year: Yup.string(),
      vin: Yup.string()
    })
  )
});

// Customer Schema
 const CustomerSchema = Yup.object().shape({
  company: Yup.string().required('Company name is required'),
  customerName: Yup.string().required('Customer name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string().required('Phone is required'),
  address: Yup.string().required('Address is required'),
  city: Yup.string().required('City is required'),
  state: Yup.string().required('State is required'),
  zipCode: Yup.string().required('Zip code is required'),
  mcNumber: Yup.string().required('MC Number is required'),
  usdot: Yup.string().required('USDOT Number is required'),
  paymentMethod: Yup.string().required('Payment method is required'),
  paymentTerms: Yup.array().of(Yup.string()).min(1, 'At least one payment term is required'),
  vatNumber: Yup.string().required('VAT Registration Number is required'),
  utrNumber: Yup.string().required('UTR number is required'),
  
});

// Carrier Schema
const CarrierSchema = Yup.object().shape({
  companyName:Yup.string().required('Compnay Name  is required'),
  mcNumber: Yup.string().required('MC Number is required'),
  usdot: Yup.string().required('USDOT Number is required'),
  address: Yup.string().required('Address is required'),
  primaryContact: Yup.string().required('Primary contact is required'),
  contactEmail: Yup.string().email('Must be a valid email address').required('Contact email is required'),
  drivers: Yup.array().of(DriverSchema),
  vehicles: VehicleSchema
});
export {
  LoadSchema,
  PickupLocationSchema,
  DeliveryLocationSchema,
  DriverSchema,
  CustomerSchema,LocationSchema,
  CarrierSchema,
  itemSchema,
};
