import { Request, Response, NextFunction } from "express";
import User from "../auth-service/user.model";
import { AppError } from "../../middlewares/error";
import { asyncHandler, PromiseVoid } from "../../middlewares/asyncHandler";


/**
 * @description Get All Users
 * @type GET 
 * @path /api/users/allusers
 */
const getAllUsers = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): PromiseVoid => {
    const users = await User.find();
    res.status(200).json({ data: users, success: true, statusCode: 200 });
  }
);

/**
 * @description Get a Single User by ID
 * @type GET 
 * @path /api/users/:id
 */
const getUserById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): PromiseVoid => {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    res.status(200).json({ data: user, success: true, statusCode: 200 });
  }
);

/**
 * @description Update User by ID
 * @type PUT 
 * @path /api/users/:id
 */
const updateUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): PromiseVoid => {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, req.body);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    res
      .status(200)
      .json({
        data: user,
        success: true,
        message: "User updated successfully",
        statusCode: 200,
      });
  }
);

/**
 * @description Delete User by ID
 * @type DELETE 
 * @path /api/users/:id
 */
const deleteUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): PromiseVoid => {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    res
      .status(200)
      .json({
        success: true,
        message: "User deleted successfully",
        statusCode: 200,
      });
  }
);



export {  getAllUsers, getUserById, updateUser, deleteUser };
