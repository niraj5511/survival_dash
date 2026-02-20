-- Run this manually in Snowflake if you need to set up the table outside of the server.
-- The Express server will also run this automatically on startup via ensureSchema().

CREATE TABLE IF NOT EXISTS SCORES (
  ID             NUMBER AUTOINCREMENT PRIMARY KEY,
  SCORE          NUMBER        NOT NULL,
  PLAYED_AT      TIMESTAMP_LTZ DEFAULT CURRENT_TIMESTAMP(),
  TIME_SURVIVED  NUMBER        DEFAULT 0,
  OBJECTS_DODGED NUMBER        DEFAULT 0
);
