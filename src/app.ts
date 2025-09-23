import express, { type Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { setupRoutes } from './routes/index.js';
import { swaggerRouter } from './docs/swaggerConfig.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

export const app: Application = express();

// Security middleware
app.use(helmet());
app.use(cors());

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup all routes
setupRoutes(app);

// API Documentation
app.use('/api-docs', swaggerRouter);

// Error handling middleware (must be last)
app.use(notFoundHandler);
app.use(errorHandler);
