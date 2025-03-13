import * as yup from 'yup';

export const createExpenseSchema = yup.object().shape({
  carrierId: yup.string()
    .required('Carrier ID is required')
    .matches(/^[0-9a-fA-F]{24}$/, 'Invalid carrier ID format'),
  loadId: yup.string()
    .matches(/^[0-9a-fA-F]{24}$/, 'Invalid load ID format')
    .nullable(),
  expenseType: yup.string()
    .required('Expense type is required')
    .oneOf(['fuel', 'toll', 'maintenance', 'insurance', 'driver_pay', 'other'], 'Invalid expense type'),
  amount: yup.number()
    .required('Amount is required')
    .positive('Amount must be positive'),
  date: yup.date()
    .required('Date is required')
    .max(new Date(), 'Date cannot be in the future'),
  status: yup.string()
    .oneOf(['pending', 'approved', 'rejected'], 'Invalid status'),
  documentUpload: yup.object().shape({
    files: yup.array().of(yup.mixed()),
    description: yup.string().min(10, 'Description must be at least 10 characters')
  }),
  notes: yup.string()
    .max(500, 'Notes cannot exceed 500 characters')
});

export const updateExpenseSchema = yup.object().shape({
  expenseType: yup.string()
    .oneOf(['fuel', 'toll', 'maintenance', 'insurance', 'driver_pay', 'other'], 'Invalid expense type'),
  amount: yup.number()
    .positive('Amount must be positive'),
  date: yup.date()
    .max(new Date(), 'Date cannot be in the future'),
  status: yup.string()
    .oneOf(['pending', 'approved', 'rejected'], 'Invalid status'),
  documentUpload: yup.object().shape({
    files: yup.array().of(yup.mixed()),
    description: yup.string().min(10, 'Description must be at least 10 characters')
  }),
  notes: yup.string()
    .max(500, 'Notes cannot exceed 500 characters')
});
