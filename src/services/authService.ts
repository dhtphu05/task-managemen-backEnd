import jwt, { type JwtPayload, type Secret, type SignOptions } from 'jsonwebtoken';
import { z } from 'zod';
import { env } from '../config/env.js';
import { userModel } from '../models/userModel.js';
import { type User } from '../types/User.js';
import { type AuthTokens, type AuthenticatedUser } from '../types/Auth.js';

const loginSchema = z.object({
  email: z.string().email(),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(1),
});

const activeRefreshTokens = new Map<string, string>();

const assertJwtPayload = (decoded: string | JwtPayload): JwtPayload => {
  if (typeof decoded === 'string') {
    throw new Error('Invalid token payload');
  }
  return decoded;
};

const accessTokenSecret: Secret = env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret: Secret = env.REFRESH_TOKEN_SECRET;

const accessTokenOptions: SignOptions = {
  expiresIn: env.ACCESS_TOKEN_EXPIRES_IN,
};

const refreshTokenOptions: SignOptions = {
  expiresIn: env.REFRESH_TOKEN_EXPIRES_IN,
};

const issueTokens = (user: User): AuthTokens => {
  const accessToken = jwt.sign(
    { sub: user.id, email: user.email },
    accessTokenSecret,
    accessTokenOptions
  );

  const refreshToken = jwt.sign(
    { sub: user.id },
    refreshTokenSecret,
    refreshTokenOptions
  );

  activeRefreshTokens.set(refreshToken, user.id);

  return { accessToken, refreshToken };
};

const removeRefreshToken = (token: string): void => {
  activeRefreshTokens.delete(token);
};

export const authService = {
  async login(input: unknown): Promise<{ user: User; tokens: AuthTokens }> {
    const { email } = loginSchema.parse(input);
    const user = await userModel.findByEmail(email);

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const tokens = issueTokens(user);
    return { user, tokens };
  },

  async refresh(input: unknown): Promise<AuthTokens> {
    const { refreshToken } = refreshSchema.parse(input);
    const storedUserId = activeRefreshTokens.get(refreshToken);

    if (!storedUserId) {
      throw new Error('Invalid refresh token');
    }

    let payload: JwtPayload;
    try {
      payload = assertJwtPayload(jwt.verify(refreshToken, refreshTokenSecret));
    } catch (error) {
      removeRefreshToken(refreshToken);
      throw new Error('Invalid refresh token');
    }

    const userId = payload.sub;

    if (!userId || typeof userId !== 'string') {
      removeRefreshToken(refreshToken);
      throw new Error('Invalid refresh token payload');
    }

    if (storedUserId !== userId) {
      removeRefreshToken(refreshToken);
      throw new Error('Refresh token mismatch');
    }

    const user = await userModel.findById(userId);

    if (!user) {
      removeRefreshToken(refreshToken);
      throw new Error('User not found');
    }

    removeRefreshToken(refreshToken);
    return issueTokens(user);
  },

  async logout(input: unknown): Promise<void> {
    const { refreshToken } = refreshSchema.parse(input);
    removeRefreshToken(refreshToken);
  },

  verifyAccessToken(token: string): AuthenticatedUser {
    const payload = assertJwtPayload(jwt.verify(token, accessTokenSecret));

    const userId = payload.sub;
    const email = payload.email;

    if (!userId || typeof userId !== 'string') {
      throw new Error('Invalid access token payload');
    }

    if (!email || typeof email !== 'string') {
      throw new Error('Invalid access token payload');
    }

    return { id: userId, email };
  },
};
