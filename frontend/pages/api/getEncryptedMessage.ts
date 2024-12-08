import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from "crypto"; // Import the crypto module
import { compAsymEnc, compSymEnc, decompAsymDec, decompSymDec, getPasswordSalt } from "@privy/sdk/utils/helpers";
import * as asymmetric from "@privy/sdk/utils/asymmetric";
import * as symmetric from "@privy/sdk/utils/symmetric";
import { symmetricExtendKey } from '@privy/sdk/utils/symmetric';

export default function getEncryptedMessage(req: NextApiRequest, res: NextApiResponse) {
  console.log("getEncryptedMessage", req.body);
  const message = req.body.message;
  const userPubkey = req.body.userPubkey;

  const encryptedMessage = compAsymEnc(message, userPubkey);
  console.log("encryptedMessage", encryptedMessage);
  res.status(200).json({ encryptedMessage });
}