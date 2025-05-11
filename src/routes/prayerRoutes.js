// src/routes/prayerRoutes.js

import express from 'express';
import {
  setPrayerTimings,
  getPrayerTimings,
} from '../controllers/prayerController.js';
import ensureApproved from '../middlewares/ensureApproved.js';



const router = express.Router({ mergeParams: true });

// Public: Get prayer timings for a mosque
router.get('/', getPrayerTimings);

// Protected: Create or update prayer timings (admin only)
router.put('/', ensureApproved, setPrayerTimings);

export default router;
