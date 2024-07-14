// import { compSymEnc, decompSymDec, compAsymEnc, decompAsymDec } from "./utils/helpers";
// import asymmetric from "./utils/asymmetric"; // generateDeterministicKeyPair
// import symmetric from "./utils/symmetric"; // extendKey

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

import { compSymEnc, decompSymDec, compAsymEnc, decompAsymDec } from "./utils/helpers";
import * as asymmetric from "./utils/asymmetric"; // generateDeterministicKeyPair
import * as symmetric from "./utils/symmetric"; // extendKey
import crypto from "crypto"; // Import the crypto module

// Example usage

// Data to be encrypted
const data = "Import the crypto moduleThis is a secret message Asymmetrically Encrypted Data my_secret_passphrase Import the crypto module SHould have do";

// Symmetric Encryption/Decryption Example
const key = symmetric.symmetricExtendKey("my_secret_key", 16); // Extend key to 16 bytes for AES-128
const iv = crypto.randomBytes(16); // Initialization vector

const symEncryptedData = compSymEnc(data, key, iv);
console.log("Symmetrically Encrypted Data:", symEncryptedData);

const symDecryptedData = decompSymDec(symEncryptedData, key, iv);
console.log("Symmetrically Decrypted Data:", symDecryptedData);

// Asymmetric Encryption/Decryption Example
const passphrase = "my_secret_passphrase";
const { privateKeyPem, publicKeyPem } = asymmetric.generateKeypair(passphrase);

const asymEncryptedData = compAsymEnc(data, publicKeyPem);
console.log("Asymmetrically Encrypted Data:", asymEncryptedData);

const asymDecryptedData = decompAsymDec(asymEncryptedData, privateKeyPem);
console.log("Asymmetrically Decrypted Data:", asymDecryptedData);
