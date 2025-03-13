import dotenv from 'dotenv';
dotenv.config();

import express, { Express } from "express";
import cors from "cors";
import cookieParser from 'cookie-parser';
import sequelize from './config/database';
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
sequelize().then(() => {
    app.listen(port, async() => {
      // await sequelize.authenticate();
      // await resetDatabase(sequelize)
      console.log(`User Service is listening on port ${port}`);
    });
  })
  .catch((err:any) => {
    console.error('Unable to connect to the database:', err);
  });
  // import { QueryTypes } from 'sequelize';
  
  // (async () => {
  //   try {
  //     // Fetch all non-primary indexes
  //     const results = await sequelize.query<{ index_name: string }>(`
  //       SELECT index_name
  //       FROM information_schema.statistics
  //       WHERE table_schema = DATABASE()
  //         AND table_name = 'users'
  //         AND 
  //  != 'PRIMARY';
  //     `, { type: QueryTypes.SELECT });
  
  //     // Drop each index
  //     for (const result of results) {
  //       await sequelize.query(`ALTER TABLE users DROP INDEX ${result.index_name};`);
  //       console.log(`Dropped index: ${result.index_name}`);
  //     }
  
  //     console.log('All non-primary indexes removed successfully.');
  //   } catch (error) {
  //     console.error('Error removing indexes:', error);
  //   } finally {
  //     await sequelize.close();
  //   }
  // })();