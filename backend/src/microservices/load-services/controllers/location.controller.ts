import { Request, Response, NextFunction } from 'express';
import Location from '../models/Location.model';
import { AppError } from '../../../middlewares/error';

/**
 * @description Create a new location
 * @type POST
 * @path /api/locations
 */
const createLocation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = res.locals.userId;
    req.body.userId = userId;
    const location = await Location.create(req.body);
    res.status(201).json({ data: location, success: true, statusCode: 201 });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

/**
 * @description Get all locations
 * @type GET
 * @path /api/locations
 */
const getAllLocations = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { type } = req.query;
    const matchStage: Record<string, any> = {};
    if (type) {
      matchStage['type'] = type;
    }
    const locations = await Location.find(matchStage);
    res.status(200).json({ data: locations, success: true, statusCode: 200 });
  } catch (error) {
    next(error);
  }
};

/**
 * @description Get a location by ID
 * @type GET
 * @path /api/locations/:id
 */
const getLocationById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const location = await Location.findById(req.params.id);
    if (location) {
      res.status(200).json({ data: location, success: true, statusCode: 200 });
    } else {
      throw new AppError('Location not found', 404);
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @description Update a location by ID
 * @type PUT
 * @path /api/locations/:id
 */
const updateLocation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const location = await Location.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (location) {
      res.status(200).json({ data: location, success: true, statusCode: 200 });
    } else {
      throw new AppError('Location not found', 404);
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

/**
 * @description Delete a location by ID
 * @type DELETE
 * @path /api/locations/:id
 */
const deleteLocation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const location = await Location.findByIdAndDelete(req.params.id);
    if (location) {
      res.status(204).json({ success: true, statusCode: 204 });
    } else {
      throw new AppError('Location not found', 404);
    }
  } catch (error) {
    next(error);
  }
};

export { createLocation, getAllLocations, getLocationById, updateLocation, deleteLocation };
