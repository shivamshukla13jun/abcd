import { Request, Response, NextFunction } from 'express';
import { Schema } from 'yup';
import { AppError } from '../../../middlewares/error';

export const validateRequest = (schema: Schema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = await schema.validate({
        ...req.body,
        ...req.params,
        ...req.query
      }, {
        abortEarly: false,
        stripUnknown: true
      });

      // Update request with validated data
      req.body = validatedData;
      next();
    } catch (error: any) {
      const errors = error.inner.map((err: any) => ({
        field: err.path,
        message: err.message
      }));
      
      next(new AppError('Validation failed', 400));
    }
  };
};

export * from './payment.validate';
export * from '../../invoice-services/validate/invoice.validate';
export * from './expense.validate';
export * from './rating.validate';
