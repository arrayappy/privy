import crypto from "crypto";
import * as asymmetric from "./asymmetric";
import * as symmetric from "./symmetric";
import * as compression from "./compression";

function compSymEnc(data: string, key: Buffer, iv: Buffer): string {
  const compressedData = compression.compress(data);
  const encryptedData = symmetric.encrypt(compressedData, key, iv);
  return encryptedData;
}

function decompSymDec(encryptedData: string, key: Buffer, iv: Buffer): string {
  const decryptedData = symmetric.decrypt(encryptedData, key, iv);
  const decompressedData = compression.decompress(decryptedData);
  return decompressedData;
}

function compAsymEnc(data: string, publicKey: string): string {
  const compressedData = compression.compress(data);
  const encryptedData = asymmetric.encrypt(compressedData, publicKey);
  return encryptedData;
}

function decompAsymDec(encryptedData: string, privateKey: string): string {
  const decryptedData = asymmetric.decrypt(encryptedData, privateKey);
  const decompressedData = compression.decompress(decryptedData);
  return decompressedData;
}

function getPasswordSalt(password: string): string {
  return crypto.createHash('md5').update(password).digest('hex');
}

export {
  compSymEnc,
  decompSymDec,
  compAsymEnc,
  decompAsymDec,
  getPasswordSalt
}
