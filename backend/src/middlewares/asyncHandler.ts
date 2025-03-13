import { Request, Response, NextFunction } from "express";

// Type alias for a function that returns a Promise<void>
export type PromiseVoid = Promise<void>;

// This helper wraps an async function (an Express route handler) so that it returns Promise<void>
// and automatically catches any errors, passing them to next().
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => PromiseVoid
) => {
  return (req: Request, res: Response, next: NextFunction): PromiseVoid => {
    return fn(req, res, next).catch(next);
  };
};
