import { type Application } from 'express';
import { healthRoutes } from './healthRoutes.js';
import { authRoutes } from './authRoutes.js';
import { userRoutes } from './userRoutes.js';

export const setupRoutes = (app: Application): void => {
  // Health check routes
  app.use('/health', healthRoutes);
  
  // Auth routes
  app.use('/auth', authRoutes);
  
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
        auth: '/auth',
        users: '/users',
        docs: '/api-docs'
      }
    });
  });
};
