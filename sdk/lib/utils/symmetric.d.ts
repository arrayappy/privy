declare function symmetricExtendKey(key: string, length: number): Buffer;
declare function encrypt(data: Buffer, key: Buffer, iv: Buffer): string;
declare function decrypt(encryptedData: string, key: Buffer, iv: Buffer): Buffer;
export { symmetricExtendKey, encrypt, decrypt };
