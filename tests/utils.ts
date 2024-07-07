
const crypto = require('crypto');
const zlib = require('zlib');

function extendKey(key, length) {
    return Buffer.from(key.repeat(Math.ceil(length / key.length)).slice(0, length));
}

function compressData(data) {
    return zlib.brotliCompressSync(Buffer.from(data));
}

function decompressData(data) {
    return zlib.brotliDecompressSync(data).toString('utf8');
}

function encrypt(data, key, iv) {
    let cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
    let encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
    return encrypted.toString('base64');
}

function decrypt(encryptedData, key, iv) {
    let decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
    let decrypted = Buffer.concat([decipher.update(Buffer.from(encryptedData, 'base64')), decipher.final()]);
    return decrypted;
}

function compressAndEncrypt(data, key, iv) {
  const compressedData = compressData(data);
  const encryptedData = encrypt(compressedData, key, iv);
  return encryptedData;
}

function decompressAndDecrypt(encryptedData, key, iv) {
  const decryptedData = decrypt(encryptedData, key, iv);
  const decompressedData = decompressData(decryptedData);
  return decompressedData;
}

module.exports = {
  extendKey,
  compressAndEncrypt,
  decompressAndDecrypt
}