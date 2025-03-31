import * as Yup from "yup";
import { EquipmentType, LoadSize, LoadStatus, locationClasses } from "@data/Loads";
import customerExpenseSchema from "./customerexpenseSchema";

// Load Schema
const LoadSchema = Yup.object().shape({
  loadNumber: Yup.string()
    .label('Load Number')
    .required('Please enter a valid load number')
    .min(3, 'Load number must be at least 3 characters'),
  loadAmount: Yup.number()
    .label('Load Amount')
    .transform((value, originalValue) => {
      return isNaN(value) || originalValue === '' ? null : value;
    })
    .required('Please enter the load amount')
    .positive('Load amount must be greater than zero'),
  status: Yup.string()
    .label('Status')
    .required('Please select the current load status'),
  commodity: Yup.string()
    .label('Commodity')
    .required('Please specify the commodity type')
    .min(2, 'Commodity description must be at least 2 characters'),
  loadSize: Yup.string()
    .label('Load Size')
    .required('Load size is required'),
  declaredValue: Yup.number().label('Declared Value').transform((value, originalValue) => {
      // Convert empty strings or invalid numbers to `null`
      return isNaN(value) || originalValue === '' ? null : value;
    }).nullable(),
  weight: Yup.number().label('Weight').transform((value, originalValue) => {
      // Convert empty strings or invalid numbers to `null`
      return isNaN(value) || originalValue === '' ? null : value;
    }).nullable(),
  temperature: Yup.number().label('Temperature').transform((value, originalValue) => {
      // Convert empty strings or invalid numbers to `null`
      return isNaN(value) || originalValue === '' ? null : value;
    }).nullable(),
  equipmentType: Yup.string().label('Equipment Type').required('Equipment type is required'),
  equipmentLength: Yup.mixed().label('Equipment Length').required('Equipment length is required'),
  notes: Yup.string().label('Notes').nullable(),
 
});

// Pickup Schema
const PickupLocationSchema = Yup.array().of(
  Yup.object().shape({
    type: Yup.mixed().label('Location Type').oneOf(['pickup']).required('Location type is required'),
    address: Yup.string().label('Address').required('Address is required'),
    city: Yup.string().label('City').required('City is required'),
    state: Yup.string().label('State').required('State is required'),
    zipcode: Yup.string().label('Zipcode').required('Zipcode is required'),
    country: Yup.string().label('Country').nullable(),
    locationClass: Yup.mixed().label('Location Class').oneOf(locationClasses).required('Location class is required'),
    date: Yup.date().label('Date').required('Date is required'),
    time: Yup.string().label('Time').required('Time is required'),
    requirements: Yup.array().label('Requirements').default([]),
    notes: Yup.string().label('Notes').nullable(),
  })
);

const DeliveryLocationSchema = Yup.array().of(
  Yup.object().shape({
    type: Yup.mixed().label('Location Type').oneOf(['delivery']).required('Location type is required'),
    address: Yup.string().label('Address').required('Address is required'),
    city: Yup.string().label('City').required('City is required'),
    state: Yup.string().label('State').required('State is required'),
    zipcode: Yup.string().label('Zipcode').required('Zipcode is required'),
    country: Yup.string().label('Country').nullable(),
    locationClass: Yup.mixed().label('Location Class').oneOf(locationClasses).required('Location class is required'),
    date: Yup.date().label('Date').required('Date is required'),
    time: Yup.string().label('Time').required('Time is required'),
    requirements: Yup.array().label('Requirements').default([]),
    notes: Yup.string().label('Notes').nullable(),
  })
);
// Customer Schema
 const CustomerSchema = Yup.object().shape({
  company: Yup.string()
    .label('Company')
    .required('Please enter the company name')
    .min(2, 'Company name must be at least 2 characters'),
  customerName: Yup.string()
    .label('Customer Name')
    .required('Please enter the customer name')
    .min(2, 'Customer name must be at least 2 characters'),
  email: Yup.string()
    .label('Email')
    .email('Please enter a valid business email address')
    .required('Email address is required for communication'),
  phone: Yup.string()
    .label('Phone')
    .required('Please provide a contact phone number'),
    // .matches(/^[0-9-+()]*$/, 'Phone number can only contain numbers and special characters'),
  ext: Yup.string().label('Extension').nullable(),
  fax: Yup.string().label('Fax').nullable(),
  address: Yup.string().label('Address').required('Address is required'),
  referenceNumber: Yup.string().label('Reference Number').nullable(),
  mcNumber: Yup.string().label('MC Number').nullable(),
  usdot: Yup.string().label('USDOT').nullable(),
  customerExpense:customerExpenseSchema
  
});
// Main document upload form schema
const documentUploadSchema = Yup.object().shape({
  files: Yup.array()
    .label('Files')
    .of(Yup.mixed())
    .max(10, 'Maximum 10 files allowed'),
});

// Carrier Schema
const CarrierSchema = Yup.array().of(
  Yup.object().shape({
    carrier: Yup.string().label('Carrier').required('Carrier ID is required'),
    assignDrivers: Yup.array().label('Assign Drivers').min(2,"Please Add aleast 2 Drivers").of(Yup.string()).default([]).label("Drivers"),
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


export { LoadSchema,PickupLocationSchema,DeliveryLocationSchema,validateLoadSchema, CustomerSchema, CarrierSchema,documentUploadSchema, tabsSchema };
