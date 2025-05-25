// src/config/db.js
import dotenv from 'dotenv';
dotenv.config();

export const env = process.env.NODE_ENV || 'development';

function getConnectionString() {
  if (env === 'test')       return process.env.TEST_DB_URL;
  if (env === 'production') return process.env.PROD_DB_URL;
  return process.env.DEV_DB_URL;
}

const connectionString = getConnectionString();
if (!connectionString) {
  console.error(
    `❌ Missing DB URL for NODE_ENV="${env}".\n` +
    `Please set ${
      env === 'production'
        ? 'PROD_DB_URL'
        : env === 'test'
        ? 'TEST_DB_URL'
        : 'DEV_DB_URL'
    } in your .env`
  );
  process.exit(1);
}

export const dbConfig = {
  connectionString,
  ssl: env === 'production' ? { rejectUnauthorized: false } : false
};
