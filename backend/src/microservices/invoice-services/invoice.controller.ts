import { Request, Response, NextFunction } from 'express';
import Invoice from './Invoice.model';
import Load, { itemsProps } from '../load-services/models/Load.model';
import * as pdf from 'html-pdf';
import * as ejs from 'ejs';
import path from 'path';
import mongoose from 'mongoose';
import { AppError } from '../../middlewares/error';
import { FileService,MulterFile } from './services/file.service';


export const generateInvoice = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const session = await mongoose.startSession();
  await session.startTransaction();
  try {
    let { invoiceNumber, customerId, invoiceDate, dueDate, location, terms, customerNotes, terms_conditions, discountPercent, deposit,paymentOptions, } = req.body;
    invoiceDate = new Date(invoiceDate);
    const files:MulterFile[] = req.files as MulterFile[] || [];
    dueDate = new Date(dueDate);
     console.log("paymentOptions", paymentOptions);
    console.log({invoiceNumber});
    // Find the load by invoice number
    const existingLoad = await Load.findOne({ loadNumber: invoiceNumber })
    console.log({existingLoad});
    if (!existingLoad) {
      throw new AppError('Load not found', 404);
    }
    if (req.body.deletedfiles?.length) {
      const deletedFiles = req.body.deletedfiles.split(',');
      await FileService.deleteExistedFiles(deletedFiles);
      existingLoad.files = existingLoad.files.filter((file) => !deletedFiles.includes(file.filename));
    }
     if(files && files.length>0){
       files.forEach((file) => {
         existingLoad.files.push(file);
       });
    }
    console.log(existingLoad);
    // Get items from load's documentUpload
    const items :itemsProps[]=req.body.items || existingLoad?.items || [];
     
    existingLoad.items=items 
    await existingLoad.save({ session });

    // Calculate totals
    const subTotal = items.reduce((sum, item) => sum + (item.amount || 0), 0);
    const totalDiscount = (subTotal * (discountPercent || 0)) / 100;
    const total = subTotal - totalDiscount;
    const balanceDue = total - (deposit || 0);

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
      terms,
      items,
      customerNotes,
      terms_conditions,
      discountPercent,
      deposit,
      subTotal,
      totalDiscount,
      total,
      balanceDue,
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
    const invoiceDataCalculated = {
      ...invoicePayload,
      totalAmount: total,
      balanceDue: balanceDue,
      status: 'pending',
      freightCharge: existingLoad?.freightCharge || 'Prepaid',
      
    }
    await session.commitTransaction();
    await session.endSession();
    res.status(201).json({
      success: true,
      data: invoiceDataCalculated
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
    const items = load?.items || [];
    const subTotal = items.reduce((sum, item) => sum + (item.amount || 0), 0);
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
    const { customerId, carrierId, status, startDate, endDate } = req.query;
    
    const query: any = {};
    if (customerId) query.customerId = customerId;
    if (carrierId) query.carrierId = carrierId;
    if (status) query.status = status;
    
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string)
      };
    }
    const invoices = await Invoice.aggregate([
      {
        $match: query
      },
      {
        $sort: { createdAt: -1 }
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
        $addFields: {
          // Calculate subTotal from items array
          subTotal: { $sum: "$items.amount" },
          // Get customer details from load
          customerName: '$load.customer.customerName',
          customerEmail: '$load.customer.email',
          customerAddress: '$load.customer.address',
          customerId: '$load.customer._id',
          // Calculate financial figures
          totalDiscount: { 
            $multiply: [
              { $sum: "$items.amount" }, 
              { $divide: ['$discountPercent', 100] }
            ] 
          }
        }
      },
      {
        $addFields: {
          // Calculate final amounts
          totalAmount: { $subtract: ['$subTotal', '$totalDiscount'] },
          balanceDue: { 
            $subtract: [
              { $subtract: ['$subTotal', '$totalDiscount'] }, 
              '$deposit'
            ] 
          }
        }
      },
      {
        $project: {
          // Include all fields that the form needs
          _id: 1,
          invoiceNumber: 1,
          // invoiceDate: 1,
          // convert date related docs to DD/YYYY/MM format
          invoiceDate: { $dateToString: { format: '%m/%d/%Y', date: '$invoiceDate' } },
          dueDate: { $dateToString: { format: '%m/%d/%Y', date: '$dueDate' } },
          location: 1,
          terms: 1,
          customerName: 1,
          customerEmail: 1,
          customerAddress: 1,
          paymentOptions: 1,
          customerId: 1,
          loadId: 1,
          loadNumber: '$invoiceNumber',
          items: '$load.items',
          customerNotes: 1,
          terms_conditions: 1,
          discountPercent: 1,
          deposit: 1,
          subTotal: 1,
          totalDiscount: 1,
          totalAmount: 1,
          balanceDue: 1,
          status: 1,
          freightCharge: 1,
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: invoices
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
    let { invoiceNumber, customerId, invoiceDate, dueDate, location, terms, customerNotes, terms_conditions, discountPercent, deposit, paymentOptions } = req.body;
    invoiceDate = new Date(invoiceDate);
    dueDate = new Date(dueDate);
     const files:MulterFile[] = req.files as MulterFile[] || [];
    // Find the load by invoice number
    const existingLoad = await Load.findOne({ invoiceId: invoiceId }).session(session)
    console.log({existingLoad});
    if (!existingLoad) {
      throw new AppError('Load not found', 404);
    }
    console.log(existingLoad);
    // check deleted files
    if (req.body.deletedfiles?.length) {
      const deletedFiles = req.body.deletedfiles.split(',');
      await FileService.deleteExistedFiles(deletedFiles);
      existingLoad.files = existingLoad.files.filter((file) => !deletedFiles.includes(file.filename));
    }
     if(files && files.length>0){
      files.forEach((file) => {
        existingLoad.files.push(file);
      });
    }
    // Get items from load's documentUpload
    const items :itemsProps[]=req.body.items || existingLoad?.items || [];
    existingLoad.items=items 
    await existingLoad.save({ session });

    // Calculate totals
    const subTotal = items.reduce((sum, item) => sum + (item.amount || 0), 0);
    const totalDiscount = (subTotal * (discountPercent || 0)) / 100;
    const total = subTotal - totalDiscount;
    const balanceDue = total - (deposit || 0);

    // Create invoice payload
    const invoicePayload = {
      userId: res.locals.userId,
      loadId: existingLoad._id,
      customerId,
      invoiceNumber,
      invoiceDate,
      dueDate,
      location,
      terms,
      paymentOptions,
      items,
      customerNotes,
      terms_conditions,
      discountPercent,
      deposit,
      subTotal,
      totalDiscount,
      total,
      balanceDue,
      // status: 'pending',
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




