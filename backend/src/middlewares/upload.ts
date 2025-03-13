import { Request, Response, NextFunction } from 'express';
import multer, { FileFilterCallback } from 'multer';
import { AppError } from './error';

// Define allowed MIME types
const allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf'];

// File filter function
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error(`Invalid file type. Allowed types: ${allowedMimeTypes.join(', ')}`));
  }
};

// Configure Multer storage
const storage = multer.memoryStorage(); // Store files in memory

// Initialize Multer with options
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5, // Limit file size to 5MB per file
    files: 5, // Limit the number of files to 5
  },
});

// Middleware to handle multi-file upload and form validation
const uploadMiddleware = (fields: { name: string; maxCount?: number }[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Use Multer to handle the file upload
    upload.fields(fields)(req, res, (err: any) => {
      if (err) {
        // Handle Multer errors
        if (err instanceof multer.MulterError) {
          // Multer-specific errors (e.g., file size exceeded, too many files)
          throw new AppError(err.message, 400);
        } else if (err) {
          // Other errors (e.g., invalid file type)
            throw new AppError(err.message, 400);
        }
      }

      

      // If no errors, proceed to the next middleware
      next();
    });
  };
};

export default uploadMiddleware;