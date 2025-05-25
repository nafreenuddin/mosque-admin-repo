// src/services/dbServices.js
import { Pool } from 'pg';
import { dbConfig } from '../config/db.js';

const pool = new Pool(dbConfig);

/**
 * Run a parameterized SQL query.
 * @param {string} text
 * @param {any[]} [params]
 * @returns {Promise<QueryResult>}
 */
export function query(text, params = []) {
  return pool.query(text, params);
}

/**
 * Gracefully close the pool.
 */
export async function closeDB() {
  await pool.end();
  console.log('🔒 PostgreSQL pool has closed');
}
