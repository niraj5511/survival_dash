import snowflake from 'snowflake-sdk';

let connection = null;
let isConnected = false;

// Initialise and connect to Snowflake
export const connectToSnowflake = () => {
  connection = snowflake.createConnection({
    account: process.env.SNOWFLAKE_ACCOUNT,
    username: process.env.SNOWFLAKE_USERNAME,
    password: process.env.SNOWFLAKE_PASSWORD,
    warehouse: process.env.SNOWFLAKE_WAREHOUSE,
    database: process.env.SNOWFLAKE_DATABASE,
    schema: process.env.SNOWFLAKE_SCHEMA,
  });

  return new Promise((resolve, reject) => {
    connection.connect((err) => {
      if (err) {
        console.error('[Snowflake] Connection failed:', err.message);
        reject(err);
      } else {
        isConnected = true;
        console.log('[Snowflake] Connected successfully');
        resolve();
      }
    });
  });
};

// Run a parameterised SQL statement
export const executeQuery = (sql, binds = []) => {
  if (!isConnected) {
    return Promise.reject(new Error('Snowflake is not connected'));
  }

  return new Promise((resolve, reject) => {
    connection.execute({
      sqlText: sql,
      binds,
      complete: (err, _stmt, rows) => {
        if (err) reject(err);
        else resolve(rows);
      },
    });
  });
};

// Create the SCORES table if it doesn't exist yet
export const ensureSchema = async () => {
  await executeQuery(`
    CREATE TABLE IF NOT EXISTS SCORES (
      ID          NUMBER AUTOINCREMENT PRIMARY KEY,
      SCORE       NUMBER        NOT NULL,
      PLAYED_AT   TIMESTAMP_LTZ DEFAULT CURRENT_TIMESTAMP(),
      TIME_SURVIVED NUMBER      DEFAULT 0,
      OBJECTS_DODGED NUMBER     DEFAULT 0
    )
  `);
  console.log('[Snowflake] Schema ready');
};
