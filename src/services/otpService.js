// src/services/otpService.js

class OTPService {
  constructor() {
    // In-memory store: key = `${type}:${mobile}`, value = { code, expiresAt }
    this.otpMap = new Map();
    this.TTL_MS = 5 * 60 * 1000; // 5 minutes
  }

  // --- Public API ---

  /** Send a registration OTP to this mobile. */
  async sendRegistrationOtp(mobile) {
    return this._sendOtp(mobile, 'registration', 'Your registration OTP is ');
  }

  /** Verify a registration OTP; returns true/false. */
  async verifyRegistrationOtp(mobile, code) {
    return this._verifyOtp(mobile, 'registration', code);
  }

  /** Send a PIN‐reset OTP to this mobile. */
  async sendPinResetOtp(mobile) {
    return this._sendOtp(mobile, 'pin_reset', 'Your PIN reset OTP is ');
  }

  /** Verify a PIN‐reset OTP; returns true/false. */
  async verifyPinResetOtp(mobile, code) {
    return this._verifyOtp(mobile, 'pin_reset', code);
  }

  // --- Internal helpers ---

  _key(mobile, type) {
    return `${type}:${mobile}`;
  }

  _generateCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  _sendOtp(mobile, type, messagePrefix) {
    const code = this._generateCode();
    const expiresAt = Date.now() + this.TTL_MS;
    this.otpMap.set(this._key(mobile, type), { code, expiresAt });

    // TODO: replace console.log with real SMS integration
    console.log(
      `${messagePrefix}${code} (valid for ${this.TTL_MS / 60000} minutes)`
    );

    return code;
  }

  _verifyOtp(mobile, type, code) {
    const rec = this.otpMap.get(this._key(mobile, type));
    if (!rec) return false;

    if (Date.now() > rec.expiresAt) {
      this.otpMap.delete(this._key(mobile, type));
      return false;
    }

    if (rec.code !== code) return false;

    // one‐time use
    this.otpMap.delete(this._key(mobile, type));
    return true;
  }
}

export default new OTPService();
