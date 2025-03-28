import express from 'express';
import * as invoiceController from './invoice.controller';
import { verifyToken } from '../../middlewares/auth';
import requestValidate from '../../middlewares/Requestalidate';
import {
  generateInvoiceSchema,
  
} from './validate/invoice.validate';
import multer from 'multer';
import path from 'path';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/loads'); // Make sure this directory exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Invoice routes
const router = express.Router();

router.post('/generate', 
  verifyToken,
  upload.array('files'), // Handle file uploads if any
  
  invoiceController.generateInvoice
);

router.get('/', 
  verifyToken, 
  invoiceController.getInvoices
);

router.get('/:invoiceId/pdf', 
  verifyToken, 
  invoiceController.generatePDF
);

router.get('/:invoiceId', 
  verifyToken, 
  invoiceController.getInvoiceById
);

router.put('/:invoiceId', 
  verifyToken, 
  upload.array('files'), // Handle file uploads if any

  invoiceController.updateInvoice
);

router.delete('/:invoiceId', 
  verifyToken, 
  invoiceController.deleteInvoice
);




export default router;
