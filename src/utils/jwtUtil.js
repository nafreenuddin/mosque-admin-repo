// src/utils/jwtUtil.js

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;

if (!JWT_SECRET) {
  console.error('❌ JWT_SECRET is not set in .env');
  process.exit(1);
}

/**
 * Sign a payload into a JWT.
 * @param {Object} payload  Must include at least { adminId: string }
 * @returns {string} Signed JWT
 */
export function signJwt(payload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN || '1d',
  });
}

/**
 * Verify a JWT and return its payload.
 * @param {string} token
 * @returns {Object} The decoded payload (e.g. { adminId, iat, exp })
 * @throws {Error} If token is invalid or expired
 */
export function verifyJwt(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new Error('Invalid or expired token');
  }
}
