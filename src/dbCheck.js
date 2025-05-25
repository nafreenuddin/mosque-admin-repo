#!/usr/bin/env node
// src/dbCheck.js

import dotenv from 'dotenv';
dotenv.config();

import { query, closeDB } from './services/dbServices.js';
import { env }             from './config/db.js';

;(async () => {
  console.log('🔍 Checking DB connection...');
  try {
    await query('SELECT 1');
    console.log(`✅ Connected to PostgreSQL (${env})`);
  } catch (err) {
    console.error('❌ Failed to connect to PostgreSQL:', err);
    process.exit(1);
  } finally {
    try {
      await closeDB();
    } catch (closeErr) {
      console.error('❌ Error closing DB connection:', closeErr);
      process.exit(1);
    }
  }
})();
