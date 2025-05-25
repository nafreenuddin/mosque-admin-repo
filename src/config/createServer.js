
// src/config/createServer.js
import http from 'http';
import app from '../app.js';

/**
 * Creates and starts the HTTP server
 * @returns {http.Server} The HTTP server instance
 */
async function createServer() {
  const PORT = process.env.PORT || 3000;
  const server = http.createServer(app);
  
  return new Promise((resolve, reject) => {
    try {
      server.listen(PORT, () => {
        console.log(`🚀 Server listening on port ${PORT}`);
        resolve(server);
      });
      
      server.on('error', (error) => {
        console.error('❌ Server error:', error);
        reject(error);
      });
    } catch (err) {
      reject(err);
    }
  });
}

export default createServer;