import * as yup from 'yup';

export const generateInvoiceSchema = yup.object().shape({
  invoiceNumber: yup.string()
    .label('Invoice Number')
    .required('Please enter a valid invoice number'),
  invoiceDate: yup.date()
    .label('Invoice Date')
    .default(new Date())
    .required('Please select the invoice date')
    .max(new Date(), 'Invoice date cannot be in the future'),
  dueDate: yup.date()
    .label('Due Date')
    .default(new Date())
    .required('Please select the payment due date')
    .min(yup.ref('invoiceDate'), 'Due date must be after invoice date'),
  location: yup.string()
    .label('Billing Location')
    .required('Please specify the billing location')
    .min(3, 'Location must be at least 3 characters'),
  terms: yup.string()
    .label('Terms'),
    // .required('Terms are required'),
  paymentOptions: yup.string()
    .label('Payment Method')
    .oneOf(
      ['Credit Card', 'Cash', 'Check', 'Wire'],
      'Please select a valid payment method'
    )
    .required('Please select a payment method'),
  customerName: yup.string()
    .label('Customer Name')
    .required('Customer name is required'),
  customerEmail: yup.string()
    .label('Customer Email')
    .email('Invalid email')
    .required('Customer email is required'),
  customerAddress: yup.string()
    .label('Customer Address')
    .required('Customer address is required'),
  customerRate: yup.number()
    .label('Customer Rate')
    .default(0),
  tax: yup.string()
    .label('Tax'),
  customerExpense: yup.array().of(
    yup.object().shape({
      service: yup.string().label('Service').required('Expense type is required'),
      value: yup.mixed().label('Value').required('value is required'),
      desc: yup.string().label('Description'),
      positive: yup.boolean().label('Is Positive')
    })
  ).label('Customer Expenses').default([]).notRequired(),
  customerNotes: yup.string()
    .label('Customer Notes'),
  terms_conditions: yup.string()
    .label('Terms and Conditions'),
  discountPercent: yup.number()
    .label('Discount Percent')
    .min(0)
    .max(100)
    .default(0)
    .transform((value, originalValue) => {
      //  NAN check
      if (isNaN(value)) {
        return 0; // default value
      }
      return value;
    }),
  deposit: yup.number()
    .label('Deposit')
    .min(0)
    .default(0)
    .transform((value, originalValue) => {
      //  NAN check
      if (isNaN(value)) {
        return 0; // default value
      }
      return value;
    }),
  totalAmount: yup.number()
    .label('Total Amount')
    .min(0)
    .default(0)
    .transform((value, originalValue) => {
      //  NAN check
      if (isNaN(value)) {
        return 0; // default value
      }
      return value;
    }),
  balanceDue: yup.number()
    .label('Balance Due')
    .default(0)
    .transform((value, originalValue) => {
      //  NAN check
      if (isNaN(value)) {
        return 0; // default value
      }
      return value;
    }),
  files: yup.array().of(yup.object().shape({
    name: yup.string().label('File Name').required('File name is required'),
    preview: yup.string().label('File Preview').required('File preview is required'),
    size: yup.number().label('File Size').required('File size is required'),
    type: yup.string().label('File Type').required('File type is required')
  })).label('Files').default([]).notRequired(),
  deletedfiles: yup.array().of(yup.string()).label('Deleted Files').default([]).notRequired(),
});