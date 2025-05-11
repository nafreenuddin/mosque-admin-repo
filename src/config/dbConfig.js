// src/config/dbConfig.js
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const {
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  NODE_ENV,
} = process.env;

if (!DB_HOST || !DB_PORT || !DB_USER || !DB_PASSWORD || !DB_NAME) {
  console.error(
    '❌ Missing database configuration. Please set DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, and DB_NAME in .env'
  );
  process.exit(1);
}

const poolConfig = {
  host: DB_HOST,
  port: parseInt(DB_PORT, 10),
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  ...(NODE_ENV === 'production' && { ssl: { rejectUnauthorized: false } }),
};

const pool = new Pool(poolConfig);

/**
 * Test initial connection on startup.
 */
export async function connectDB() {
  try {
    await pool.query('SELECT 1');
    console.log('✅ Connected to PostgreSQL');
  } catch (err) {
    console.error('❌ Failed to connect to PostgreSQL', err);
    process.exit(1);
  }
}

/**
 * Execute a SQL query.
 * @param {string} text SQL text (with $1, $2 placeholders)
 * @param {any[]} [params] Optional array of parameter values
 */
export function query(text, params) {
  return pool.query(text, params);
}

/**
 * Gracefully close the pool.
 */
export async function closeDB() {
  await pool.end();
  console.log('🔒 PostgreSQL pool has closed');
}
