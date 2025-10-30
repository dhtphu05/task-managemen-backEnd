import dotenv from 'dotenv';
import path from 'path';

// Luôn đọc .env ở thư mục bạn chạy lệnh (root BE nếu bạn chạy "pnpm dev" trong BE)
dotenv.config({ path: path.join(process.cwd(), '.env'), debug: true });

const get = (key: string, fallback?: string) => {
  const v = process.env[key] ?? fallback;
  if (v === undefined) throw new Error(`Missing env: ${key}`);
  return v;
};

export const env = {
  NODE_ENV: get('NODE_ENV', 'development'),
  PORT: Number(get('PORT', '4000')),
  ACCESS_TOKEN_SECRET: get('ACCESS_TOKEN_SECRET', 'dev-access-secret'),
  REFRESH_TOKEN_SECRET: get('REFRESH_TOKEN_SECRET', 'dev-refresh-secret'),
  ACCESS_TOKEN_EXPIRES_IN: get('ACCESS_TOKEN_EXPIRES_IN', '15m'),
  REFRESH_TOKEN_EXPIRES_IN: get('REFRESH_TOKEN_EXPIRES_IN', '7d'),
  DATABASE_URL: get('DATABASE_URL', 'postgres://postgres:postgres@localhost:5432/postgres'),
  GOOGLE_CLIENT_ID: get('GOOGLE_CLIENT_ID'),
  GOOGLE_CLIENT_SECRET: get('GOOGLE_CLIENT_SECRET'),
  GOOGLE_REDIRECT_URI: get('GOOGLE_REDIRECT_URI', 'http://localhost:4000/auth/google/callback'),
  FRONTEND_URL: get('FRONTEND_URL', 'http://localhost:5173'),
};
