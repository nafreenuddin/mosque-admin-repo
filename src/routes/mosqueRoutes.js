// File: src/routes/mosqueRoutes.js
import express from "express";
import {
  createMosque,
  listMosques,
  getMosqueById,
  updateMosque,
  updateProfileInfo,
  upsertStatus,
  completeMosque // ← make sure this is imported
} from "../controllers/mosqueController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import ensureApproved from "../middlewares/ensureApproved.js";
import backofficeAuth from "../middlewares/backofficeAuth.js";
import validateMiddleware from "../middlewares/validateMiddleware.js";
import {
  updateStatus, // ← your controller fn
} from "../controllers/mosqueController.js";
// import { updatePrayerTimings } from '../controllers/prayerController.js';

const router = express.Router();

// Public routes
router.get("/", listMosques);
router.get("/:id", getMosqueById);

// Authenticated admin routes
router.post(
  "/",
  authMiddleware,
  validateMiddleware([
    { field: "name", required: true, type: "string" },
    { field: "address_line", required: true, type: "string" },
    { field: "city", required: true, type: "string" },
    { field: "country", required: true, type: "string" },
    { field: "latitude", required: true, type: "number" },
    { field: "longitude", required: true, type: "number" },
  ]),
  createMosque
);
// 2) Read a mosque by its ID (public)
router.get(
  '/:mosqueId',
  getMosqueById
);

router.put(
  "/:id",
  authMiddleware,
  validateMiddleware([
    { field: "name", required: false, type: "string" },
    { field: "address_line", required: false, type: "string" },
    { field: "city", required: false, type: "string" },
    { field: "country", required: false, type: "string" },
    { field: "latitude", required: false, type: "number" },
    { field: "longitude", required: false, type: "number" },
    { field: "profile_completed", required: false, type: "boolean" },
  ]),
  updateMosque
);

// Profile-setup routes (only after approval)
router.put(
  "/:id/profile",
  authMiddleware,
  ensureApproved,
  validateMiddleware([
    { field: "description", required: false, type: "string" },
    { field: "contact_phone", required: false, type: "string" },
    { field: "facilityIds", required: true, type: "object" },
  ]),
  updateProfileInfo
);

// // Mark profile completed
// router.put(
//   "/:id/complete-profile",
//   authMiddleware,
//   ensureApproved,
//   completeProfile // ← route handler
// );

// Back-office status update
router.put(
  "/:id/status",
  backofficeAuth,
  validateMiddleware([
    { field: "status", required: true, type: "string" },
    { field: "review_notes", required: false, type: "string" },
  ]),
  upsertStatus
);
// Back-office status update
router.put(
  "/:id/status",
  backofficeAuth,
  validateMiddleware([
    { field: "status", required: true, type: "string" },
    { field: "review_notes", required: false, type: "string" },
  ]),
  upsertStatus
);
router.put(
  "/:id/status",
  backofficeAuth,
  validateMiddleware([
    { field: "status", required: true, type: "string" },
    { field: "review_notes", required: false, type: "string" },
  ]),
  updateStatus // ← calls controller.updateStatus
);

router.put(
  '/:mosqueId',
  authMiddleware,
  validateMiddleware([
    { field: 'name',         required: false, type: 'string' },
    { field: 'address_line', required: false, type: 'string' },
    { field: 'city',         required: false, type: 'string' },
    { field: 'country',      required: false, type: 'string' },
    { field: 'latitude',     required: false, type: 'number' },
    { field: 'longitude',    required: false, type: 'number' },
  ]),
  updateMosque
);


// router.put(
//   '/:mosqueId/prayer-times',
//   authMiddleware,
//   ensureApproved,
//   validateMiddleware([
//     { field: 'fajr',    required: true, type: 'string' },
//     { field: 'dhuhr',   required: true, type: 'string' },
//     { field: 'asr',     required: true, type: 'string' },
//     { field: 'maghrib', required: true, type: 'string' },
//     { field: 'isha',    required: true, type: 'string' },
//   ]),
//   updatePrayerTimings
// );

router.post(
  '/:mosqueId/complete',
  authMiddleware,
  ensureApproved,
  completeMosque
);

export default router;
