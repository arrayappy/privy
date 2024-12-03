import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from "crypto"; // Import the crypto module
import { compAsymEnc, compSymEnc, decompAsymDec, decompSymDec, getPasswordSalt } from "@privy/sdk/utils/helpers";
import * as asymmetric from "@privy/sdk/utils/asymmetric";
import * as symmetric from "@privy/sdk/utils/symmetric";
import { symmetricExtendKey } from '@privy/sdk/utils/symmetric';

let iv = Buffer.from("anexampleiv12345"); // 16 bytes for AES-128

export default function getEncryptedCategories(req: NextApiRequest, res: NextApiResponse) {
  const key = req.body.key;
  const categories = req.body.categories;
  const extendedKey = symmetricExtendKey(key, 16)
  const encryptedCategories = compSymEnc(JSON.stringify(categories), extendedKey, iv)

  res.status(200).json({ encryptedCategories });
}