import { type Application } from 'express';
import { healthRoutes } from './healthRoutes.js';
import { userRoutes } from './userRoutes.js';

export const setupRoutes = (app: Application): void => {
  // Health check routes
  app.use('/health', healthRoutes);
  
  // User routes
  app.use('/users', userRoutes);
  
  // Root endpoint
  app.get('/', (_req, res) => {
    res.json({ 
      ok: true, 
      service: 'task-management-api',
      version: '1.0.0',
      endpoints: {
        health: '/health',
        users: '/users',
        docs: '/api-docs'
      }
    });
  });
};
