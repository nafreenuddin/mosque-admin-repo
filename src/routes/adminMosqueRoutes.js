// // src/routes/adminMosqueRoutes.js
// import express from 'express';
// import { createMosque, updateMosque, deleteMosque } from '../controllers/adminMosqueController.js';
// import authMiddleware from '../middlewares/authMiddleware.js';
// import adminMiddleware from '../middlewares/adminMiddleware.js';

// const router = express.Router();

// // Protect all admin-mosque routes
// router.use(authMiddleware, adminMiddleware);

// // Create a new mosque
// router.post('/', createMosque);

// // Update mosque by ID
// router.put('/:id', updateMosque);

// // Delete mosque by ID
// router.delete('/:id', deleteMosque);

// export default router;

// src/routes/adminMosqueRoutes.js
import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import backofficeAuth from "../middlewares/backofficeAuth.js";
import validateMiddleware from "../middlewares/validateMiddleware.js";
import {
  getFullMosqueDetails,
  getMyMosqueStatus,
  updateMosqueStatus,
   getMosqueProfile,
  getMosquePrayerTimings
} from "../controllers/adminMosqueController.js";

const router = express.Router();

// 1) Get the full mosque record (admin must be logged in)
router.get("/", authMiddleware, getFullMosqueDetails);

// 2) Get only status+flag+notes
router.get("/status", authMiddleware, getMyMosqueStatus);

// 3) Back-office: flip status & add review notes
router.put(
  "/status",
  backofficeAuth,
  validateMiddleware([
    { field: "status", required: true, type: "string" },
    { field: "review_notes", required: false, type: "string" },
  ]),
  updateMosqueStatus
);

router.get('/profile', getMosqueProfile);  //new
router.get('/prayer-times', getMosquePrayerTimings); // new


export default router;
