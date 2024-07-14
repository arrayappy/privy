"use strict";
// import forge from "node-forge";
// import crypto from "crypto";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateKeypair = generateKeypair;
exports.encrypt = encrypt;
exports.decrypt = decrypt;
// function generateKeypair(passphrase: string) {
//     const salt = 'fixed_salt_for_deterministic_generation';
//     const seed = crypto.createHash('sha256').update(passphrase).update(salt).digest();
//     const prng = forge.random.createInstance();
//     prng.seedFileSync = () => forge.util.createBuffer(seed.toString('binary'));
//     const keypair = forge.pki.rsa.generateKeyPair({ bits: 512, prng: prng });
//     return {
//         privateKeyPem: forge.pki.privateKeyToPem(keypair.privateKey),
//         publicKeyPem: forge.pki.publicKeyToPem(keypair.publicKey)
//     };
// }
// function encrypt(text: Buffer, publicKeyPem: string): string {
//     const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
//     const aesKey = forge.random.getBytesSync(16);
//     const encryptedKey = publicKey.encrypt(aesKey, 'RSA-OAEP', {
//         md: forge.md.sha1.create(),
//         mgf1: forge.mgf.mgf1.create(forge.md.sha1.create())
//     });
//     const cipher = forge.cipher.createCipher('AES-ECB', aesKey);
//     cipher.start();
//     cipher.update(forge.util.createBuffer(text.toString('binary')));
//     cipher.finish();
//     const encrypted = forge.util.createBuffer();
//     encrypted.putBytes(encryptedKey);
//     encrypted.putBytes(cipher.output.getBytes());
//     return forge.util.encode64(encrypted.getBytes());
// }
// function decrypt(encryptedText: string, privateKeyPem: string): Buffer {
//     const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
//     const encrypted = forge.util.createBuffer(forge.util.decode64(encryptedText));
//     const encryptedKey = encrypted.getBytes(privateKey.n.bitLength() / 8);
//     const ciphertext = encrypted.getBytes(encrypted.length());
//     const aesKey = privateKey.decrypt(encryptedKey, 'RSA-OAEP', {
//         md: forge.md.sha1.create(),
//         mgf1: forge.mgf.mgf1.create(forge.md.sha1.create())
//     });
//     const decipher = forge.cipher.createDecipher('AES-ECB', aesKey);
//     decipher.start();
//     decipher.update(forge.util.createBuffer(ciphertext, 'binary'));
//     const pass = decipher.finish();
//     if (pass) {
//         return Buffer.from(decipher.output.getBytes(), 'binary');
//     } else {
//         throw new Error('Decryption failed');
//     }
// }
// export {
//     generateKeypair,
//     encrypt,
//     decrypt
// }
const node_forge_1 = __importDefault(require("node-forge"));
const crypto_1 = __importDefault(require("crypto"));
function generateKeypair(passphrase) {
    const salt = 'fixed_salt_for_deterministic_generation';
    const seed = crypto_1.default.createHash('sha256').update(passphrase).update(salt).digest();
    const prng = node_forge_1.default.random.createInstance();
    prng.seedFileSync = () => seed.toString('hex');
    const keypair = node_forge_1.default.pki.rsa.generateKeyPair({ bits: 512, prng: prng });
    return {
        privateKeyPem: node_forge_1.default.pki.privateKeyToPem(keypair.privateKey),
        publicKeyPem: node_forge_1.default.pki.publicKeyToPem(keypair.publicKey)
    };
}
function encrypt(text, publicKeyPem) {
    const publicKey = node_forge_1.default.pki.publicKeyFromPem(publicKeyPem);
    const aesKey = node_forge_1.default.random.getBytesSync(16);
    const encryptedKey = publicKey.encrypt(aesKey, 'RSA-OAEP', {
        md: node_forge_1.default.md.sha1.create(),
        mgf1: node_forge_1.default.mgf.mgf1.create(node_forge_1.default.md.sha1.create())
    });
    const cipher = node_forge_1.default.cipher.createCipher('AES-ECB', aesKey);
    cipher.start();
    cipher.update(node_forge_1.default.util.createBuffer(text.toString('binary')));
    cipher.finish();
    const encrypted = node_forge_1.default.util.createBuffer();
    encrypted.putBytes(encryptedKey);
    encrypted.putBytes(cipher.output.getBytes());
    return node_forge_1.default.util.encode64(encrypted.getBytes());
}
function decrypt(encryptedText, privateKeyPem) {
    const privateKey = node_forge_1.default.pki.privateKeyFromPem(privateKeyPem);
    const encrypted = node_forge_1.default.util.createBuffer(node_forge_1.default.util.decode64(encryptedText));
    const encryptedKey = encrypted.getBytes(privateKey.n.bitLength() / 8);
    const ciphertext = encrypted.getBytes();
    const aesKey = privateKey.decrypt(encryptedKey, 'RSA-OAEP', {
        md: node_forge_1.default.md.sha1.create(),
        mgf1: node_forge_1.default.mgf.mgf1.create(node_forge_1.default.md.sha1.create())
    });
    const decipher = node_forge_1.default.cipher.createDecipher('AES-ECB', aesKey);
    decipher.start();
    decipher.update(node_forge_1.default.util.createBuffer(ciphertext));
    const pass = decipher.finish();
    if (pass) {
        return Buffer.from(decipher.output.getBytes(), 'binary');
    }
    else {
        throw new Error('Decryption failed');
    }
}
