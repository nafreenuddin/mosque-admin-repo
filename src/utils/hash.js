import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export function hashPin(plain) {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

export function comparePin(plain, hash) {
  return bcrypt.compare(plain, hash);
}
