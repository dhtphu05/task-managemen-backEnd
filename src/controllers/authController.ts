import { type Request, type Response } from 'express';
import { authService } from '../services/authService.js';
import { userService } from '../services/userService.js';
import { ok, fail } from '../utils/http.js';

export const authController = {
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { user, tokens } = await authService.login(req.body);
      res.json(ok({ user, ...tokens }));
    } catch (error: any) {
      res.status(401).json(fail(error.message ?? 'Invalid credentials'));
    }
  },

  async refresh(req: Request, res: Response): Promise<void> {
    try {
      const tokens = await authService.refresh(req.body);
      res.json(ok(tokens));
    } catch (error: any) {
      res.status(401).json(fail(error.message ?? 'Invalid refresh token'));
    }
  },

  async logout(req: Request, res: Response): Promise<void> {
    try {
      await authService.logout(req.body);
      res.json(ok({ message: 'Logged out' }));
    } catch (error: any) {
      res.status(400).json(fail(error.message ?? 'Invalid refresh token'));
    }
  },

  async me(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json(fail('Unauthorized'));
        return;
      }

      const user = await userService.getUserById(userId);

      if (!user) {
        res.status(404).json(fail('User not found'));
        return;
      }

      res.json(ok(user));
    } catch (error) {
      res.status(500).json(fail('Internal server error'));
    }
  },
};
