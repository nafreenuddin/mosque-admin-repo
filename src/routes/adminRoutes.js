import express from "express";
import validateMiddleware from "../middlewares/validateMiddleware.js";
import {
  registerAdmin,
  verifyRegister,
  loginAdmin,
  verifyLogin,
} from "../controllers/adminController.js";
import { getMyMosque } from '../controllers/adminController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { getMyMosqueStatus } from '../controllers/adminController.js';

const router = express.Router();

// Validation rules
const validateRegister = validateMiddleware([
  { field: "mobile", required: true, type: "string" },
  { field: "name", required: true, type: "string" },
  { field: "email", required: true, type: "string" },
]);
const validateLogin = validateMiddleware([
  { field: "mobile", required: true, type: "string" },
]);
const validateVerifyRegister = validateMiddleware([
  { field: "mobile", required: true, type: "string" },
  { field: "code", required: true, type: "string" },
  { field: "name", required: true, type: "string" },
  { field: "email", required: true, type: "string" },
]);
const validateVerifyLogin = validateMiddleware([
  { field: "mobile", required: true, type: "string" },
  { field: "code", required: true, type: "string" },
]);

// Registration flow
router.post("/register", validateRegister, registerAdmin);
router.post("/verify-register", validateVerifyRegister, verifyRegister);

// Login flow
router.post("/login", validateLogin, loginAdmin);
router.post("/verify-login", validateVerifyLogin, verifyLogin);
router.get("/my-mosque", authMiddleware, getMyMosque);
 // NEW: fetch the logged-in admin’s mosque status + approval flag
 router.get(
  '/mosque/status',
  authMiddleware,
  getMyMosqueStatus
);

export default router;
