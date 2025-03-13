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
  requirements: Yup.array().min(1),
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


// Main document upload form schema
const documentUploadSchema = Yup.object().shape({
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
  
  balanceDue: Yup.number().transform((value, originalValue) => {
      // Convert empty strings or invalid numbers to `null`
      return isNaN(value) || originalValue === '' ? null : value;
    })
    .min(0, 'Balance due cannot be negative'),
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
    requirements: Yup.array().min(1),
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
    requirements: Yup.array().min(1),
    notes: Yup.string().nullable(),
  })
);


// Driver Schema
 const DriverSchema = Yup.object().shape({
  driver1Name: Yup.string().required('Driver 1 Name is required'),
  driver1Phone: Yup.string().required('Driver 1 Phone number is required'),
  driver1CDL: Yup.string().required('Driver 1 CDL Number is required'),
  driver1CDLExpiration: Yup.date().required('Driver 1 CDL Expiration date is required'),
  driver2Name: Yup.string().required('Driver 2 Name is required'),
  driver2Phone: Yup.string().required('Driver 2 Phone number is required'),
  driver2CDL: Yup.string().required('Driver 2 CDL Number is required'),
  driver2CDLExpiration: Yup.date().required('Driver 2 CDL Expiration date is required'),
  powerunit: Yup.string().required('Power unit is required'),
  trailer: Yup.string().required('Trailer is required'),
});

// Customer Schema
 const CustomerSchema = Yup.object().shape({
  company:Yup.string().required("'Company name is required'"),
  customerName: Yup.string().required('Customer name is required'),
  email: Yup.string().email('Must be a valid email address').required('Email is required'),
  phone: Yup.string().required('Phone number is required'),
  paymentMethod: Yup.string().required('Payment method is required'),
  paymentTerms: Yup.string().required('Payment term is required'),
  // creditLimit: Yup.number().required('Credit limit is required'),
  vatNumber: Yup.string().nullable(),
  utrNumber: Yup.string().nullable(),
  status: Yup.string().required('Status is required'),
  rating: Yup.string().required('Rating is required'),
  city: Yup.string().required('City is required'),  
  state: Yup.string().required('State is required'),
  zipCode: Yup.string().required('Zipcode is required'),
  address: Yup.string().required('Address is required'),
  referenceNumber: Yup.string().nullable(),
  mcNumber: Yup.string().required('MC Number is required'),
  usdot: Yup.string().required('USDOT Number is required'),
  
});

// Carrier Schema
const CarrierSchema = Yup.object().shape({
  mcNumber: Yup.string().required('MC Number is required'),
  usdot: Yup.string().required('USDOT Number is required'),
  address: Yup.string().required('Address is required'),
  primaryContact: Yup.string().required('Primary contact is required'),
  contactEmail: Yup.string().email('Must be a valid email address').required('Contact email is required'),
  driverInfo:DriverSchema
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
