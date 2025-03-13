import * as yup from 'yup';

export const createRatingSchema = yup.object().shape({
  loadId: yup.string()
    .required('Load ID is required')
    .matches(/^[0-9a-fA-F]{24}$/, 'Invalid load ID format'),
  carrierId: yup.string()
    .required('Carrier ID is required')
    .matches(/^[0-9a-fA-F]{24}$/, 'Invalid carrier ID format'),
  driverId: yup.string()
    .required('Driver ID is required')
    .matches(/^[0-9a-fA-F]{24}$/, 'Invalid driver ID format'),
  rating: yup.number()
    .required('Rating is required')
    .min(1, 'Rating must be between 1 and 5')
    .max(5, 'Rating must be between 1 and 5')
    .integer('Rating must be a whole number'),
  feedback: yup.string()
    .min(10, 'Feedback must be at least 10 characters')
    .max(1000, 'Feedback cannot exceed 1000 characters')
});

export const updateRatingSchema = yup.object().shape({
  rating: yup.number()
    .required('Rating is required')
    .min(1, 'Rating must be between 1 and 5')
    .max(5, 'Rating must be between 1 and 5')
    .integer('Rating must be a whole number'),
  feedback: yup.string()
    .min(10, 'Feedback must be at least 10 characters')
    .max(1000, 'Feedback cannot exceed 1000 characters')
});
