import { Request, Response, NextFunction } from 'express';
import PaymentTerms from './PaymentTerms.model';
import { AppError } from '../../middlewares/error';

/**
 * @description Create a new payment term
 * @type POST
 * @path /api/payment-terms
 */
const createPaymentTerm = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = res.locals.userId;
    req.body.userId = userId;
    
    const paymentTerm = await PaymentTerms.create(req.body);
    res.status(201).json({ data: paymentTerm, success: true, statusCode: 201 });
  } catch (error) {
    next(error);
  }
};

/**
 * @description Get all payment terms
 * @type GET
 * @path /api/payment-terms
 */
const getAllPaymentTerms = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = res.locals.userId;
    const paymentTerms = await PaymentTerms.find({ userId, isActive: true }).sort({ days: 1 });
    res.status(200).json({ data: paymentTerms, success: true, statusCode: 200 });
  } catch (error) {
    next(error);
  }
};

/**
 * @description Update a payment term
 * @type PUT
 * @path /api/payment-terms/:id
 */
const updatePaymentTerm = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const updated = await PaymentTerms.findOneAndUpdate(
      { _id: req.params.id, userId: res.locals.userId },
      req.body,
      { new: true }
    );
    
    if (!updated) {
      throw new AppError('Payment term not found', 404);
    }
    
    res.status(200).json({ data: updated, success: true, statusCode: 200 });
  } catch (error) {
    next(error);
  }
};

/**
 * @description Delete a payment term
 * @type DELETE
 * @path /api/payment-terms/:id
 */
const deletePaymentTerm = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const deleted = await PaymentTerms.findOneAndUpdate(
      { _id: req.params.id, userId: res.locals.userId },
      { isActive: false },
      { new: true }
    );
    
    if (!deleted) {
      throw new AppError('Payment term not found', 404);
    }
    
    res.status(200).json({ success: true, statusCode: 200 });
  } catch (error) {
    next(error);
  }
};
const getPaymentTermById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const paymentTerm = await PaymentTerms.findById(req.params.id);
    res.status(200).json({ data: paymentTerm, success: true, statusCode: 200 });
  } catch (error) {
    next(error);
  }
};
export {
  createPaymentTerm,
  getAllPaymentTerms,
  updatePaymentTerm,
  deletePaymentTerm,
  getPaymentTermById
}; 