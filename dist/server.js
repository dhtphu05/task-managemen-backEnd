import { app } from './app.js';
import { env } from './config/env.js';
app.listen(env.PORT, () => {
    console.log(`🚀 Server running on port ${env.PORT}`);
    console.log(`📚 API docs: http://localhost:${env.PORT}/api-docs`);
});
//# sourceMappingURL=server.js.map