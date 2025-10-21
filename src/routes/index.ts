import { type Application } from 'express';
import { healthRoutes } from './healthRoutes.js';
import { authRoutes } from './authRoutes.js';
import { userRoutes } from './userRoutes.js';
import { workspaceRoutes } from './workspaceRoutes.js';
import { projectRoutes } from './projectRoutes.js';
import { boardRoutes } from './boardRoutes.js';

export const setupRoutes = (app: Application): void => {
  // Health check routes
  app.use('/health', healthRoutes);
  
  // Auth routes
  app.use('/auth', authRoutes);
  
  // User routes
  app.use('/users', userRoutes);
  
  // Workspace routes
  app.use('/workspaces', workspaceRoutes);

  // Project routes
  app.use('/projects', projectRoutes);

  // Board routes
  app.use('/boards', boardRoutes);
  
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
        workspaces: '/workspaces',
        projects: '/projects',
        boards: '/boards',
        docs: '/api-docs'
      }
    });
  });
};
