import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import 'dotenv/config';
import profilesRouter from './routes/profiles.routes.js';

const app = express();
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

// 🧩 ADD THIS middleware BEFORE routes
// It removes empty-string query values so Zod validation doesn't fail
app.use((req, _res, next) => {
  if (req.method === 'GET' && req.query) {
    for (const [k, v] of Object.entries(req.query)) {
      if (v === '') delete req.query[k];
    }
  }
  next();
});

// ✅ Your routes go here
app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/api/profiles', profilesRouter);

// 404 + error handler
app.use((_req, res) => res.status(404).json({ error: 'Not found' }));
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API on http://localhost:${PORT}`));
