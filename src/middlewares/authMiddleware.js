// src/middlewares/authMiddleware.js

import { verifyJwt } from '../utils/jwtUtil.js';

/**
 * Protects routes by validating a JWT in the Authorization header.
 * On success, attaches `req.adminId` from the token payload.
 */
export default function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization header missing' });
    }

    const [scheme, token] = authHeader.split(' ');
    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({ error: 'Invalid authorization format' });
    }

    // Verify token and extract payload
    const payload = verifyJwt(token);
    // Attach adminId to the request for downstream handlers
    req.adminId = payload.adminId;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}
