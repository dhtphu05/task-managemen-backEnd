import { type Request, type Response, type NextFunction } from 'express';
import { authService } from '../services/authService.js';
import { userService } from '../services/userService.js';
import { ok, fail } from '../utils/http.js';
import { passport } from '../config/passport.js';
import { env } from '../config/env.js';
import type { User } from '../types/User.js';

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
  googleCallback(req: Request, res: Response, next: NextFunction): void {
    passport.authenticate('google', { session: false }, (error: any, user?: User | false) => {
      const fallbackBase = env.FRONTEND_URL.replace(/\/+$/, '');
      const fallbackCallback = `${fallbackBase}/react-app/oauth/callback`;
      const requestedCallback =
        typeof req.query.redirect_uri === 'string' && req.query.redirect_uri.length > 0
          ? req.query.redirect_uri
          : fallbackCallback;

      const buildRedirectUrl = (searchParams: Record<string, string | undefined>): string => {
        const url = new URL(requestedCallback);
        const params = url.searchParams;
        Object.entries(searchParams).forEach(([key, value]) => {
          if (value !== undefined && value !== '') {
            params.set(key, value);
          }
        });
        url.search = params.toString();
        return url.toString();
      };

      if (error) {
        const errorMessage = error.message ?? 'Google authentication failed';
        res.redirect(buildRedirectUrl({ error: errorMessage }));
        return;
      }

      if (!user) {
        res.redirect(buildRedirectUrl({ error: 'Google authentication failed' }));
        return;
      }

      const tokens = authService.generateTokensForUser(user);
      const redirectPath = typeof req.query.redirect === 'string' ? req.query.redirect : undefined;

      res.redirect(
        buildRedirectUrl({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          redirect: redirectPath,
        })
      );
    })(req, res, next);
  },
  googleFailure(_req: Request, res: Response): void {
    res.status(401).json(fail('Google authentication failed'));
  },
};
