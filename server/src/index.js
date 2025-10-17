import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import profilesRouter from './routes/profiles.routes.js';
import volunteerHistoryRouter from './routes/volunteerHistory.routes.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

app.disable('etag');

app.use('/api', (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

app.use((req, _res, next) => {
  if (req.method === 'GET' && req.query) {
    for (const [k, v] of Object.entries(req.query)) {
      if (v === '') delete req.query[k];
    }
  }
  next();
});

app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/api/profiles', profilesRouter);
app.use('/api/volunteer-history', volunteerHistoryRouter);

app.use((_req, res) => res.status(404).json({ error: 'Not found' }));
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

export default app;