import express from 'express';
import 'dotenv/config';
const app = express();

app.use(express.json());

// mount your routers, e.g.
// import profilesRouter from './routes/profiles.js';
// if (profilesRouter) app.use('/api/profiles', profilesRouter);

app.get('/health', (req, res) => res.json({ ok: true }));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

export default app;

//DELETE THIS FILE TO RUN SERVER