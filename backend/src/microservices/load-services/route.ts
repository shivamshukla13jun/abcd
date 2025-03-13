import express from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
const router = express.Router();
import { createCarrier, getAllCarriers, getCarrierById, updateCarrier, deleteCarrier, } from './controllers/carrier.controller';
import { createCustomer, deleteCustomer, getAllCustomers, getCustomerById, updateCustomer } from './controllers/customer.controller';
import { createLoad, deleteLoad, getAllLoads, getLoadById, getLoadByloadNumber, updateLoad } from './controllers/load.controller';
import {  createLocation, getAllLocations, getLocationById, updateLocation, deleteLocation } from './controllers/location.controller';

import { verifyToken } from '../../middlewares/auth';
import requestValidate from '../../middlewares/Requestalidate';
import { CarrierSchema, CustomerSchema, DriverSchema, LoadSchema, LocationSchema } from './validate';
import { AppError } from '../../middlewares/error';

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../../uploads/loads'));
  },
  filename: function (req, file, cb) {
    const uniqueId = uuidv4();
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueId}${ext}`);
  }
});

const fileFilter = (req: any, file: any, cb: any) => {
 try {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
       throw new AppError('Invalid file type. Only JPEG, PNG, PDF and DOC files are allowed.', 400);
    }
 } catch (error) {
    cb(error, false);
 }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

//  Carrier routes
// Create a new carrier
router.post('/carriers',verifyToken,requestValidate(CarrierSchema), createCarrier);

// Get all carriers
router.get('/carriers',verifyToken, getAllCarriers);

// Get a carrier by ID
router.get('/carriers/:id',verifyToken, getCarrierById);

// Update a carrier by ID
router.put('/carriers/:id',verifyToken,requestValidate(CarrierSchema), updateCarrier);

// Delete a carrier by ID
router.delete('/carriers/:id',verifyToken, deleteCarrier);

// Customer routes
// Create a new Customer
router.post('/customers',verifyToken,requestValidate(CustomerSchema), createCustomer);

// Get All Customers
router.get('/customers',verifyToken, getAllCustomers);

// Get a Customer by ID
router.get('/customers/:id',verifyToken, getCustomerById);

// Update a Customer by ID
router.put('/customers/:id',verifyToken,requestValidate(CustomerSchema), updateCustomer);

// Delete a Customer by ID

router.delete('/customers/:id',verifyToken, deleteCustomer);

// Driver routes


// Location routes
// Create a new location
router.post('/locations',verifyToken,requestValidate(LocationSchema), createLocation);
// Get all locations
router.get('/locations',verifyToken, getAllLocations);
// Get a location by ID
router.get('/locations/:id',verifyToken, getLocationById);
// Update a location by ID
router.put('/locations/:id',verifyToken,requestValidate(LocationSchema), updateLocation);
// Delete a location by ID
router.delete('/locations/:id',verifyToken, deleteLocation);
// Vehicle Routes
// Create a new vehicle
// router.get('/vehicles',verifyToken, getAllVehicles);
// // Get all vehicles
// router.post('/vehicles',verifyToken, createVehicle);
// // Get a vehicle by ID
// router.get('/vehicles/:id',verifyToken, getVehicleById);
// // Update a vehicle by ID
// router.put('/vehicles/:id',verifyToken, updateVehicle);
// // Delete a vehicle by ID
// router.delete('/vehicles/:id',verifyToken, deleteVehicle);

// Load routes
router.get('/',verifyToken, getAllLoads);
router.post('/',verifyToken,upload.array('loads'), createLoad);
router.get('/:id', getLoadById);
router.get('/loadNumber/:loadNumber',getLoadByloadNumber);
router.put('/:id',verifyToken,upload.array('loads'), updateLoad);
router.delete('/:id',verifyToken, deleteLoad)
// static file route
router.use('/documents', express.static(path.join(__dirname, '../../../uploads/loads')));
export default router;
