import { Request, Response, NextFunction } from 'express';
import Rating from '../models/Rating.model';
import Carrier from '../../load-services/models/Carrier.model';
import { AppError } from '../../../middlewares/error';

export const createRating = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { loadId, carrierId, driverId, rating, feedback } = req.body;
    const customerId = res.locals.userId;

    // Check if rating already exists
    const existingRating = await Rating.findOne({
      loadId,
      carrierId,
      driverId,
      customerId
    });

    if (existingRating) {
      throw new AppError('Rating already exists for this load', 400);
    }

    // Create new rating
    const newRating = await Rating.create({
      loadId,
      carrierId,
      driverId,
      customerId,
      rating,
      feedback
    });

    // Update carrier's average rating
    const carrierRatings = await Rating.find({ carrierId });
    const averageRating = carrierRatings.reduce((acc, curr) => acc + curr.rating, 0) / carrierRatings.length;

    await Carrier.findByIdAndUpdate(carrierId, {
      rating: Number(averageRating.toFixed(1))
    });

    res.status(201).json({
      success: true,
      data: newRating
    });
  } catch (error) {
    next(error);
  }
};

export const getRatings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { carrierId, driverId, loadId } = req.query;
    
    const query: any = {};
    if (carrierId) query.carrierId = carrierId;
    if (driverId) query.driverId = driverId;
    if (loadId) query.loadId = loadId;

    const ratings = await Rating.find(query)
      .populate('loadId')
      .populate('carrierId')
      .populate('driverId')
      .populate('customerId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: ratings
    });
  } catch (error) {
    next(error);
  }
};

export const updateRating = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { rating, feedback } = req.body;
    const customerId = res.locals.userId;

    const existingRating = await Rating.findOne({
      _id: id,
      customerId
    });

    if (!existingRating) {
      throw new AppError('Rating not found or unauthorized', 404);
    }

    existingRating.rating = rating;
    existingRating.feedback = feedback;
    await existingRating.save();

    // Update carrier's average rating
    const carrierRatings = await Rating.find({ carrierId: existingRating.carrierId });
    const averageRating = carrierRatings.reduce((acc, curr) => acc + curr.rating, 0) / carrierRatings.length;

    await Carrier.findByIdAndUpdate(existingRating.carrierId, {
      rating: Number(averageRating.toFixed(1))
    });

    res.status(200).json({
      success: true,
      data: existingRating
    });
  } catch (error) {
    next(error);
  }
};
