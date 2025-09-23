import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Task Management API',
            version: '1.0.0',
            description: 'API docs for S-GROUP Task Management Backend',
        },
        servers: [{ url: 'http://localhost:4000', description: 'Local' }],
    },
    // Quét toàn bộ file router trong src/api để lấy JSDoc @openapi
    apis: ['src/api/**/*.ts'],
};
const specs = swaggerJsdoc(options);
export const openAPIRouter = Router();
openAPIRouter.use('/', swaggerUi.serve, swaggerUi.setup(specs));
//# sourceMappingURL=openAPIRouter.js.map