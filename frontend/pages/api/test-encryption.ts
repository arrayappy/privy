import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from "crypto"; // Import the crypto module
import { compAsymEnc, compSymEnc, decompAsymDec, decompSymDec, getPasswordSalt } from "@privy/sdk/utils/helpers";
import * as asymmetric from "@privy/sdk/utils/asymmetric";
import * as symmetric from "@privy/sdk/utils/symmetric";

export default function testEncryption(req: NextApiRequest, res: NextApiResponse) {
  // Data to be encrypted
  const data = "Import the crypto moduleThis is a secret message Asymmetrically Encrypted Data my_secret_passphrase Import the crypto module SHould have do";
  const passphrase = "my_secret_passphrase";
  const password_salt = getPasswordSalt(passphrase);

  // Symmetric Encryption/Decryption Example
  const key = symmetric.symmetricExtendKey(password_salt, 16);
  const iv = crypto.randomBytes(16);

  const symEncryptedData = compSymEnc(data, key, iv);
  console.log("Symmetrically Encrypted Data:", symEncryptedData);

  const symDecryptedData = decompSymDec(symEncryptedData, key, iv);
  console.log("Symmetrically Decrypted Data:", symDecryptedData);

  const { privateKeyPem, publicKeyPem } = asymmetric.generateKeypair(passphrase);

  const asymEncryptedData = compAsymEnc(data, publicKeyPem);
  console.log("Asymmetrically Encrypted Data:", asymEncryptedData);

  const asymDecryptedData = decompAsymDec(asymEncryptedData, privateKeyPem);
  console.log("Asymmetrically Decrypted Data:", asymDecryptedData);

  // Return the results for testing purposes
  res.status(200).json({
    symmetric: {
      encrypted: symEncryptedData,
      decrypted: symDecryptedData
    },
    asymmetric: {
      encrypted: asymEncryptedData,
      decrypted: asymDecryptedData
    }
  });
}