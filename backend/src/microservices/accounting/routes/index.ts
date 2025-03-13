import express from 'express';
import * as paymentController from '../controllers/payment.controller';
import * as invoiceController from '../../invoice-services/invoice.controller';
import * as expenseController from '../controllers/expense.controller';
import * as ratingController from '../controllers/rating.controller';
import { verifyToken } from '../../../middlewares/auth';
import { validateRequest } from '../validate';
import {
  processPaymentSchema,
  getPaymentHistorySchema,
  generateInvoiceSchema,
  createExpenseSchema,
  updateExpenseSchema,
  createRatingSchema,
  updateRatingSchema
} from '../validate';

const router = express.Router();

// Payment routes
router.post('/payments/process', 
  verifyToken, 
  validateRequest(processPaymentSchema),
  paymentController.processPayment
);

router.get('/payments/history', 
  verifyToken, 
  validateRequest(getPaymentHistorySchema),
  paymentController.getPaymentHistory
);

// Invoice routes
router.post('/invoices/generate', 
  verifyToken, 
  validateRequest(generateInvoiceSchema),
  invoiceController.generateInvoice
);

router.get('/invoices', 
  verifyToken, 
  invoiceController.getInvoices
);

router.get('/invoices/:invoiceId/pdf', 
  verifyToken, 
  invoiceController.generatePDF
);

// Expense routes
router.post('/expenses', 
  verifyToken, 
  expenseController.upload.array('files'),
  validateRequest(createExpenseSchema),
  expenseController.createExpense
);

router.get('/expenses', 
  verifyToken, 
  expenseController.getExpenses
);

router.put('/expenses/:id', 
  verifyToken, 
  expenseController.upload.array('files'),
  validateRequest(updateExpenseSchema),
  expenseController.updateExpense
);

router.delete('/expenses/:id',
  verifyToken,
  expenseController.deleteExpense
);

// Rating routes
router.post('/ratings', 
  verifyToken, 
  validateRequest(createRatingSchema),
  ratingController.createRating
);

router.get('/ratings', 
  verifyToken, 
  ratingController.getRatings
);

router.put('/ratings/:id', 
  verifyToken, 
  validateRequest(updateRatingSchema),
  ratingController.updateRating
);

export default router;
