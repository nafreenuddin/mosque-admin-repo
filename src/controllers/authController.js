// // src/controllers/authController.js
// import AdminModel   from '../models/adminModel.js';
// import adminService from '../services/adminService.js';

// /**
//  * POST /api/v1/auth/register-admin
//  * → generate & return OTP (no JWT yet)
//  */
// export async function registerAdmin(req, res, next) {
//   try {
//     const { mobile, name, email } = req.body;

//     if (await AdminModel.findByMobile(mobile)) {
//       return res.status(409).json({ error: 'Mobile already registered' });
//     }
//     if (await AdminModel.findByEmail(email)) {
//       return res.status(409).json({ error: 'Email already registered' });
//     }

//     const otp = adminService.requestOtp(mobile);
//     return res.json({ success: true, otp });
//   } catch (err) {
//     next(err);
//   }
// }

// /**
//  * POST /api/v1/auth/verify-registration
//  * → validate OTP, create admin account (no JWT)
//  */
// export async function verifyRegistration(req, res, next) {
//   try {
//     const { mobile, code, name, email } = req.body;
//     adminService.validateOtp(mobile, code);
//     await AdminModel.create({ mobile, name, email });
//     return res.json({ success: true, message: 'Registration complete—please log in.' });
//   } catch (err) {
//     return res.status(400).json({ error: err.message });
//   }
// }

// /**
//  * POST /api/v1/auth/login
//  * → generate & return OTP (no JWT)
//  */
// export async function loginAdmin(req, res, next) {
//   try {
//     const { mobile } = req.body;
//     const admin = await AdminModel.findByMobile(mobile);
//     if (!admin) {
//       return res.status(404).json({ error: 'No account for this mobile' });
//     }
//     const otp = adminService.requestOtp(mobile);
//     return res.json({ success: true, otp });
//   } catch (err) {
//     next(err);
//   }
// }

// /**
//  * POST /api/v1/auth/verify-login
//  * → validate OTP, issue JWT
//  */
// export async function verifyLogin(req, res, next) {
//   try {
//     const { mobile, code } = req.body;
//     adminService.validateOtp(mobile, code);

//     const admin = await AdminModel.findByMobile(mobile);
//     const token = adminService.issueJwt(admin.id);
//     return res.json({ success: true, token });
//   } catch (err) {
//     return res.status(400).json({ error: err.message });
//   }
// }

// src/controllers/authController.js
import AdminModel from '../models/adminModel.js';
import adminService from '../services/adminService.js';
import { hashPin, verifyPin } from '../utils/pinUtil.js';

/**
 * POST /api/v1/auth/register-admin
 * → generate & return OTP
 */
export async function registerAdmin(req, res, next) {
  try {
    const { mobile, name, email } = req.body;
    if (await AdminModel.findByMobile(mobile)) {
      return res.status(409).json({ error: 'Mobile already registered' });
    }
    if (await AdminModel.findByEmail(email)) {
      return res.status(409).json({ error: 'Email already registered' });
    }
    const otp = adminService.requestOtp(mobile);
    return res.json({ success: true, otp });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/v1/auth/verify-registration
 * → validate OTP, create admin with hashed PIN
 */
export async function verifyRegistration(req, res, next) {
  try {
    const { mobile, code, name, email, pin, pinConfirm } = req.body;

    // 1) Verify OTP
    adminService.validateOtp(mobile, code);

    // 2) PIN and confirmation must match
    if (pin !== pinConfirm) {
      return res.status(400).json({ error: 'PIN and PIN confirmation do not match' });
    }

    // 3) Hash the PIN
    const pin_hash = await hashPin(pin);

    // 4) Persist the new admin
    await AdminModel.create({ mobile, name, email, pin_hash });

    return res.json({
      success: true,
      message: 'Registration complete. Please log in with your PIN.'
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

/**
 * POST /api/v1/auth/login
 * → mobile  PIN → issue JWT
 */
export async function loginWithPin(req, res, next) {
  try {
    const { mobile, pin } = req.body;
    const admin = await AdminModel.findByMobile(mobile);

    if (!admin) {
      return res.status(404).json({ error: 'No account found for this mobile' });
    }

    // 1) Verify PIN
    const ok = await verifyPin(pin, admin.pin_hash);
    if (!ok) {
      return res.status(401).json({ error: 'Invalid PIN' });
    }

    // 2) Issue JWT
    const token = adminService.issueJwt(admin.id);
    return res.json({ success: true, token });
  } catch (err) {
    next(err);
  }
}


/**
 * POST /api/v1/auth/request-pin-reset
 * → send OTP so the admin can reset their PIN
 */
export async function requestPinReset(req, res, next) {
  try {
    const { mobile } = req.body;
    const admin = await AdminModel.findByMobile(mobile);
    if (!admin) {
      return res.status(404).json({ error: 'No admin with that mobile' });
    }
    const otp = adminService.requestOtp(mobile);
    return res.json({ success: true, otp });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/v1/auth/verify-pin-reset
 * → verify OTP, then set & hash the new 4-digit PIN
 */
export async function verifyPinReset(req, res, next) {
  try {
    const { mobile, code, newPin, newPinConfirm } = req.body;

    // 1) Verify OTP
    adminService.validateOtp(mobile, code);

    // 2) Confirm PIN match
    if (newPin !== newPinConfirm) {
      return res.status(400).json({ error: 'PIN and confirmation do not match' });
    }

    // 3) Hash and persist
    const pin_hash = await hashPin(newPin);
    const admin = await AdminModel.findByMobile(mobile);
    await AdminModel.update(admin.id, {
      pin_hash,
      failed_pin_attempts: 0,
      is_locked: false
    });

    return res.json({ success: true, message: 'PIN has been reset' });
  } catch (err) {
    next(err);
  }
}