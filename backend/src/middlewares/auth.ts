import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import { AppError } from "./error";
import { JWT_EXPIRE, JWT_SECRET,REFRESH_TOKEN_SECRET } from "../config";
import User from "../microservices/auth-service/user.model";
import { ObjectId } from "mongoose";
// Extend the Response.locals interface to include userId
declare global {
  namespace Express {
    interface Locals {
      userId?: ObjectId;
    }
  }
}


const generateToken = (userId: string) => {
  return jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: '365d',  // Access token expires in 15 minutes
  });
};

const generateRefreshToken = (userId: string): string => {
  return jwt.sign({ id: userId },REFRESH_TOKEN_SECRET , {
    expiresIn: '365d',  // Refresh token expires in 7 days
  });
};

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bearer = req.headers["authorization"];
    if (!bearer) {
      return next(new AppError("No token found", 401));
    }
    const token = bearer.split(" ")[1];

    let decoded= jwt.verify(token, JWT_SECRET);
    console.log("decoded",decoded)
    if (!decoded) {
      return next(new AppError("Unauthorized user", 403));
    }
     
    const user = await User.findById((decoded as jwt.JwtPayload).id);
    if (!user) {
      return next(new AppError('Unauthorized user', 403));
    }

    // Assuming user.id is of type ObjectId (from mongoose)
    res.locals.userId = user.id as ObjectId;
    next();

  } catch (error) {

    if (error instanceof jwt.TokenExpiredError) {
      return next(new AppError("Access token expired", 401));
    }
    next(error);
  }
};
const refreshAccessToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const refreshToken = req.cookies.refresh_token;

    if (!refreshToken) {
      throw new AppError('No refresh token provided', 400);
    }
    const decoded: any = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string);
    const newAccessToken = generateToken(decoded._id);  // Generate a new access token
    const user=await User.findById(decoded._id)

    if(!user){
      throw new AppError('User not found', 403);
    }
    const { password, isBlocked, ...userData } = user.toJSON();
    res.status(200).json({
      success: true,
      token: newAccessToken,
      user:userData
    });
  } catch (err) {
    console.log(err)
    next(err);}
};
export { generateToken, verifyToken,generateRefreshToken,refreshAccessToken };
