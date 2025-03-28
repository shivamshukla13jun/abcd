import { Request, Response, NextFunction } from "express";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { ValidationError as YupValidationError } from "yup";
import { MongoError } from "mongodb";
import mongoose from "mongoose";

// Custom error class
class AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  errors?: Record<string, string>;

  constructor(message: string, statusCode: number, errors?: Record<string, string>) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Not Found middleware
const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new AppError(`Not Found - ${req.originalUrl}`, 404);
  next(error);
};

// Global error handler
const errorHandler = (
  err: Error | AppError | JsonWebTokenError | YupValidationError | MongoError | mongoose.Error.ValidationError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("errrrr",err)
  let error = { ...err };
  error.message = err.message;

  // If error already is an AppError, use it directly
  if ('statusCode' in err && 'isOperational' in err) {
    return res.status((err as AppError).statusCode).json({
      success: false,
      message: err.message,
      errors: (err as AppError).errors,
      stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
    });
  }

  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    error = new AppError('Invalid or expired token', 401);
  }
  if (err.message === 'Not allowed by CORS') {
    error = new AppError("You are not allowed to access this resource", 403);
  }

  // Handle MongoDB validation errors
  if (err instanceof mongoose.Error.ValidationError) {
    const errors: Record<string, string> = {};
    Object.keys(err.errors).forEach((key) => {
      // Prefix the key with the model name if available
      const modelName = (err as any).model?.modelName || 'Model';
      errors[`${modelName}.${key}`] = err.errors[key].message;
    });
    error = new AppError('Validation Error', 400, errors);
  }

  // Handle MongoDB unique constraint errors
  if (err.name === 'MongoServerError' && (err as any).code === 11000) {
    const duplicateKey = Object.keys((err as any).keyPattern)[0];
    const modelName = (err as any).model?.modelName || 'Model';
    error = new AppError(`Duplicate key error: ${duplicateKey} already exists`, 409, {
      [`${modelName}.${duplicateKey}`]: `${duplicateKey} must be unique`
    });
  }

  // Handle Yup validation errors
  if (err instanceof YupValidationError) {
    const messages = err.errors.join(", ");
    error = new AppError(messages, 400);
  }

  // Add custom error fields from request if available
  const customErrorFields = (req as any).customErrorFields;
  if (customErrorFields && typeof customErrorFields === 'object') {
    const existingErrors = (error as AppError).errors || {};
    error = new AppError(
      'One or more errors occurred', 
      400, 
      { ...existingErrors, ...customErrorFields }
    );
  }

  // Fallback for other errors
  if (!(error instanceof AppError)) {
    error = new AppError(error.message || "Internal Server Error", 500);
  }

  res.status((error as AppError).statusCode).json({
    success: false,
    message: (error as AppError).message,
    errors: (error as AppError).errors,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};

export { notFound, errorHandler, AppError };
