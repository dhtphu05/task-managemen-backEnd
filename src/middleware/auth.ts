import { type Request, type Response, type NextFunction } from 'express';
import { authService } from '../services/authService.js';
import { fail } from '../utils/http.js';

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    res.status(401).json(fail('Missing bearer token'));
    return;
  }

  const token = authorization.slice('Bearer '.length).trim();

  if (!token) {
    res.status(401).json(fail('Missing bearer token'));
    return;
  }

  try {
    const user = authService.verifyAccessToken(token);
    req.user = user;
    next();
  } catch (error: any) {
    res.status(401).json(fail(error.message ?? 'Invalid access token'));
  }
};
