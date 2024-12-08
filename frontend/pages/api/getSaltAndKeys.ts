import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from "crypto"; // Import the crypto module
import { compAsymEnc, compSymEnc, decompAsymDec, decompSymDec, getPasswordSalt } from "@privy/sdk/utils/helpers";
import * as asymmetric from "@privy/sdk/utils/asymmetric";
import * as symmetric from "@privy/sdk/utils/symmetric";

export default function getSaltAndKeys(req: NextApiRequest, res: NextApiResponse) {
  const passphrase = req.body.passphrase;
  const password_salt = getPasswordSalt(passphrase);
  const { privateKeyPem, publicKeyPem } = asymmetric.generateKeypair(passphrase);

  res.status(200).json({ password_salt, publicKeyPem, privateKeyPem });
}