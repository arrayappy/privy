"use strict";
// import { compSymEnc, decompSymDec, compAsymEnc, decompAsymDec } from "./utils/helpers";
// import asymmetric from "./utils/asymmetric"; // generateDeterministicKeyPair
// import symmetric from "./utils/symmetric"; // extendKey
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import crypto from "crypto"; // Import the crypto module
// // Data to be encrypted
// const data = "This is a secret message";
// // Symmetric Encryption/Decryption Example
// const key = symmetric.extendKey("my_secret_key", 16); // Extend key to 16 bytes for AES-128
// const iv = crypto.randomBytes(16); // Initialization vector
// const symEncryptedData = compSymEnc(data, key, iv);
// console.log("Symmetrically Encrypted Data:", symEncryptedData);
// const symDecryptedData = decompSymDec(symEncryptedData, key, iv);
// console.log("Symmetrically Decrypted Data:", symDecryptedData);
// // Asymmetric Encryption/Decryption Example
// const passphrase = "my_secret_passphrase";
// const { privateKeyPem, publicKeyPem } = asymmetric.generateDeterministicKeyPair(passphrase);
// console.log(privateKeyPem, publicKeyPem)
// const asymEncryptedData = compAsymEnc(data, publicKeyPem);
// console.log("Asymmetrically Encrypted Data:", asymEncryptedData);
// const asymDecryptedData = decompAsymDec(asymEncryptedData, privateKeyPem);
// console.log("Asymmetrically Decrypted Data:", asymDecryptedData);
const helpers_1 = require("./utils/helpers");
const asymmetric = __importStar(require("./utils/asymmetric")); // generateDeterministicKeyPair
const symmetric = __importStar(require("./utils/symmetric")); // extendKey
const crypto_1 = __importDefault(require("crypto")); // Import the crypto module
// Example usage
// Data to be encrypted
const data = "Import the crypto moduleThis is a secret message Asymmetrically Encrypted Data my_secret_passphrase Import the crypto module SHould have do";
// Symmetric Encryption/Decryption Example
const key = symmetric.symmetricExtendKey("my_secret_key", 16); // Extend key to 16 bytes for AES-128
const iv = crypto_1.default.randomBytes(16); // Initialization vector
const symEncryptedData = (0, helpers_1.compSymEnc)(data, key, iv);
console.log("Symmetrically Encrypted Data:", symEncryptedData);
const symDecryptedData = (0, helpers_1.decompSymDec)(symEncryptedData, key, iv);
console.log("Symmetrically Decrypted Data:", symDecryptedData);
// Asymmetric Encryption/Decryption Example
const passphrase = "my_secret_passphrase";
const { privateKeyPem, publicKeyPem } = asymmetric.generateKeypair(passphrase);
const asymEncryptedData = (0, helpers_1.compAsymEnc)(data, publicKeyPem);
console.log("Asymmetrically Encrypted Data:", asymEncryptedData);
const asymDecryptedData = (0, helpers_1.decompAsymDec)(asymEncryptedData, privateKeyPem);
console.log("Asymmetrically Decrypted Data:", asymDecryptedData);
