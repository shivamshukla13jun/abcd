import { Request, Response, NextFunction } from "express";
import User from "./user.model";
import { IUser } from "./types";
import { AppError } from "../../middlewares/error";
import { generateRefreshToken, generateToken } from "../../middlewares/auth";
import { asyncHandler, PromiseVoid } from "../../middlewares/asyncHandler";

/**
 * @description Create New User
 * @type POST 
 * @path /api/users/register
 */
const registerUser =
  async (req: Request, res: Response, next: NextFunction): PromiseVoid => {
    try {
      const user = await User.create(req.body);
      res.status(201).json({ data: user, success: true, statusCode: 201 });
    } catch (error) {
      console.log(error)
      next(error)
    }
  }

/**
 * @description User Login
 * @type POST 
 * @path /api/users/login
 */
const loginUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): PromiseVoid => {
    const payload: IUser = req.body;
    payload.email = payload.email.toLowerCase();

    // Use a "where" clause to find the user by email
    const checkUser = await User.findOne( { email: payload.email  });
    if (!checkUser) {
      throw new AppError("No user found with provided email", 400);
    }

    if (!checkUser.isActive) {
      throw new AppError("Account is deactivated by owner!", 400);
    }
    if (checkUser.isBlocked) {
      throw new AppError("User blocked by owner!", 400);
    }
    console.log(checkUser)
    const isMatch = await checkUser.matchPassword(payload.password as string, checkUser.password);
    if (!isMatch) {
      throw new AppError("Invalid credentials", 400);
    }

    // Remove sensitive info from returned user data
    const { password, isBlocked, ...userData } = checkUser.toJSON();

    // Generate Access Token
    console.log("userdta",userData)
    const accessToken = generateToken(userData._id as string);

    // Generate Refresh Token (Store as HttpOnly cookie)
    const refreshToken = generateRefreshToken(userData._id as string);

    // Set refresh token in cookies (HttpOnly and Secure flags)
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,  // Prevent access to cookie via JavaScript
      secure: process.env.NODE_ENV === 'production',  // Secure flag for HTTPS in production
      maxAge: 60 * 60 * 24 * 7 * 1000,  // 7 days
      sameSite: 'strict'  // Restrict cross-site request handling
    });
    // we want to add max age 15 minutes for access token
    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 15 * 60 * 1000,
      sameSite: "strict",
    }
    )

    // Send response with access token and user data
    res.status(200).json({
      success: true,
      data: userData,
      message: "Login successful",
      token: accessToken,
    });
  }
);

export { registerUser, loginUser };
