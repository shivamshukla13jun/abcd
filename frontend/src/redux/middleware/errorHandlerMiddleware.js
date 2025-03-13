// src/redux/middleware/errorHandlerMiddleware.js

const errorHandlerMiddleware = (store) => (next) => (action) => {
    try {
      // If it's a successful action or doesn't require handling, pass it along
      return next(action);
    } catch (err) {
      // Log the error to the console
      console.error("Caught an error:", err);
  
      // Define the error message
      const message = err?.message || 'An unexpected error occurred.';
  
      // If it's an API error response, you can further customize the message
      if (err.response) {
        return {
          type: 'error',
          message: 'API call failed! Please try again later.',
        };
      }
  
      // Return the error message for non-API errors
      return {
        type: 'error',
        message: message,
      };
    }
  };
  
  export default errorHandlerMiddleware;
  