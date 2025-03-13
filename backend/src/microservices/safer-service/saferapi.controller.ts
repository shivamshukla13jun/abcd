import { Request, Response, NextFunction } from "express";
import User from "../auth-service/user.model";
import { AppError } from "../../middlewares/error";
import { asyncHandler, PromiseVoid } from "../../middlewares/asyncHandler";
import apiClient from "./service";


/**
 * @description Get All Users
 * @type GET 
 * @path /api//allusers
 */
const getDataByUSDOT = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
 try {
  const USDotNumber = req.params.usdotnumber;
  const response = await  apiClient.get(`/usdot/snapshot/${USDotNumber}`)
  
  res.status(200).json({
    status: "success",
    data: response.data
  });
 } catch (error) {
   next(error)
 }
}
);
export {getDataByUSDOT}
   

