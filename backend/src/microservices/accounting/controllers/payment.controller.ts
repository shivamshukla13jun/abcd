import { Request, Response, NextFunction } from 'express';
import Stripe from 'stripe';
import Invoice from '../../invoice-services/Invoice.model';
import Carrier from '../../load-services/models/Carrier.model';
import { AppError } from '../../../middlewares/error';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16' as Stripe.StripeConfig['apiVersion']
});

export const processPayment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { invoiceId, paymentMethod, amount } = req.body;

    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
      throw new AppError('Invoice not found', 404);
    }

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      payment_method: paymentMethod,
      confirm: true,
      description: `Payment for Invoice ${invoice.invoiceNumber}`
    });

    if (paymentIntent.status === 'succeeded') {
      // Update invoice status
      invoice.status = 'paid';
      await invoice.save();

      // Update carrier balance
      const carrier = await Carrier.findById(invoice.carrierId);
      if (carrier) {
        carrier.balance += amount;
        await carrier.save();
      }

      res.status(200).json({
        success: true,
        data: {
          paymentId: paymentIntent.id,
          status: paymentIntent.status,
          amount: amount
        }
      });
    } else {
      throw new AppError('Payment processing failed', 400);
    }
  } catch (error) {
    next(error);
  }
};

export const getPaymentHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { entityId, entityType, startDate, endDate } = req.query;
    
    const query: any = {};
    if (entityType === 'carrier') {
      query.carrierId = entityId;
    } else if (entityType === 'customer') {
      query.customerId = entityId;
    }

    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string)
      };
    }

    const invoices = await Invoice.find(query)
      .populate('loadId')
      .populate('carrierId')
      .populate('customerId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: invoices
    });
  } catch (error) {
    next(error);
  }
};
