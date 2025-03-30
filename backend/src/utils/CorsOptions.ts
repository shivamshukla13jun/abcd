import { NextFunction, Request } from "express";
import { AppError } from "../middlewares/error";

// Define allowed origins
const allowedOrigins = [
    'http://localhost:5173',  // Allow this URL
    'http://localhost:5174',  // Allow this URL
    'http://192.168.168.7:5173',  // Allow this URL
    'http://192.168.168.7:5174',  // Allow this URL
    'http://192.168.1.2:5174',  // Allow this URL
    'https://another-client-url.com', // You can add more URLs here
  ];
  
  // CORS configuration
  const corsOptions = {
    origin: (origin:string, callback:Function) => {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true); // Allow the request
      } else {
        callback(new Error('Not allowed by CORS')); // Block the request
      }
    },
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  };

  export {corsOptions}