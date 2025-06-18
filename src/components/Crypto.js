// src/components/Crypto.js
import CryptoJS from "crypto-js";
import { CRYPTO_HASH } from "../config";

export const encrypt = (text) => {
  return CryptoJS.AES.encrypt(text, CRYPTO_HASH).toString();
};

export const decrypt = (cipherText) => {
  const bytes = CryptoJS.AES.decrypt(cipherText, CRYPTO_HASH);
  return bytes.toString(CryptoJS.enc.Utf8);
};

