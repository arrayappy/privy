import forge from "node-forge";
import crypto from "crypto";

function generateKeypair(passphrase: string) {
    const salt = 'fixed_salt_for_deterministic_generation';
    const seed = crypto.createHash('sha256').update(passphrase).update(salt).digest();
    const prng = forge.random.createInstance();
    prng.seedFileSync = () => seed.toString('hex');
    const keypair = forge.pki.rsa.generateKeyPair({ bits: 512, prng: prng });
    return {
        privateKeyPem: forge.pki.privateKeyToPem(keypair.privateKey),
        publicKeyPem: forge.pki.publicKeyToPem(keypair.publicKey)
    };
}

function encrypt(text: Buffer, publicKeyPem: string): string {
    const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
    const aesKey = forge.random.getBytesSync(16);
    const encryptedKey = publicKey.encrypt(aesKey, 'RSA-OAEP', {
        md: forge.md.sha1.create(),
        mgf1: forge.mgf.mgf1.create(forge.md.sha1.create())
    });
    const cipher = forge.cipher.createCipher('AES-ECB', aesKey);
    cipher.start();
    cipher.update(forge.util.createBuffer(text.toString('binary')));
    cipher.finish();
    const encrypted = forge.util.createBuffer();
    encrypted.putBytes(encryptedKey);
    encrypted.putBytes(cipher.output.getBytes());
    return forge.util.encode64(encrypted.getBytes());
}

function decrypt(encryptedText: string, privateKeyPem: string): Buffer {
    const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
    const encrypted = forge.util.createBuffer(forge.util.decode64(encryptedText));
    const encryptedKey = encrypted.getBytes(privateKey.n.bitLength() / 8);
    const ciphertext = encrypted.getBytes();
    const aesKey = privateKey.decrypt(encryptedKey, 'RSA-OAEP', {
        md: forge.md.sha1.create(),
        mgf1: forge.mgf.mgf1.create(forge.md.sha1.create())
    });
    const decipher = forge.cipher.createDecipher('AES-ECB', aesKey);
    decipher.start();
    decipher.update(forge.util.createBuffer(ciphertext));
    const pass = decipher.finish();
    if (pass) {
        return Buffer.from(decipher.output.getBytes(), 'binary');
    } else {
        throw new Error('Decryption failed');
    }
}

export {
    generateKeypair,
    encrypt,
    decrypt
}