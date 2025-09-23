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
};
