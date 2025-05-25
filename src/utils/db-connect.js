import { query } from '../services/dbServices.js';
import { env } from '../config/db.js';

/**
 * Test initial connection on startup.
 */
export const connectDB = async () => {
  try {
    await query('SELECT 1');
    console.log(`✅ Connected to PostgreSQL (${env} database)`);
  } catch (err) {
    console.error('❌ Failed to connect to PostgreSQL', err);
    process.exit(1);
  }
};