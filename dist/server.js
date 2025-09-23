import express, {} from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { healthCheckRouter } from './api/healthCheck/healthCheckRouter.js';
import { userRouter } from './api/user/userRouter.js';
import { openAPIRouter } from './api-docs/openAPIRouter.js';
export const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use('/health', healthCheckRouter);
app.use('/users', userRouter);
app.use('/api-docs', openAPIRouter);
app.get('/', (_req, res) => res.json({ ok: true, service: 'task-management-be' }));
//# sourceMappingURL=server.js.map