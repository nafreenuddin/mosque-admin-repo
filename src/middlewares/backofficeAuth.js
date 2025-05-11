// src/middlewares/backofficeAuth.js

import dotenv from 'dotenv';
dotenv.config();  // ensure .env is loaded here as well

/**
 * Back-office authentication middleware.
 * Verifies that the request includes a valid secret in the X-Backoffice-Secret header.
 */
export default function backofficeAuth(req, res, next) {
  const provided = req.headers['x-backoffice-secret'];
  const expected = process.env.BACKOFFICE_SECRET;

  console.log('🔐 BackofficeAuth:', { provided, expected });

  if (!provided) {
    return res.status(401).json({ error: 'Back-office secret missing' });
  }
  if (provided !== expected) {
    return res.status(403).json({ error: 'Invalid back-office secret' });
  }
  next();
}
