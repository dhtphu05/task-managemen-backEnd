import type { AuthenticatedUser } from './Auth.js';

declare module 'express-serve-static-core' {
  interface Request {
    /**
     * Authenticated user extracted from a verified access token.
     */
    user?: AuthenticatedUser;
  }
}
