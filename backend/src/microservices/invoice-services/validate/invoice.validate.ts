import * as yup from 'yup';
import { AppError } from '../../../middlewares/error';
const parseJsonString = (jsonString: string) => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    throw new AppError('Invalid JSON format', 400);
  }
};

export const generateInvoiceSchema = yup.object().shape({
  invoiceNumber: yup.string().required('Load number is required'),
  invoiceDate: yup.date().default(new Date()).transform((value) => value ? new Date(value) : null).required('Invoice date is required'),
  dueDate: yup.date().default(new Date()).transform((value) => value ? new Date(value) : null).required('Due date is required'),
  location: yup.string().required('Location is required'),
  paymentOptions: yup.string().oneOf(['Credit Card', 'Cash', 'Check', 'Wire'], 'Invalid payment option').required('Payment options are required'),
  terms: yup.string().required('Terms are required'),
  customerName: yup.string().required('Customer name is required'),
  customerEmail: yup.string().email('Invalid email').required('Customer email is required'),
  customerAddress: yup.string().required('Customer address is required'),
  items: yup.array().of(
    yup.object().shape({
      itemDetails: yup.string().required('Item details are required'),
      description: yup.string(),
      qty: yup.number().required('Quantity is required').min(0).default(0),
      rate: yup.number().required('Rate is required').min(0).default(0),
      // discount: yup.number().min(0).default(0),
      tax: yup.number().min(0).max(100).default(0), // Tax as number
      amount: yup.number().min(0).default(0)
    })
  ).transform((value, originalValue) => {
    if(typeof value === 'string'){
      return JSON.parse(value);
    }
    return value;
  }),
  customerExpense: yup
  .array()
  .default([]),
  deletedfiles: yup.array().default([]),
  customerNotes: yup.string(),
  terms_conditions: yup.string(),
  discountPercent:  yup.number().transform((value, originalValue) => {
    if (typeof originalValue === 'string') {
      const parsed = parseFloat(originalValue);
      return isNaN(parsed) ? 0 : parsed;
    }
    return value || 0;
  }).min(0).max(100).default(0),
  deposit: yup.number().transform((value, originalValue) => {
    if (typeof originalValue === 'string') {
      const parsed = parseFloat(originalValue);
      return isNaN(parsed) ? 0 : parsed;
    }
    return value || 0;
  }).min(0).default(0),

totalAmount: yup.number().transform((value, originalValue) => {
    if (typeof originalValue === 'string') {
      const parsed = parseFloat(originalValue);
      return isNaN(parsed) ? 0 : parsed;
    }
    return value || 0;
  }).min(0).default(0),

balanceDue: yup.number().transform((value, originalValue) => {
    if (typeof originalValue === 'string') {
      const parsed = parseFloat(originalValue);
      return isNaN(parsed) ? 0 : parsed;
    }
    return value || 0;
  }).min(0).default(0),
  customerId: yup.string().required('Customer ID is required'),
  

});
