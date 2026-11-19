
import express from 'express';
import { createAuthRouter } from '../server/authService.ts';
import { createScreen08Router } from '../server/screen08Grading.ts';
import {
  createPortalRouter,
  createStudentRouter
} from '../server/studentStateStore.ts';
import { createWritingRouter } from '../server/writingEvalService.ts';

const app = express();

app.set('trust proxy', 1);
app.use(express.json({ limit: '1mb' }));

app.use('/api/auth', createAuthRouter());
app.use('/api/student', createStudentRouter());
app.use('/api/portal', createPortalRouter());
app.use('/api/writing', createWritingRouter());
app.use('/api/screen08', createScreen08Router());

app.get('/api/health', (_req, res) => {
  res.status(200).json({
    ok: true,
    service: 'digital-detective-world-api'
  });
});

export default app;
