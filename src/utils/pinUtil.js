// src/utils/pinUtil.js
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

/**
 * Hash a 4-digit PIN. Reject if not exactly 4 digits.
 * @param {string} pin
 * @returns {Promise<string>} bcrypt hash
 */
export async function hashPin(pin) {
  if (!/^\d{4}$/.test(pin)) {
    throw new Error('PIN must be exactly 4 digits');
  }
  return bcrypt.hash(pin, SALT_ROUNDS);
}

/**
 * Compare a candidate PIN against its bcrypt hash.
 * @param {string} pin
 * @param {string} hash
 * @returns {Promise<boolean>}
 */
export function verifyPin(pin, hash) {
  return bcrypt.compare(pin, hash);
}
