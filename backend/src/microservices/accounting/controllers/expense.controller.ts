import { Request, Response, NextFunction } from 'express';
import Expense from '../models/Expense.model';
import { AppError } from '../../../middlewares/error';
import multer from 'multer';
import path from 'path';

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../../../uploads/expenses'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

export const upload = multer({ storage });

export const createExpense = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const expenseData = {
      ...req.body,
      userId: res.locals.userId
    };
    
    // Handle file uploads
    if (req.files && Array.isArray(req.files)) {
      expenseData.documentUpload = {
        files: (req.files as Express.Multer.File[]).map(file => ({
          filename: file.filename,
          path: file.path,
          mimetype: file.mimetype
        })),
        description: req.body.description
      };
    }

    const expense = await Expense.create(expenseData);
    
    res.status(201).json({
      success: true,
      data: expense
    });
  } catch (error) {
    next(error);
  }
};

export const getExpenses = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { 
      carrierId, 
      loadId, 
      startDate, 
      endDate, 
      expenseType,
      status 
    } = req.query;
    
    const query: any = {};
    if (carrierId) query.carrierId = carrierId;
    if (loadId) query.loadId = loadId;
    if (expenseType) query.expenseType = expenseType;
    if (status) query.status = status;
    
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string)
      };
    }

    const expenses = await Expense.find(query)
      .populate('carrierId')
      .populate('loadId')
      .populate('userId', 'name email')
      .sort({ date: -1 });

    // Calculate total amount
    const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    res.status(200).json({
      success: true,
      data: {
        expenses,
        totalAmount,
        count: expenses.length
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updateExpense = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Handle new file uploads
    if (req.files && Array.isArray(req.files)) {
      updates.documentUpload = {
        files: (req.files as Express.Multer.File[]).map(file => ({
          filename: file.filename,
          path: file.path,
          mimetype: file.mimetype
        })),
        description: req.body.description
      };
    }

    const expense = await Expense.findOneAndUpdate(
      { _id: id, userId: res.locals.userId },
      updates,
      { new: true }
    );

    if (!expense) {
      throw new AppError('Expense not found or unauthorized', 404);
    }

    res.status(200).json({
      success: true,
      data: expense
    });
  } catch (error) {
    next(error);
  }
};

export const deleteExpense = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    
    const expense = await Expense.findOneAndDelete({
      _id: id,
      userId: res.locals.userId
    });

    if (!expense) {
      throw new AppError('Expense not found or unauthorized', 404);
    }

    res.status(200).json({
      success: true,
      message: 'Expense deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
