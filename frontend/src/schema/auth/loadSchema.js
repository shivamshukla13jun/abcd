import * as Yup from "yup";
import { EquipmentType, LoadSize, LoadStatus, locationClasses } from "@data/Loads";

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
  
  // customerId: Yup.number().transform((value, originalValue) => {
  //     // Convert empty strings or invalid numbers to `null`
  //     return isNaN(value) || originalValue === '' ? null : value;
  //   }).required('Customer ID is required'),
  // carrierId: Yup.number().transform((value, originalValue) => {
  //     // Convert empty strings or invalid numbers to `null`
  //     return isNaN(value) || originalValue === '' ? null : value;
  //   }).required('Carrier ID is required'),
  // pickupLocationIds: Yup.array().of(Yup.number().transform((value, originalValue) => {
  //     // Convert empty strings or invalid numbers to `null`
  //     return isNaN(value) || originalValue === '' ? null : value;
  //   }).required()).required('Pickup location IDs are required'),
  // deliveryLocationIds: Yup.array().of(Yup.number().transform((value, originalValue) => {
  //     // Convert empty strings or invalid numbers to `null`
  //     return isNaN(value) || originalValue === '' ? null : value;
  //   }).required()).required('Delivery location IDs are required'),
  // driverId: Yup.number().transform((value, originalValue) => {
  //     // Convert empty strings or invalid numbers to `null`
  //     return isNaN(value) || originalValue === '' ? null : value;
  //   }).required('Driver ID is required'),
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
    locationClass: Yup.mixed().oneOf(locationClasses).required('Location class is required'),
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
    locationClass: Yup.mixed().oneOf(locationClasses).required('Location class is required'),
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
  ext: Yup.string().nullable(),
  fax: Yup.string().nullable(),
  address: Yup.string().required('Address is required'),
  referenceNumber: Yup.string().nullable(),
  mcNumber: Yup.string().nullable(),
  usdot: Yup.string().nullable(),
  
});
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

// File validation
const fileSchema = Yup.mixed()
  .test('fileSize', 'File is too large', (value) => {
    if (!value) return true; // Allow empty values
    return value.size <= 5000000; // 5MB max size
  })
  .test('fileType', 'Unsupported file format', (value) => {
    if (!value) return true; // Allow empty values
    return ['image/jpeg', 'image/png', 'application/pdf', 'application/msword', 
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(value.type);
  });

// Main document upload form schema
const documentUploadSchema = Yup.object().shape({
  files: Yup.array()
    .of(Yup.mixed())
    .max(10, 'Maximum 10 files allowed'),
  
  //   items: Yup.array().of(
  //     Yup.object().shape({
  //       itemDetails: Yup.string().required('Item details are required'),
  //       description: Yup.string(),
  //       qty: Yup.number().required('Quantity is required').min(0).default(0),
  //       rate: Yup.number().required('Rate is required').min(0).default(0),
  //       discount: Yup.number().min(0).default(0),
  //       tax: Yup.number().min(0).max(100).default(0), // Tax as number
  //       amount: Yup.number().min(0).default(0)
  //     })
  //   ).transform((value, originalValue) => {
  //     if(typeof value === 'string'){
  //       return JSON.parse(value);
  //     }
  //     return value;
  //   })
  //   .min(1, 'At least one item is required'),
  
  //   freightCharge: Yup.string()
  //   .required('Freight charge terms are required')
  //   .oneOf(['Prepaid', 'Collect', '3rd Party'], 'Invalid freight charge option'),
  
  // // Adding financial fields
  // subTotal: Yup.number().transform((value, originalValue) => {
  //     // Convert empty strings or invalid numbers to `null`
  //     return isNaN(value) || originalValue === '' ? null : value;
  //   })
  //   .min(0, 'Sub-total cannot be negative'),
  
  // total: Yup.number().transform((value, originalValue) => {
  //     // Convert empty strings or invalid numbers to `null`
  //     return isNaN(value) || originalValue === '' ? null : value;
  //   })
  //   .min(0, 'Total cannot be negative'),
  
  // deposit: Yup.number().transform((value, originalValue) => {
  //     // Convert empty strings or invalid numbers to `null`
  //     return isNaN(value) || originalValue === '' ? null : value;
  //   })
  //   .min(0, 'Deposit cannot be negative'),
  
  // balanceDue: Yup.number().transform((value, originalValue) => {
  //     // Convert empty strings or invalid numbers to `null`
  //     return isNaN(value) || originalValue === '' ? null : value;
  //   })
  //   .min(0, 'Balance due cannot be negative'),
});

// Carrier Schema
const CarrierSchema = Yup.array().of(
  Yup.object().shape({
    carrier: Yup.string().required('Carrier ID is required'),
    assignDrivers: Yup.array().of(Yup.string()).min(1).default([]),
  })
);

const tabsSchema={
    "load":LoadSchema, "customer":CustomerSchema, "asset":CarrierSchema, "pickup":PickupLocationSchema,
   "delivery":DeliveryLocationSchema,
   "document":documentUploadSchema
}
const validateLoadSchema = async (tab, formData) => {
  try {
    console.log("form data",formData)
    // Validate the form data using Yup schema for the specific tab
    await tabsSchema[tab].validate(formData, { abortEarly: false });
    return { isValid: true, error: null }; // No errors, return valid
  } catch (error) {
    if (error.inner && error.inner.length > 0) {
      // Get the first error message
      const firstError = error.inner[0].message;
      let tabname = tab;
      if(tabname === 'document'){
        tabname = 'Document Upload';
      }else if(tabname === 'pickup'){
        tabname = 'Pickup';
      }else if(tabname === 'delivery'){
        tabname = 'Delivery';
      }else if(tabname === 'customer'){
        tabname = 'Customer';
      }else if(tabname === 'asset'){
        tabname = 'Carrier';
      }else if(tabname === 'load'){
        tabname = 'load';
      }
      let message= tabname=="load"?"":`${tabname}: `;

      throw new Error(`${message}${firstError}`);
    }
  }
};


export { LoadSchema,PickupLocationSchema,DeliveryLocationSchema,validateLoadSchema, DriverSchema, CustomerSchema, CarrierSchema,documentUploadSchema, tabsSchema };
