import dotenv from 'dotenv';
import { connectDB, closeDB } from './config/dbConfig.js';

dotenv.config();

(async () => {
  console.log('🔍 Checking DB connection...');
  try {
    await connectDB();
    console.log('✅ DB connection OK');
  } catch (err) {
    console.error('❌ DB connection failed:', err);
    process.exit(1);
  } finally {
    await closeDB();
  }
})();
