import { Request, Response, NextFunction } from 'express';
import Load from '../models/Load.model';
import Carrier from '../models/Carrier.model';
import Location from '../models/Location.model';
import { AppError } from '../../../middlewares/error';
import mongoose, { Types } from 'mongoose';
import { FileService, MulterFile } from '../services/file.service';
import { convertToArray } from 'src/libs';

/**
 * @description Create a new load with transaction
 * @type POST
 * @path /api/loads
 */
const createLoad = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const session = await Load.startSession();
  session.startTransaction();
  const userId = res.locals.userId;
  let loadData = { ...req.body, userId };
  try {

    // Parse the stringified fields
    if (loadData.items && typeof loadData.items === 'string') {
      loadData.items = JSON.parse(loadData.items);
    }

    // Convert comma-separated IDs to arrays
    if (loadData.carrierIds && typeof loadData.carrierIds === 'string') {
      loadData.carrierIds = loadData.carrierIds.split(',').filter(Boolean);
    }
    if (loadData.pickupLocationId && typeof loadData.pickupLocationId === 'string') {
      loadData.pickupLocationId = loadData.pickupLocationId.split(',').filter(Boolean);
    }
    if (loadData.deliveryLocationId && typeof loadData.deliveryLocationId === 'string') {
      loadData.deliveryLocationId = loadData.deliveryLocationId.split(',').filter(Boolean);
    }

    // Add uploaded files to documentUpload
    if (req.files?.length) {
      const files = req.files as MulterFile[]
      
      loadData.files = files
    }

    // Create load
    const [load] = await Load.create([loadData], { session });
    if (!load) {
      throw new AppError('Failed to create load', 400);
    }

    // Update related documents
    if (loadData.carrierIds?.length) {
      await Carrier.updateMany(
        { _id: { $in: loadData.carrierIds } },
        { $addToSet: { loads: load._id } },
        { session }
      );
    }
    if (loadData.pickupLocationId?.length) {
      await Location.updateMany(
        { _id: { $in: loadData.pickupLocationId } },
        { $addToSet: { loads: load._id }, type: 'pickup' },
        { session }
      );
    }
    if (loadData.deliveryLocationId?.length) {
      await Location.updateMany(
        { _id: { $in: loadData.deliveryLocationId } },
        { $addToSet: { loads: load._id }, type: 'delivery' },
        { session }
      );
    }

    await session.commitTransaction();
    session.endSession();
    res.status(201).json({ data: load, success: true, statusCode: 201 });
  } catch (error) {
    await session.abortTransaction();
    if (req.files?.length) {
      const files = req.files as MulterFile[];
      const filenames = files.map(file => file.filename);
      await FileService.deleteFiles(filenames);
    }
    session.endSession();
    next(error);
  }
};

/**
 * @description Get all loads
 * @type GET
 * @path /api/loads
 */
const getAllLoads = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const matchStage: Record<string, any> = {};
    if (status) {
      matchStage['status'] = status;
    }

    const loads = await Load.find(matchStage)
      .populate('userId')
      .populate('customerId')
      .populate('carrierIds')
      .populate('pickupLocationId')
      .populate('deliveryLocationId')
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const totalItems = await Load.countDocuments(matchStage);

    res.status(200).json({
      data: loads,
      totalItems,
      totalPages: Math.ceil(totalItems / Number(limit)),
      currentPage: Number(page),
      success: true,
      statusCode: 200,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @description Get a load by ID
 * @type GET
 * @path /api/loads/:id
 */
const getLoadById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const load = await Load.findById(req.params.id)
      .populate('userId')
      .populate('customerId')
      .populate('carrierIds')
      .populate('pickupLocationId')
      .populate('deliveryLocationId');

    if (!load) {
      throw new AppError('Load not found', 404);
    }

    res.status(200).json({ data: load, success: true, statusCode: 200 });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
const getLoadByloadNumber = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    console.log("debug", req.params.loadNumber)
    // populate paymentterms which is under customerId

    const load = await Load.findOne({ loadNumber: req.params.loadNumber }).populate({
      path:"customerId",
      populate:{
        path:"paymentTerms"
      }
    }).populate("pickupLocationId").populate("deliveryLocationId").populate("carrierIds")
    console.log("debug", load)
    if (!load) {
      throw new AppError('Load not found', 404);
    }
    res.status(200).json({ data: load, success: true, statusCode: 200 });
  } catch (error) {
    console.log("debug", error)
    next(error);
  }
};

const parseLoadData = (req: Request, userId:any) => {
  let loadData = { ...req.body, userId };
  
  if (loadData.items && typeof loadData.items === 'string') {
    loadData.items = JSON.parse(loadData.items);
  }
  if (loadData.deletedfiles && typeof loadData.deletedfiles === 'string') {
    loadData.deletedfiles = JSON.parse(loadData.deletedfiles);
  }
  

  loadData.carrierIds = convertToArray(loadData.carrierIds);
  loadData.pickupLocationId = convertToArray(loadData.pickupLocationId);
  loadData.deliveryLocationId = convertToArray(loadData.deliveryLocationId);

  return loadData;
};

export const handleFileUpdates = async (existingLoad: any, req: Request, loadData: any) => {
  if (req.files?.length) {
    const files = req.files as Express.Multer.File[];
    const existingFiles = existingLoad?.files || [];

    const removedFiles = existingFiles.filter(
      (existingFile: any) => !loadData?.files?.some(
        (newFile: any) => newFile.name === existingFile.name
      )
    );

    if (removedFiles.length > 0) {
      await FileService.deleteFiles(removedFiles.map((file: any) => file.filename));
    }

   let documentUpload= loadData.files = [...(loadData.files || []), ...files]
    return documentUpload
  }
  return loadData
};

const updateRelatedDocuments = async (loadData: any, loadId: string, session: mongoose.ClientSession) => {
  if (loadData.carrierIds?.length) {
    await Carrier.updateMany(
      { _id: { $in: loadData.carrierIds } },
      { $addToSet: { loads: loadId } },
      { session }
    );
  }
  if (loadData.pickupLocationId?.length) {
    await Location.updateMany(
      { _id: { $in: loadData.pickupLocationId } },
      { $addToSet: { loads: loadId }, type: 'pickup' },
      { session }
    );
  }
  if (loadData.deliveryLocationId?.length) {
    await Location.updateMany(
      { _id: { $in: loadData.deliveryLocationId } },
      { $addToSet: { loads: loadId }, type: 'delivery' },
      { session }
    );
  }
};
/**
 * @description Update a load by ID with transaction
 * @type PUT
 * @path /api/loads/:id
 */


const updateLoad = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const session = await mongoose.startSession();
 await session.startTransaction();
  try {
    const loadId = req.params.id;
    const userId = res.locals.userId 
    const existingLoad = await Load.findById(loadId);

    if (!existingLoad) {
      throw new AppError('Load not found', 404);
    }
    if(!userId){
      throw new AppError('User not found', 404);
    }
    let loadData = parseLoadData(req, userId);
     // Parse the stringified fields
    if(loadData.deletedfiles){
      
    }

    // Convert comma-separated IDs to arrays
    if (loadData.carrierIds && typeof loadData.carrierIds === 'string') {
      loadData.carrierIds = loadData.carrierIds.split(',').filter(Boolean);
    }
    if (loadData.pickupLocationId && typeof loadData.pickupLocationId === 'string') {
      loadData.pickupLocationId = loadData.pickupLocationId.split(',').filter(Boolean);
    }
    if (loadData.deliveryLocationId && typeof loadData.deliveryLocationId === 'string') {
      loadData.deliveryLocationId = loadData.deliveryLocationId.split(',').filter(Boolean);
    }
    
    console.log("loadData deletedfiles", loadData?.deletedfiles)
    if (loadData.deletedfiles?.length) {
      
      await FileService.deleteExistedFiles(loadData.deletedfiles);
      existingLoad.files = existingLoad.files.filter((file) => !loadData.deletedfiles.includes(file.filename));
    }
    if (req.files && (req.files as MulterFile[]).length > 0) {
      (req.files as MulterFile[]).forEach((file) => {
        existingLoad.files.push(file);
      });
    }
    existingLoad.set(loadData);
    
    console.log("deletedfiles",typeof loadData.deletedfiles)
    
    const load = await existingLoad.save({ session });
    
    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ data: load, success: true, statusCode: 200 });
  } catch (error) {
    // await FileService.deleteFiles(loadData.files.map((file: any) => file.fi));
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};


/**
 * @description Delete a load by ID with transaction
 * @type DELETE
 * @path /api/loads/:id
 */
const deleteLoad = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const session = await Load.startSession();
  session.startTransaction();
  try {
    const loadId = req.params.id;
    const load = await Load.findById(req.params.id);
    if (!load) {
      throw new AppError('Load not found', 404);
    }

    // Delete associated files
    if (load?.files.length > 0) {
      await FileService.deleteFiles(load.files);
    }

    // Delete associated carriers, drivers, customers, etc.
    if (load.carrierIds?.length) {
      await Carrier.updateMany(
        { _id: { $in: load.carrierIds } },
        { $pull: { loads: loadId } },
        { session }
      );
    }
    if (load.pickupLocationId?.length) {
      await Location.updateMany(
        { _id: { $in: load.pickupLocationId } },
        { $pull: { loads: loadId }, type: 'pickup' },
        { session }
      );
    }
    if (load.deliveryLocationId?.length) {
      await Location.updateMany(
        { _id: { $in: load.deliveryLocationId } },
        { $pull: { loads: loadId }, type: 'delivery' },
        { session }
      );
    }

    await Load.findByIdAndDelete(req.params.id, { session });
    
    await session.commitTransaction();
    session.endSession();
    res.status(204).json({ success: true, statusCode: 204 });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

export { createLoad,getLoadByloadNumber, getAllLoads, getLoadById, updateLoad, deleteLoad };
