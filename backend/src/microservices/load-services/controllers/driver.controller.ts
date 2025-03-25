import { Request, Response, NextFunction } from 'express';
import Driver from '../models/Driver.model';
import Carrier from '../models/Carrier.model';
import { AppError } from '../../../middlewares/error';

/**
 * @description Create a new driver
 * @type POST
 * @path /api/drivers
 */
const createDriver = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Check if carrier exists
    const carrier = await Carrier.findById(req.body.carrierId);
    if (!carrier) {
      throw new AppError('Carrier not found', 404);
    }

    // Check if driver with same CDL exists
    const existingDriver = await Driver.findOne({ cdlNumber: req.body.cdlNumber });
    if (existingDriver) {
      throw new AppError('Driver with this CDL number already exists', 400);
    }

    const driver = await Driver.create(req.body);
    res.status(201).json({ data: driver, success: true, statusCode: 201 });
  } catch (error) {
    next(error);
  }
};

/**
 * @description Get all drivers
 * @type GET
 * @path /api/drivers
 */
const getAllDrivers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let { page = 1, limit = 10, carrierId } = req.query;
    page = Number(page);
    limit = Number(limit);
    const skip = (page - 1) * limit;

    const query: any = {};
    if (carrierId) {
      query.carrierId = carrierId;
    }

    const drivers = await Driver.find(query)
      .populate('carrierId', 'companyName')
      .skip(skip)
      .limit(limit);

    const total = await Driver.countDocuments(query);

    res.status(200).json({
      data: drivers,
      success: true,
      statusCode: 200,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @description Get driver by ID
 * @type GET
 * @path /api/drivers/:id
 */
const getDriverById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const driver = await Driver.findById(req.params.id).populate('carrierId', 'companyName');
    if (!driver) {
      throw new AppError('Driver not found', 404);
    }
    res.status(200).json({ data: driver, success: true, statusCode: 200 });
  } catch (error) {
    next(error);
  }
};

/**
 * @description Update driver
 * @type PUT
 * @path /api/drivers/:id
 */
const updateDriver = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const driver = await Driver.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!driver) {
      throw new AppError('Driver not found', 404);
    }
    res.status(200).json({ data: driver, success: true, statusCode: 200 });
  } catch (error) {
    next(error);
  }
};

/**
 * @description Delete driver
 * @type DELETE
 * @path /api/drivers/:id
 */
const deleteDriver = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const driver = await Driver.findByIdAndDelete(req.params.id);
    if (!driver) {
      throw new AppError('Driver not found', 404);
    }
    res.status(200).json({ data: null, success: true, statusCode: 200 });
  } catch (error) {
    next(error);
  }
};

export {
  createDriver,
  getAllDrivers,
  getDriverById,
  updateDriver,
  deleteDriver
};
