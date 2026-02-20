const API_BASE = '/api';

// Save a score to Snowflake via the Express API.
// Silently returns false on failure so the game is never blocked.
export const saveScoreToSnowflake = async ({ score, timeSurvived, objectsDodged }) => {
  try {
    const res = await fetch(`${API_BASE}/scores`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ score, timeSurvived, objectsDodged }),
    });
    return res.ok;
  } catch {
    console.warn('[apiService] Could not save score to Snowflake (server offline?)');
    return false;
  }
};

// Fetch the 10 most recent scores from Snowflake.
// Returns null if the API is unreachable so callers can fall back to localStorage.
export const fetchScoresFromSnowflake = async () => {
  try {
    const res = await fetch(`${API_BASE}/scores`);
    if (!res.ok) return null;
    const { scores } = await res.json();
    return scores;
  } catch {
    console.warn('[apiService] Could not fetch scores from Snowflake (server offline?)');
    return null;
  }
};
