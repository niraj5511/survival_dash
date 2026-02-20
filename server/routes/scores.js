import { Router } from 'express';
import { executeQuery } from '../db/snowflake.js';

const router = Router();

// GET /api/scores — return the 10 most recent scores
router.get('/', async (_req, res) => {
  try {
    const rows = await executeQuery(`
      SELECT SCORE, PLAYED_AT, TIME_SURVIVED, OBJECTS_DODGED
      FROM SCORES
      ORDER BY PLAYED_AT DESC
      LIMIT 10
    `);

    const scores = rows.map((row) => ({
      score: row.SCORE,
      date: row.PLAYED_AT,
      timeSurvived: row.TIME_SURVIVED,
      objectsDodged: row.OBJECTS_DODGED,
    }));

    res.json({ scores });
  } catch (err) {
    console.error('[scores] GET error:', err.message);
    res.status(503).json({ error: 'Could not fetch scores from Snowflake' });
  }
});

// POST /api/scores — persist a new score
router.post('/', async (req, res) => {
  const { score, timeSurvived = 0, objectsDodged = 0 } = req.body;

  if (score === undefined || score === null) {
    return res.status(400).json({ error: 'score is required' });
  }

  try {
    await executeQuery(
      `INSERT INTO SCORES (SCORE, TIME_SURVIVED, OBJECTS_DODGED)
       VALUES (?, ?, ?)`,
      [score, timeSurvived, objectsDodged]
    );
    res.status(201).json({ success: true });
  } catch (err) {
    console.error('[scores] POST error:', err.message);
    res.status(503).json({ error: 'Could not save score to Snowflake' });
  }
});

export default router;
