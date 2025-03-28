import { Request, Response, NextFunction } from 'express';
import ItemService from '../models/item.model';
import { AppError } from '../../../middlewares/error';

/**
 * @description Create a new item service
 * @type POST
 * @path /api/item-services
 */
const createItemService = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const itemService = await ItemService.create(req.body);
    res.status(201).json({ data: itemService, success: true, statusCode: 201 });
  } catch (error) {
    next(error);
  }
};

/**
 * @description Get all item services
 * @type GET
 * @path /api/item-services
 */
const getAllItemServices = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const itemServices = await ItemService.find({});
    res.status(200).json({ data: itemServices, success: true, statusCode: 200 });
  } catch (error) {
    next(error);
  }
};

/**
 * @description Get an item service by ID
 * @type GET
 * @path /api/item-services/:id
 */
const getItemServiceById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const itemService = await ItemService.findById(req.params.id);
    if (itemService) {
      res.status(200).json({ data: itemService, success: true, statusCode: 200 });
    } else {
      throw new AppError('Item Service not found', 404);
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @description Update an item service by ID
 * @type PUT
 * @path /api/item-services/:id
 */
const updateItemService = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const updated = await ItemService.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (updated) {
      res.status(200).json({ data: updated, success: true, statusCode: 200 });
    } else {
      throw new AppError('Item Service not found', 404);
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @description Delete an item service by ID
 * @type DELETE
 * @path /api/item-services/:id
 */
const deleteItemService = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const deleted = await ItemService.findByIdAndDelete(req.params.id);
    if (deleted) {
      res.status(204).json({ success: true, statusCode: 204 });
    } else {
      throw new AppError('Item Service not found', 404);
    }
  } catch (error) {
    next(error);
  }
};

export { createItemService, getAllItemServices, getItemServiceById, updateItemService, deleteItemService };
