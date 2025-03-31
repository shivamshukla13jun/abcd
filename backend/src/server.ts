import dotenv from 'dotenv';
dotenv.config();

import express, { Express } from "express";
import cors from "cors";
import cookieParser from 'cookie-parser';
import connectDB from './config/database';
import rootRouter from './routes';
import { errorHandler, notFound } from './middlewares/error';
import { corsOptions } from './utils/CorsOptions';
import bodyParser from 'body-parser';

const app: Express = express();
const port = process.env.PORT;

// enable cors-origin
app.use(cors(corsOptions as Object));
// parse body
app.use(bodyParser.json());
// url encode to accept form-data
app.use(bodyParser.urlencoded({ extended: true }));

// parse cookies
app.use(cookieParser());

// api service
app.use(rootRouter)
// If no route is matched, use the notFound middleware
app.use(notFound);

// Global error handling middleware (must be last)
app.use(errorHandler as any);
// Health check route
app.get('/', (req, res) => {
    res.send('User Service is running!');
  });

// Connect to DB and start the server
connectDB().then(() => {
    app.listen(port, async() => {
      // await connectDB.authenticate();
      // await resetDatabase(connectDB)
      console.log(`User Service is listening on port ${port}`);
    });
  })
  .catch((err:any) => {
    console.error('Unable to connect to the database:', err);
  });
 