import 'reflect-metadata';
import { app } from './app.js';
import { env } from './config/env.js';
import { AppDataSource } from './db/dataSource.js';

const startServer = async (): Promise<void> => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log('📦 Database connected');
    }

    app.listen(env.PORT, () => {
      console.log(`🚀 Server running on port ${env.PORT}`);
      console.log(`📚 API docs: http://localhost:${env.PORT}/api-docs`);
    });
  } catch (error) {
    console.error('❌ Failed to start server', error);
    process.exit(1);
  }
};

void startServer();
