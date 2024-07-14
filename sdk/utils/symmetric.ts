import crypto from "crypto";

function symmetricExtendKey(key: string, length: number): Buffer {
    return Buffer.from(key.repeat(Math.ceil(length / key.length)).slice(0, length));
}

function encrypt(data: Buffer, key: Buffer, iv: Buffer): string {
    let cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
    let encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
    return encrypted.toString('base64');
}

function decrypt(encryptedData: string, key: Buffer, iv: Buffer): Buffer {
    let decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
    let decrypted = Buffer.concat([decipher.update(Buffer.from(encryptedData, 'base64')), decipher.final()]);
    return decrypted;
}

export {
    symmetricExtendKey,
    encrypt,
    decrypt
}
