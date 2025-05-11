// // src/routes/authRoutes.js
// import express from 'express';
// import { register, login, getProfile } from '../controllers/authController.js';
// import authMiddleware from '../middlewares/authMiddleware.js';

// const router = express.Router();

// // Public routes
// router.post('/register', register);
// router.post('/login',    login);

// // Protected route
// router.get('/profile', authMiddleware, getProfile);

// export default router;

// src/routes/authRoutes.js
import express from 'express';
import validateMiddleware from '../middlewares/validateMiddleware.js';
import {
  registerAdmin,
  verifyRegistration,
  loginAdmin,
  verifyLogin,
} from '../controllers/authController.js';

const router = express.Router();

// 1. Initiate admin registration (send OTP)
router.post(
  '/register-admin',
  validateMiddleware([
    { field: 'mobile', required: true, type: 'string' },
    { field: 'name',   required: true, type: 'string' },
    { field: 'email',  required: true, type: 'string' },
  ]),
  registerAdmin
);

// 2. Complete registration (verify OTP)
router.post(
  '/verify-registration',
  validateMiddleware([
    { field: 'mobile', required: true, type: 'string' },
    { field: 'code',   required: true, type: 'string' },
    { field: 'name',   required: true, type: 'string' },
    { field: 'email',  required: true, type: 'string' },
  ]),
  verifyRegistration
);

// 3. Initiate login (send OTP)
router.post(
  '/login',
  validateMiddleware([{ field: 'mobile', required: true, type: 'string' }]),
  loginAdmin
);

// 4. Complete login (verify OTP → issue JWT)
router.post(
  '/verify-login',
  validateMiddleware([
    { field: 'mobile', required: true, type: 'string' },
    { field: 'code',   required: true, type: 'string' },
  ]),
  verifyLogin
);

export default router;
