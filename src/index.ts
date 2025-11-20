import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import projectRoutes from './routes/projects';
import { authMiddleware } from './middleware/auth';
import { rateLimiter, authLimiter } from './middleware/ratelimit';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use(rateLimiter);
app.use('/auth', authLimiter, authRoutes);
app.use('/projects', authMiddleware, projectRoutes);

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});