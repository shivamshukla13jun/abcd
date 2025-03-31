import { Request, Response, NextFunction } from 'express';
import Load, { ICarrierAssignment } from '../models/Load.model';
import Carrier from '../models/Carrier.model';
import Location from '../models/Location.model';
import { AppError } from '../../../middlewares/error';
import mongoose, { Types } from 'mongoose';
import { FileService, MulterFile } from '../services/file.service';
import { convertToArray, parseJSON } from 'src/libs';

const parseLoadData = (req: Request, userId:any) => {
  let loadData = { ...req.body, userId };
  
  if (loadData.items && typeof loadData.items === 'string') {
    loadData.items = JSON.parse(loadData.items);
  }
  if (loadData.customerExpense && typeof loadData.customerExpense === 'string') {
    loadData.customerExpense = JSON.parse(loadData.customerExpense);
  }
  if (loadData.deletedfiles && typeof loadData.deletedfiles === 'string') {
    loadData.deletedfiles = JSON.parse(loadData.deletedfiles);
  }
  

  loadData.carrierIds = parseJSON(loadData.carrierIds);
  loadData.pickupLocationId = convertToArray(loadData.pickupLocationId);
  loadData.deliveryLocationId = convertToArray(loadData.deliveryLocationId);

  return loadData;
};
/**
 * @description Create a new load with transaction
 * @type POST
 * @path /api/loads
 */
const createLoad = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const session = await Load.startSession();
  session.startTransaction();
  const userId = res.locals.userId;
  try {

    // Parse the stringified fields
  const userId = res.locals.userId;
  const loadData=parseLoadData(req,userId)

    // Add uploaded files to documentUpload
    if (req.files?.length) {
      const files = req.files as MulterFile[]
      loadData.files = files
    }

    
    const [load] = await Load.create([loadData], { session });
    if (!load) {
      throw new AppError('Failed to create load', 400);
    }

    // Update related documents
    if (loadData.carrierIds) {
      await Carrier.updateMany(
        { _id: { $in: loadData.carrierIds.map((item:ICarrierAssignment)=>item.carrier) } },
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

    const loads = await Load.aggregate([
      { $match: matchStage },
      {
        $lookup: {
          from: 'customers',
          localField: 'customerId',
          foreignField: '_id',
          as: 'customerId'
        }
      },
      // 
   
      {
        $lookup: {
          from: 'locations',
          localField: 'pickupLocationId',
          foreignField: '_id',
          as: 'pickupLocationId'
        }
      },
      {
        $lookup: {
          from: 'locations',
          localField: 'deliveryLocationId',
          foreignField: '_id',
          as: 'deliveryLocationId'
        }
      },
      {
        $lookup: {
          from: 'carriers',
          localField: 'carrierIds.carrier',
          
          foreignField: '_id',
          as: 'carrierDetails'
        }
      },
       // Lookup drivers and temporarily store in "driverDetails"
        {
        $lookup: {
          from: 'drivers',
          localField: 'carrierIds.assignDrivers',
          foreignField: '_id',
          as: 'driverDetails'
        }
        },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'userId'
        }
      },
  // Merge carriers into carrierIds array without overriding existing fields
        {
        $set: {
        carrierIds: {
        $map: {
        input: "$carrierIds",
        as: "carrier",
        in: {
        $mergeObjects: [
          "$$carrier",
          {
            carrier: {
              $arrayElemAt: [
                {
                  $filter: {
                    input: "$carrierDetails",
                    as: "c",
                    cond: { $eq: ["$$c._id", "$$carrier.carrier"] }
                  }
                },
                0
              ]
            }
          },
          {
            assignDrivers: {
              $map: {
                input: "$$carrier.assignDrivers",
                as: "driverId",
                in: {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: "$driverDetails",
                        as: "d",
                        cond: { $eq: ["$$d._id", "$$driverId"] }
                      }
                    },
                    0
                  ]
                }
              }
            }
          }
        ]
        }
        }
        }
        }
        },
      {
        $unwind: {
          path: '$customerId',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $unwind: {
          path: '$userId',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $unwind:{
          path:"$carrierDetails",
        }
      },
      // carrier invoice
      {
        $lookup: {
          from: 'carrierinvoices',
          let: { 
            currentLoadId: '$_id',
            currentCarrierId: '$carrierDetails._id'
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$loadId', '$$currentLoadId'] },
                    { $eq: ['$carrierId', '$$currentCarrierId'] }
                  ]
                }
              }
            },
            {
              $lookup: {
                from: 'loads',
                localField: 'loadId',
                foreignField: '_id',
                pipeline: [
                  {
                    $lookup: {
                      from: 'customers',
                      localField: 'customerId',
                      foreignField: '_id',
                      as: 'customer'
                    }
                  },
                  {
                    $unwind: {
                      path: '$customer',
                      preserveNullAndEmptyArrays: true
                    }
                  }
                ],
                as: 'load'
              }
            },
            {
              $unwind: {
                path: '$load',
                preserveNullAndEmptyArrays: true
              }
            },
            {
              $addFields:{
                invoiceDate: { $dateToString: { format: '%m/%d/%Y', date: '$invoiceDate' } },
                dueDate: { $dateToString: { format: '%m/%d/%Y', date: '$dueDate' } },
                loadNumber: '$load.loadNumber',
              }
            },
            {
              $unset:"load"
            }
           
          
           
          ],
          as: 'carrierinvoices'
        }
      },
      {
        $unwind: {
          path: '$carrierinvoices',
          preserveNullAndEmptyArrays: true
        }
      },
      // Remove temporary details after merging
      {
        $unset: ["carrierDetails", "driverDetails"]
        },
        {
          $lookup: {
            from: 'invoices',
            localField: 'loadNumber',
            pipeline:[
              {
                $lookup: {
                  from: 'loads',
                  localField: 'loadId',
                  foreignField: '_id',
                  as: 'load'
                }
              },
              {
                $unwind: {
                  path: '$load',
                  preserveNullAndEmptyArrays: true
                }
              },
              {
                $addFields:{
                  invoiceDate: { $dateToString: { format: '%m/%d/%Y', date: '$invoiceDate' } },
                  dueDate: { $dateToString: { format: '%m/%d/%Y', date: '$dueDate' } },
                  loadNumber: '$load.loadNumber',
                }
              },
              {
                $unset:"load"
              }
            ],
             
            foreignField: 'invoiceNumber',
            as: 'invoice'
          }
        },
        {
          $unwind: {
            path: '$invoice',
            preserveNullAndEmptyArrays: true
          }
        },
      {
        $sort: { loadNumber: 1 }
      },
      {
        $skip: (Number(page) - 1) * Number(limit)
      },
      {
        $limit: Number(limit)
      }
    ])

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
    }).populate("pickupLocationId").populate("deliveryLocationId").populate("carrierIds.carrier").populate("userId");
    
    if (!load) {
      throw new AppError('Load not found', 404);
    }
    res.status(200).json({ data: load, success: true, statusCode: 200 });
  } catch (error) {
    console.log("debug", error)
    next(error);
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
    // Update related documents
    if (loadData.carrierIds) {
      await Carrier.updateMany(
        { _id: { $in: loadData.carrierIds.map((item:ICarrierAssignment)=>item.carrier) } },
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
