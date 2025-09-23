import { type Request, type Response, type NextFunction } from 'express';
import { type ZodSchema } from 'zod';
import { fail } from '../utils/http.js';

export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (error: any) {
      res.status(400).json(fail(error.message || 'Validation error'));
    }
  };
};

export const validateParams = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.params);
      next();
    } catch (error: any) {
      res.status(400).json(fail(error.message || 'Invalid parameters'));
    }
  };
};

export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.query);
      next();
    } catch (error: any) {
      res.status(400).json(fail(error.message || 'Invalid query parameters'));
    }
  };
};
