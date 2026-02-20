import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectToSnowflake, ensureSchema } from './db/snowflake.js';
import scoresRouter from './routes/scores.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/scores', scoresRouter);

// Health check
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

// Start server then connect to Snowflake
app.listen(PORT, async () => {
  console.log(`[server] API running on http://localhost:${PORT}`);

  try {
    await connectToSnowflake();
    await ensureSchema();
  } catch (err) {
    console.error('[server] Snowflake setup failed — fill in your credentials in .env');
    console.error('         Score saves/fetches will return 503 until connected.');
  }
});
