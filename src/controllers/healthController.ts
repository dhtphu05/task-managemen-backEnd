import { type Request, type Response } from 'express';

export const healthController = {
  getHealthStatus(_req: Request, res: Response): void {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'task-management-api',
      version: '1.0.0'
    });
  }
};
