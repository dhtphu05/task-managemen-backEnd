import { pool } from './pool.js';

const createUsersTable = `
  CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );
`;

async function main(): Promise<void> {
  try {
    await pool.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto";');
    await pool.query(createUsersTable);
    console.log('✅ Database is ready');
  } catch (error) {
    console.error('❌ Failed to initialize database', error);
  } finally {
    await pool.end();
  }
}

void main();
