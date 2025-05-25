// src/utils/shutdown.js
// import { closeDB } from '../config/dbConfig.js';

import { closeDB } from '../services/dbServices.js';

/**
 * Gracefully shuts down the server and database connections
 * @param {http.Server} server - The HTTP server instance
 * @param {string} signal - The shutdown signal received
 */
function shutdown(server, signal) {
  console.log(`\n⚙️  Received ${signal}. Shutting down gracefully...`);

  // Stop accepting new connections
  server.close(async (err) => {
    if (err) {
      console.error('❌ Error closing HTTP server:', err);
      process.exit(1);
    }
    console.log('✔️  HTTP server closed.');

    // Close DB connections
    try {
      await closeDB();
      console.log('✔️  Database connection closed.');
      process.exit(0);
    } catch (dbErr) {
      console.error('❌ Error closing database connection:', dbErr);
      process.exit(1);
    }
  });

  // Force exit if not closed within 30s
  setTimeout(() => {
    console.warn('⚠️  Could not close connections in time, forcing exit.');
    process.exit(1);
  }, 30000);
}

export default shutdown;