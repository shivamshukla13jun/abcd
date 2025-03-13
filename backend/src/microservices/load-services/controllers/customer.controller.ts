import { Request, Response, NextFunction } from 'express';
import Customer from '../models/Customer.model';
import User from '../../auth-service/user.model';
import { AppError } from '../../../middlewares/error';

/**
 * @description Create a new customer
 * @type POST
 * @path /api/customers
 */
const createCustomer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = res.locals.userId

    req.body.userId = userId // assign the user id to the customer
    let existingCustomer = await Customer
      .findOne({ $or: [{ email: req.body.email }, { mcNumber: req.body.mcNumber }, { usdot: req.body.usdot }] })
    if (existingCustomer) {
      switch (true) {
        case existingCustomer.email === req.body.email:
          throw new AppError('Customer Email already exists', 400);
        case existingCustomer.mcNumber === req.body.mcNumber:
          throw new AppError('Customer MC Number already exists', 400);
        case existingCustomer.usdot === req.body.usdot:
          throw new AppError('Customer USDOT already exists', 400);
        default:
          throw new AppError('Customer already exists', 400);
      }

    }
    const customer = await Customer.create(req.body);

    res.status(201).json({ data: customer, success: true, statusCode: 201 });
  } catch (error) {
    console.log(error)
    next(error);
  }
};

/**
 * @description Get all customers
 * @type GET
 * @path /api/customers
 */
const getAllCustomers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let { page = 1, limit = 10, keyword } = req.query
    page = Number(page)
    limit = Number(limit)
    const skip = (page - 1) * limit
    const query: Record<string, any> = {}
    if (keyword) {
      query.$or = [{ name: { $regex: keyword, $options: 'i' } }, { email: { $regex: keyword, $options: 'i' } }, { phone: { $regex: keyword, $options: 'i' } }, { address: { $regex: keyword, $options: 'i' } }, { mcNumber: { $regex: keyword, $options: 'i' } }, { usdot: { $regex: keyword, $options: 'i' } }]
    }
    console.log("query", query)
    // use aggregate 
    const [customers] = await Customer.aggregate([
      { $match: query },

      {
        $lookup:
        {
          from: 'paymentterms',
          localField: 'paymentTerms',
          foreignField: '_id',
          pipeline: [
            {
              $project: {
                _id: 0,
                name: 1,
                days: 1
              }
            }
          ],
          as: 'paymentTerms'
        }
      },
      {
        $unwind: { path: '$paymentTerms', preserveNullAndEmptyArrays: true }
      },


      {
        $facet: {
          data: [
            { $skip: skip },
            { $limit: Number(limit) },

            { $sort: { createdAt: -1 } },
          ],
          total: [
            {
              $count: 'total'
            }
          ]
        }
      },
      {
        $project: {
          data: 1,
          total: { $arrayElemAt: ['$total.total', 0] }
        }
      }
    ])
    console.log("customers", customers)
    res.status(200).json({ data: customers.data, total: customers.total, success: true, statusCode: 200 });
  } catch (error) {
    console.log(error)
    next(error);
  }
};

/**
 * @description Get a customer by ID
 * @type GET
 * @path /api/customers/:id
 */
const getCustomerById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const customer = await Customer.findById(req.params.id)
    if (customer) {
      res.status(200).json({ data: customer, success: true, statusCode: 200 });
    } else {
      throw new AppError('Customer not found', 404);
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @description Update a customer by ID
 * @type PUT
 * @path /api/customers/:id
 */
const updateCustomer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const updated = await Customer.findOneAndUpdate({ _id: req.params.id }, req.body);
    if (updated) {
      res.status(200).json({ data: updated, success: true, statusCode: 200 });
    } else {
      throw new AppError('Customer not found', 404);
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @description Delete a customer by ID
 * @type DELETE
 * @path /api/customers/:id
 */
const deleteCustomer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const deleted = await Customer.findByIdAndDelete(req.params.id);
    if (deleted) {
      res.status(204).json({ success: true, statusCode: 204 });
    } else {
      throw new AppError('Customer not found', 404);
    }
  } catch (error) {
    next(error);
  }
};

export { createCustomer, getAllCustomers, getCustomerById, updateCustomer, deleteCustomer };
