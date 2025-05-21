// utils/hash.js
// utils/hash.js
import { createHash, randomBytes } from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Genera un salt aleatorio con la longitud definida en el archivo .env
 * @returns {string} salt
 */
export function getSalt() {
  const size = parseInt(process.env.SALT_SIZE) || 10;
  return randomBytes(size).toString('hex').substring(0, size);
}

/**
 * Genera un hash SHA-256 a partir de un salt y una contraseña
 * @param {string} password - La contraseña en texto plano
 * @param {string} salt - El salt a utilizar
 * @returns {string} hash
 */
export function hashPassword(password, salt) {
  return createHash('sha256').update(salt + password).digest('hex');
}

