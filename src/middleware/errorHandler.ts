import { type Request, type Response, type NextFunction } from 'express';
import { fail } from '../utils/http.js';

export const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('Error:', error.message);
  console.error('Stack:', error.stack);
  
  res.status(500).json(fail('Internal server error'));
};

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json(fail(`Route ${req.method} ${req.path} not found`));
};
