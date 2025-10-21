import { DataSource } from 'typeorm';
import { env } from '../config/env.js';
import { Workspace } from '../entities/Workspace.js';
import { Project } from '../entities/Project.js';
import { Board } from '../entities/Board.js';

const shouldUseSSL = env.NODE_ENV === 'production';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: env.DATABASE_URL,
  entities: [Workspace, Project, Board],
  synchronize: env.NODE_ENV !== 'production',
  logging: env.NODE_ENV === 'development',
  ssl: shouldUseSSL ? { rejectUnauthorized: false } : false,
});
