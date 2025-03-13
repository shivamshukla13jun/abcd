import * as yup from 'yup';

export const processPaymentSchema = yup.object().shape({
  invoiceId: yup.string()
    .required('Invoice ID is required')
    .matches(/^[0-9a-fA-F]{24}$/, 'Invalid invoice ID format'),
  paymentMethod: yup.string()
    .required('Payment method is required')
    .matches(/^(pm_|card_)[a-zA-Z0-9]+$/, 'Invalid payment method format'),
  amount: yup.number()
    .required('Amount is required')
    .positive('Amount must be positive')
    .max(1000000, 'Amount cannot exceed $1,000,000')
});

export const getPaymentHistorySchema = yup.object().shape({
  entityId: yup.string()
    .required('Entity ID is required')
    .matches(/^[0-9a-fA-F]{24}$/, 'Invalid entity ID format'),
  entityType: yup.string()
    .required('Entity type is required')
    .oneOf(['carrier', 'customer'], 'Invalid entity type'),
  startDate: yup.date()
    .max(new Date(), 'Start date cannot be in the future'),
  endDate: yup.date()
    .min(yup.ref('startDate'), 'End date must be after start date')
    .max(new Date(), 'End date cannot be in the future')
});
