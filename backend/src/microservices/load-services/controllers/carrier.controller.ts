import { Request, Response, NextFunction } from 'express';
import Carrier from '../models/Carrier.model';
import User from '../../auth-service/user.model';

import { AppError } from '../../../middlewares/error';
import Load from '../models/Load.model';
/**
 * @description Create a new carrier
 * @type POST
 * @path /api/carriers
 */
const createCarrier = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    console.log("req.body",req.body)
    const userId=res.locals.userId
    
    req.body.userId=userId // assign the user id to the customer
    
    const carrier = await Carrier.create(req.body);
    res.status(201).json({ data: carrier, success: true, statusCode: 201 });
  } catch (error) {
    console.log(error)
    next(error);
  }
};

/**
 * @description Get all carriers
 * @type GET
 * @path /api/carriers
 */
const getAllCarriers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const carriers = await Carrier.aggregate([
      {
        $match: {}
      },
      {
        $lookup: {
          from: 'drivers',
          localField: '_id',
          foreignField: 'carrierId',
          as: 'drivers'
        }
      },
     
    ]);
    res.status(200).json({ data: carriers, success: true, statusCode: 200 });
  } catch (error) {
    next(error);
  }
};

/**
 * @description Get a carrier by ID
 * @type GET
 * @path /api/carriers/:id
 */
const getCarrierById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const carrier = await Carrier.findById(req.params.id);
    if (carrier) {
      res.status(200).json({ data: carrier, success: true, statusCode: 200 });
    } else {
      throw new AppError('Carrier not found', 404);
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @description Update a carrier by ID
 * @type PUT
 * @path /api/carriers/:id
 */
const updateCarrier = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const updated= await Carrier.findByIdAndUpdate(req.params.id, req.body);
    if (updated) {
      res.status(200).json({ data: updated, success: true, statusCode: 200 });
    } else {
     throw new AppError('Carrier not found', 404);
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @description Delete a carrier by ID
 * @type DELETE
 * @path /api/carriers/:id
 */
const deleteCarrier = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const deleted = await Carrier.findByIdAndDelete(req.params.id);
    if (deleted) {
      res.status(204).json({ success: true, statusCode: 204 });
    } else {
      throw new AppError('Carrier not found', 404);
    }
  } catch (error) {
    next(error);
  }
};
const viewDocuments=async(req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    //  pagination add and get all documens from a load model
    const { page, limit } = req.query;
    const loads = await Load.find()
    .populate('userId')
    
     } catch (error) {
    next(error);
  }
}

export { createCarrier, getAllCarriers, getCarrierById, updateCarrier, deleteCarrier };