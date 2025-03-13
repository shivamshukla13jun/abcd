// Augment Express Request interface to include custom error fields
declare global {
  namespace Express {
    interface Request {
      customErrorFields?: Record<string, string>;
    }
  }
}

// Export to ensure the module is treated as a module
export {};
