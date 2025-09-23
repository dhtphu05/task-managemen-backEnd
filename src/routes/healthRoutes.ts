import { Router, type IRouter } from 'express';
import { healthController } from '../controllers/healthController.js';

export const healthRoutes: IRouter = Router();

/**
 * @openapi
 * /health:
 *   get:
 *     tags: [Health]
 *     summary: Health check endpoint
 *     description: Returns the health status of the API
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "ok"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-09-21T12:34:56.000Z"
 *                 service:
 *                   type: string
 *                   example: "task-management-api"
 *                 version:
 *                   type: string
 *                   example: "1.0.0"
 */
healthRoutes.get('/', healthController.getHealthStatus);
