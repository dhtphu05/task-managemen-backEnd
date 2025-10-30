import { Router, type IRouter } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Task Management API',
      version: '1.0.0',
      description: 'API documentation for S-GROUP Task Management Backend',
      contact: {
        name: 'S-Group Development Team',
        email: 'dev@s-group.com'
      }
    },
    servers: [
      { 
        url: 'http://localhost:4000', 
        description: 'Development server' 
      }
    ],
    tags: [
      {
        name: 'Health',
        description: 'Health check endpoints'
      },
      {
        name: 'Users', 
        description: 'User management endpoints'
      },
      {
        name: 'Workspaces',
        description: 'Workspace CRUD operations'
      },
      {
        name: 'Projects',
        description: 'Project CRUD operations'
      },
      {
        name: 'Boards',
        description: 'Board CRUD operations'
      }
    ]
  },
  // Quét toàn bộ file routes và controllers để lấy JSDoc @openapi
  apis: [
    'src/routes/**/*.ts',
    'src/controllers/**/*.ts'
  ],
};

const specs = swaggerJsdoc(options);

export const swaggerRouter: IRouter = Router();

// Swagger UI setup
swaggerRouter.use('/', swaggerUi.serve);
swaggerRouter.get('/', swaggerUi.setup(specs, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'S-Group API Docs'
}));

// Raw JSON endpoint
swaggerRouter.get('/json', (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(specs);
});
