import { Request, Response, NextFunction } from 'express';
import Invoice from './Invoice.model';
import Load, { IExpenseItem } from '../load-services/models/Load.model';
import * as pdf from 'html-pdf';
import * as ejs from 'ejs';
import path from 'path';
import mongoose from 'mongoose';
import { AppError } from '../../middlewares/error';
import { FileService,MulterFile } from './services/file.service';
import { generateInvoiceSchema } from './validate/invoice.validate';


export const generateInvoice = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const session = await mongoose.startSession();
  await session.startTransaction();
  try {
    req.body=JSON.parse(req.body.invoiceData);
    req.body = await generateInvoiceSchema.validate(req.body, { abortEarly: false, stripUnknown: true });
    // consert req.body to json format
    let { invoiceNumber, customerId, invoiceDate,tax, dueDate, location, terms, customerNotes, terms_conditions, discountPercent, deposit,paymentOptions, } = req.body;
    invoiceDate = new Date(invoiceDate);
    const files:MulterFile[] = req.files as MulterFile[] || [];
    dueDate = new Date(dueDate);
     console.log("paymentOptions", paymentOptions);
    // Find the load by invoice number
    const existingLoad = await Load.findOne({ loadNumber: invoiceNumber })
   
    if (!existingLoad) {
      throw new AppError('Load not found', 404);
    }
    if (req.body.deletedfiles?.length) {
      const deletedFiles = req.body.deletedfiles.map((file: string) => file);
      await FileService.deleteExistedFiles(deletedFiles);
      existingLoad.files = existingLoad.files.filter((file) => !deletedFiles.includes(file.filename));
    }
    
     if(files && files.length>0){
       files.forEach((file) => {
         existingLoad.files.push(file);
       });
    }
    // Get customerExpense from load's documentUpload
    const customerExpense :IExpenseItem[]=req.body.customerExpense || existingLoad?.customerExpense || [];
    existingLoad.customerExpense=customerExpense 
    await existingLoad.save({ session });

    // Create invoice payload
    const invoicePayload = {
      userId: res.locals.userId,
      loadId: existingLoad._id,
      customerId,
      paymentOptions,
      invoiceNumber,
      invoiceDate,
      dueDate,
      location,
      tax,
      terms,
      customerNotes,
      terms_conditions,
      discountPercent,
      deposit,
      status: 'pending',
      freightCharge: existingLoad?.freightCharge || 'Prepaid'
    };
    
    // Create invoice
    let existingInvoice = await Invoice.findOne({loadId: existingLoad._id})
    if(existingInvoice){
      await existingInvoice.save({ session });
    }
    const invoice = await Invoice.create([invoicePayload], { session });

    // Update load with invoice reference
    existingLoad.invoiceId = invoice[0]._id;
  
    await existingLoad.save({ session });
   
    await session.commitTransaction();
    await session.endSession();
    res.status(201).json({
      success: true,
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } 
};

export const generatePDF = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { invoiceId } = req.params;
    const invoice = await Invoice.findById(invoiceId)
      .populate('loadId')
      .populate('carrierId')
      .populate('customerId');

    if (!invoice) {
      throw new AppError('Invoice not found', 404);
    }

    const load = await Load.findById(invoice.loadId)
      .populate('customerId')
      .populate('carrierIds');

    if (!load) {
      throw new AppError('Load not found', 404);
    }

    // Calculate totals
    const customerExpense = load?.customerExpense || [];
    const subTotal = customerExpense.reduce((sum, item) => {
      const rate= Number(item.value || 0)
      if(!isNaN(rate)){
         sum += rate || 0;
      }
      return sum;
    }, 0);
    const totalDiscount = (subTotal * (invoice.discountPercent || 0)) / 100;
    const total = subTotal - totalDiscount;
    const balanceDue = total - (invoice.deposit || 0);

    // Render EJS template
    const templatePath = path.join(__dirname, 'templates', 'invoice.ejs');
    const html = await ejs.renderFile(templatePath, {
      invoice,
      load,
      subTotal,
      totalDiscount,
      total,
      balanceDue
    });

    // PDF generation options
    const options = {
      format: 'A4',
      border: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    };
    // Generate PDF
    pdf.create(html, {
      format: 'A4' as const,
      border: {
        top: '20px',
        right: '20px', 
        bottom: '20px',
        left: '20px'
      }
    }).toStream((err, stream) => {
      if (err) {
        return next(new AppError('Error generating PDF', 500));
      }

      // Set response headers
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=invoice-${invoice.invoiceNumber}.pdf`);

      // Pipe the PDF stream to response
      stream.pipe(res);
    });

  } catch (error) {
    next(error);
  }
};

export const getInvoices = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { customerId, carrierId, status,page = 1, limit = 10 , startDate, endDate } = req.query;
    const matchStage: Record<string, any> = {};
    if (customerId) matchStage["customerId"] = customerId;
    if (carrierId) matchStage["carrierId"] = carrierId;
    if (status) matchStage["status"]= status;
    
    if (startDate && endDate) {
      matchStage["createdAt"] = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string)
      };
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
      {
        $lookup: {
          from: 'expenses',
          localField: '_id',
          foreignField: 'loadId',
          as: 'expenses'
        }
      },
      {
        $addFields: {
          totalExpenses: {
            $reduce: {
              input: '$expenses',
              initialValue: 0,
              in: { $add: ['$$value', { $ifNull: ['$$this.amount', 0] }] }
            }
          },
          expenseCategories: {
            $map: {
              input: '$expenses',
              as: 'expense',
              in: {
                category: '$$expense.category',
                amount: '$$expense.amount',
                description: '$$expense.description',
                date: { $dateToString: { format: '%m/%d/%Y', date: '$$expense.date' } }
              }
            }
          }
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

    res.status(200).json({
      success: true,
      data: loads
    });
  } catch (error) {
    next(error);
  }
};

export const getInvoiceById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { invoiceId } = req.params;
    
    const invoice = await Invoice.findById(invoiceId)
      .populate('loadId')
      .populate('carrierId')
      .populate('customerId');
    
    if (!invoice) {
      throw new AppError('Invoice not found', 404);
    }

    res.status(200).json({
      success: true,
      data: invoice
    }); 
  } catch (error) {
    next(error);
  }
};    

export const updateInvoice = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const session = await mongoose.startSession();
  await session.startTransaction();
  try {
    const { invoiceId } = req.params;
    req.body=JSON.parse(req.body.invoiceData);
    req.body = await generateInvoiceSchema.validate(req.body, { abortEarly: false, stripUnknown: true });
    let { invoiceNumber, customerId, invoiceDate, dueDate, location,tax, terms, customerNotes, terms_conditions, discountPercent, deposit, paymentOptions } = req.body;
    invoiceDate = new Date(invoiceDate);
    dueDate = new Date(dueDate);
     const files:MulterFile[] = req.files as MulterFile[] || [];
    // Find the load by invoice number
    const existinvoice=await Invoice.findById(invoiceId)
    if (!existinvoice) {
      throw new AppError('invoice not found', 404);
    }
    const existingLoad = await Load.findById(existinvoice.loadId).session(session)
    console.log({existingLoad});
    if (!existingLoad) {
      throw new AppError('invoice not found', 404);
    }
    console.log(existingLoad);
    // check deleted files
    if (req.body.deletedfiles?.length) {
      const deletedFiles = req.body.deletedfiles.map((file: string) => file);
      await FileService.deleteExistedFiles(deletedFiles);
      existingLoad.files = existingLoad.files.filter((file) => !deletedFiles.includes(file.filename));
    }
     if(files && files.length>0){
      files.forEach((file) => {
        existingLoad.files.push(file);
      });
    }
    // Get customerExpense from load's documentUpload
    const customerExpense :IExpenseItem[]=req.body.customerExpense || existingLoad?.customerExpense || [];
    existingLoad.customerExpense=customerExpense 
    await existingLoad.save({ session });
    // Create invoice payload
    const invoicePayload = {
      userId: res.locals.userId,
      loadId: existingLoad._id,
      customerId,
      paymentOptions,
      tax,
      invoiceNumber,
      invoiceDate,
      dueDate,
      location,
      terms,
      customerExpense,
      customerNotes,
      terms_conditions,
      discountPercent,
      deposit,
      freightCharge: existingLoad?.freightCharge || 'Prepaid'
    };
    const invoice = await Invoice.findByIdAndUpdate(invoiceId, invoicePayload, { new: true });

    if (!invoice) {
      throw new AppError('Invoice not found', 404);
    }   
    await session.commitTransaction();
    await session.endSession();
    res.status(200).json({
      success: true,
      data: invoice
    });
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    next(error);
  }
};    

export const deleteInvoice = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { invoiceId } = req.params;
    const invoice = await Invoice.findByIdAndDelete(invoiceId);

    if (!invoice) {
      throw new AppError('Invoice not found', 404);
    } 

    res.status(200).json({
      success: true,
      message: 'Invoice deleted successfully'
    });
  } catch (error) { 
    next(error);
  }
};




