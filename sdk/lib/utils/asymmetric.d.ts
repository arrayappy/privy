declare function generateKeypair(passphrase: string): {
    privateKeyPem: string;
    publicKeyPem: string;
};
declare function encrypt(text: Buffer, publicKeyPem: string): string;
declare function decrypt(encryptedText: string, privateKeyPem: string): Buffer;
export { generateKeypair, encrypt, decrypt };
