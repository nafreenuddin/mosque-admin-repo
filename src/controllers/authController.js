// src/controllers/authController.js
import AdminModel   from '../models/adminModel.js';
import adminService from '../services/adminService.js';

/**
 * POST /api/v1/auth/register-admin
 * → generate & return OTP (no JWT yet)
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
 * → validate OTP, create admin account (no JWT)
 */
export async function verifyRegistration(req, res, next) {
  try {
    const { mobile, code, name, email } = req.body;
    adminService.validateOtp(mobile, code);
    await AdminModel.create({ mobile, name, email });
    return res.json({ success: true, message: 'Registration complete—please log in.' });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

/**
 * POST /api/v1/auth/login
 * → generate & return OTP (no JWT)
 */
export async function loginAdmin(req, res, next) {
  try {
    const { mobile } = req.body;
    const admin = await AdminModel.findByMobile(mobile);
    if (!admin) {
      return res.status(404).json({ error: 'No account for this mobile' });
    }
    const otp = adminService.requestOtp(mobile);
    return res.json({ success: true, otp });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/v1/auth/verify-login
 * → validate OTP, issue JWT
 */
export async function verifyLogin(req, res, next) {
  try {
    const { mobile, code } = req.body;
    adminService.validateOtp(mobile, code);

    const admin = await AdminModel.findByMobile(mobile);
    const token = adminService.issueJwt(admin.id);
    return res.json({ success: true, token });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}
