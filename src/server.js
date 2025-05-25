// src/server.js

import http from "http";
import dotenv from "dotenv";
import app from "./app.js";
// import { connectDB } from "./config/dbConfig.js";

import { connectDB } from './utils/db-connect.js';
import shutdown from "./utils/shutdown.js";
import createServer from "./config/createServer.js";

dotenv.config();

const PORT = process.env.PORT;
const server = http.createServer(app);

/** Start the server after DB connection */
async function start() {
  try {
    await connectDB();
    // server.listen(PORT, () => {
    //   console.log(`🚀 Server listening on port ${PORT}`);
    // });
    const server = await createServer();

    ["SIGINT", "SIGTERM"].forEach((sig) => {
      process.on(sig, () => shutdown(server, sig));
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
}
start();

/** Graceful shutdown handler */
// function shutdown(signal) {
//   console.log(`\n⚙️  Received ${signal}. Shutting down gracefully...`);

//   // Stop accepting new connections
//   server.close(async (err) => {
//     if (err) {
//       console.error('❌ Error closing HTTP server:', err);
//       process.exit(1);
//     }
//     console.log('✔️  HTTP server closed.');

//     // Close DB connections
//     try {
//       await closeDB();
//       console.log('✔️  Database connection closed.');
//       process.exit(0);
//     } catch (dbErr) {
//       console.error('❌ Error closing database connection:', dbErr);
//       process.exit(1);
//     }
//   });

//   // Force exit if not closed within 30s
//   setTimeout(() => {
//     console.warn('⚠️  Could not close connections in time, forcing exit.');
//     process.exit(1);
//   }, 30000);
// }

// Listen for termination signals
// ['SIGINT', 'SIGTERM'].forEach((sig) => {
//   process.on(sig, () => shutdown(sig));
// });
