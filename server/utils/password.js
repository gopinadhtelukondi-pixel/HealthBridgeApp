import crypto from "crypto";

const ITERATIONS = 100000;
const KEY_LENGTH = 64;
const DIGEST = "sha512";

export const hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST)
    .toString("hex");

  return `${salt}:${hash}`;
};

export const verifyPassword = (password, storedHash) => {
  const [salt, originalHash] = storedHash.split(":");
  if (!salt || !originalHash) return false;

  const hash = crypto
    .pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST)
    .toString("hex");

  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(originalHash, "hex"));
};
