
// src/services/adminService.js

import { signJwt } from '../utils/jwtUtil.js';

class AdminService {
  constructor() {
    this.otpStore   = new Map();
    this.OTP_TTL_MS = 5 * 60 * 1000;
  }

  generateOtp(mobile) {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    this.otpStore.set(mobile, {
      code,
      expiresAt: Date.now() + this.OTP_TTL_MS,
    });
    return code;
  }

  /** Request an OTP (no DB side-effects) */
  requestOtp(mobile) {
    return this.generateOtp(mobile);
  }

  /** Validate OTP only; throws if invalid */
  validateOtp(mobile, code) {
    const rec = this.otpStore.get(mobile);
    if (!rec) throw new Error('OTP not found. Please request a new one.');
    if (Date.now() > rec.expiresAt) {
      this.otpStore.delete(mobile);
      throw new Error('OTP expired. Please request a new one.');
    }
    if (rec.code !== code) throw new Error('Invalid OTP.');
    this.otpStore.delete(mobile);
  }
  async findByAdminId(adminId) {
    // Should query WHERE created_by_admin = adminId
    return MosqueModel.findByAdminId(adminId);
  }

  /** Issue JWT for an existing admin */
  issueJwt(adminId) {
    return signJwt({ adminId });
  }
}

export default new AdminService();
