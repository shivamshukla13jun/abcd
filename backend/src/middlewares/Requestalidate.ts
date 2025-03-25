import { Request, Response, NextFunction } from 'express';
import { AnySchema } from 'yup';
import { AppError } from './error';

// Custom JSON parse function
const parseJsonString = (jsonString: string) => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    throw new AppError('Invalid JSON format', 400);
  }
};

const requestValidate = (schema: AnySchema) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('Original Request Body:', req.body);
    const { invoiceData } = req.body;

    // // Parse 'invoiceData' if it's a JSON string using the custom function
    // if (invoiceData) {
    //   req.body = { ...parseJsonString(invoiceData), ...req.body };
    // }

    // Validate the modified request body
    req.body = await schema.validate(req.body, { abortEarly: false, stripUnknown: true });
    next();
  } catch (err: any) {
    next(err);
  }
};

export default requestValidate;
