// src/routes/placesRoutes.js

import express from 'express';
import { getNearbyMosquesController } from '../controllers/placesController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public or protected — here we require auth so only logged-in admins can call it:
router.get(
  '/nearby',
  authMiddleware,
  getNearbyMosquesController
);

export default router;
