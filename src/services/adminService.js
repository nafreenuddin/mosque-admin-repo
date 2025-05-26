
// // src/services/adminService.js

// import { signJwt } from '../utils/jwtUtil.js';

// class AdminService {
//   constructor() {
//     this.otpStore   = new Map();
//     this.OTP_TTL_MS = 5 * 60 * 1000;
//   }

//   generateOtp(mobile) {
//     const code = Math.floor(100000 + Math.random() * 900000).toString();
//     this.otpStore.set(mobile, {
//       code,
//       expiresAt: Date.now() + this.OTP_TTL_MS,
//     });
//     return code;
//   }

//   /** Request an OTP (no DB side-effects) */
//   requestOtp(mobile) {
//     return this.generateOtp(mobile);
//   }

//   /** Validate OTP only; throws if invalid */
//   validateOtp(mobile, code) {
//     const rec = this.otpStore.get(mobile);
//     if (!rec) throw new Error('OTP not found. Please request a new one.');
//     if (Date.now() > rec.expiresAt) {
//       this.otpStore.delete(mobile);
//       throw new Error('OTP expired. Please request a new one.');
//     }
//     if (rec.code !== code) throw new Error('Invalid OTP.');
//     this.otpStore.delete(mobile);
//   }
//   async findByAdminId(adminId) {
//     // Should query WHERE created_by_admin = adminId
//     return MosqueModel.findByAdminId(adminId);
//   }

//   /** Issue JWT for an existing admin */
//   issueJwt(adminId) {
//     return signJwt({ adminId });
//   }
// }

// export default new AdminService();


// src/services/adminService.js

import AdminModel from '../models/adminModel.js';
import otpService from './otpService.js';           // your OTP send/verify logic
import { hashPin, comparePin } from '../utils/hash.js';
import { signJwt } from '../utils/jwtUtil.js';

class AdminService {
  /**
   * Step 1: Request registration OTP.
   */
  async requestRegistrationOtp({ mobile, email, name }) {
    // 1) Prevent duplicates
    if (await AdminModel.findByMobile(mobile)) {
      throw new Error('Mobile already registered');
    }
    if (await AdminModel.findByEmail(email)) {
      throw new Error('Email already registered');
    }
    // 2) Send OTP
    await otpService.sendRegistrationOtp(mobile);
    return { success: true };
  }

  /**
   * Step 2: Verify registration OTP, hash PIN, create admin.
   */
  async verifyRegistration({ mobile, otp, name, email, pin }) {
    // 1) Validate OTP
    const valid = await otpService.verifyRegistrationOtp(mobile, otp);
    if (!valid) throw new Error('Invalid or expired OTP');

    // 2) Hash PIN
    const pinHash = await hashPin(pin);

    // 3) Create admin record
    const admin = await AdminModel.create({
      mobile,
      email,
      name,
      pin_hash: pinHash
    });

    return admin;
  }

  /**
   * PIN‐based login: verify PIN, return JWT.
   */
  async loginPin({ mobile, pin }) {
    const admin = await AdminModel.findByMobile(mobile);
    if (!admin) throw new Error('Invalid mobile or PIN');

    const match = await comparePin(pin, admin.pin_hash);
    if (!match) throw new Error('Invalid mobile or PIN');

    return signJwt({ adminId: admin.id });
  }

  /**
   * Step 1 for PIN reset: request a reset‐OTP.
   */
  async requestPinResetOtp(mobile) {
    const admin = await AdminModel.findByMobile(mobile);
    if (!admin) throw new Error('Mobile not found');
    await otpService.sendPinResetOtp(mobile);
    return { success: true };
  }

  /**
   * Step 2 for PIN reset: verify OTP and set new PIN.
   */
  async resetPin({ mobile, otp, pin }) {
    const valid = await otpService.verifyPinResetOtp(mobile, otp);
    if (!valid) throw new Error('Invalid or expired OTP');

    const pinHash = await hashPin(pin);
    await AdminModel.updatePinHashByMobile(mobile, pinHash);
    return { success: true };
  }

  /** Helpers: */
  async findByMobile(mobile) {
    return AdminModel.findByMobile(mobile);
  }
  async findByEmail(email) {
    return AdminModel.findByEmail(email);
  }
  async updatePinHash(id, pinHash) {
    return AdminModel.updatePinHash(id, pinHash);
  }
  async updatePinHashByMobile(mobile, pinHash) {
    return AdminModel.updatePinHashByMobile(mobile, pinHash);
  }
}

export default new AdminService();
