import CryptoJS from 'crypto-js';

/**
 * Derives an encryption key from the Firebase UID.
 * SECURITY WARNING: UIDs are not secrets. This is essentially obfuscation, not secure encryption.
 */
export const deriveKey = (uid) => {
  return CryptoJS.SHA256(uid).toString();
};

export const encryptData = (plainText, uid) => {
  const key = deriveKey(uid);
  return CryptoJS.AES.encrypt(plainText, key).toString();
};

export const decryptData = (cipherText, uid) => {
  try {
    const key = deriveKey(uid);
    const bytes = CryptoJS.AES.decrypt(cipherText, key);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error("Decryption failed", error);
    return null;
  }
};
