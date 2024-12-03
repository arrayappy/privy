import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from "crypto"; // Import the crypto module
import { compAsymEnc, compSymEnc, decompAsymDec, decompSymDec, getPasswordSalt } from "@privy/sdk/utils/helpers";
import * as asymmetric from "@privy/sdk/utils/asymmetric";
import * as symmetric from "@privy/sdk/utils/symmetric";
import { symmetricExtendKey } from '@privy/sdk/utils/symmetric';

export default function getDecryptedMessages(req: NextApiRequest, res: NextApiResponse) {
  const passphrase = req.body.passphrase;
  const messages = req.body.messages;

  const { privateKeyPem, publicKeyPem } = asymmetric.generateKeypair(passphrase);

  const decryptedMessages = decompAsymDec(messages, privateKeyPem);

  res.status(200).json({ decryptedMessages });
}