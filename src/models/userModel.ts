import { query, pool } from '../db/pool.js';
import { type User } from '../types/User.js';

interface UserRow {
  id: string;
  name: string;
  email: string;
  created_at: Date | string;
}

const toUser = (row: UserRow): User => ({
  id: row.id,
  name: row.name,
  email: row.email,
  createdAt: new Date(row.created_at),
});

export const userModel = {
  async findAll(): Promise<User[]> {
    const rows = await query<UserRow>(
      'SELECT id, name, email, created_at FROM users ORDER BY created_at DESC'
    );
    return rows.map(toUser);
  },

  async findByEmail(email: string): Promise<User | undefined> {
    const result = await query<UserRow>(
      'SELECT id, name, email, created_at FROM users WHERE LOWER(email) = LOWER($1) LIMIT 1',
      [email]
    );
    const [row] = result;
    if (!row) return undefined;
    return toUser(row);
  },

  async create(data: { name: string; email: string }): Promise<User> {
    const existing = await userModel.findByEmail(data.email);
    if (existing) {
      throw new Error('Email already exists');
    }

    const result = await pool.query<UserRow>(
      `INSERT INTO users (name, email)
       VALUES ($1, $2)
       RETURNING id, name, email, created_at`,
      [data.name, data.email]
    );
    const row = result.rows[0];
    if (!row) {
      throw new Error('Failed to create user');
    }
    return toUser(row);
  },

  async findById(id: string): Promise<User | undefined> {
    const result = await query<UserRow>(
      'SELECT id, name, email, created_at FROM users WHERE id = $1 LIMIT 1',
      [id]
    );
    const [row] = result;
    if (!row) return undefined;
    return toUser(row);
  },

  async update(id: string, data: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User | null> {
    const fields: string[] = [];
    const values: unknown[] = [];

    if (data.name !== undefined) {
      fields.push(`name = $${fields.length + 1}`);
      values.push(data.name);
    }

    if (data.email !== undefined) {
      fields.push(`email = $${fields.length + 1}`);
      values.push(data.email);
    }

    if (fields.length === 0) {
      const current = await userModel.findById(id);
      return current ?? null;
    }

    values.push(id);

    const result = await pool.query<UserRow>(
      `UPDATE users
       SET ${fields.join(', ')}
       WHERE id = $${values.length}
       RETURNING id, name, email, created_at`,
      values
    );

    const row = result.rows[0];
    return row ? toUser(row) : null;
  },

  async delete(id: string): Promise<boolean> {
    const result = await pool.query('DELETE FROM users WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  },
};
