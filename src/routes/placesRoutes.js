import express from 'express';
import { getNearbyMosques } from '../controllers/placesController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// e.g. GET /api/v1/places/nearby?lat=..&lng=..
router.get(
  '/nearby',
  authMiddleware,
  getNearbyMosques
);

export default router;
