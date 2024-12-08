import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from "crypto";
import { compAsymEnc, compSymEnc, decompAsymDec, decompSymDec, getPasswordSalt } from "@privy/sdk/utils/helpers";
import * as asymmetric from "@privy/sdk/utils/asymmetric";
import * as symmetric from "@privy/sdk/utils/symmetric";
import { symmetricExtendKey } from '@privy/sdk/utils/symmetric';

export default function getDecryptedMessages(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { passphrase, messages } = req.body;
    
    // Validate input
    if (!passphrase || !messages) {
      return res.status(400).json({ 
        error: "Missing required parameters",
        passphrase: !!passphrase,
        messages: !!messages 
      });
    }

    // Make sure messages is an array
    const messageArray = Array.isArray(messages) ? messages : [];
    
    const keypair = asymmetric.generateKeypair(passphrase);

    const decryptedMessages = messageArray.map((message: string, index: number) => {
      try {
        const decrypted = decompAsymDec(message, keypair.privateKeyPem);
        return decrypted;
      } catch (error: any) {
        console.error(`Failed to decrypt message ${index}:`, error);
        return null; // Return null for failed decryption
      }
    });
    console.log("decryptedMessages", decryptedMessages);

    const failedDecryption = decryptedMessages.some(msg => msg === null);

    if (failedDecryption) {
      return res.status(401).json({ error: "Incorrect passphrase" });
    }

    res.status(200).json({ decryptedMessages });
    
  } catch (error: any) {
    console.error("Top level error:", error);
    res.status(500).json({ 
      error: error.message,
      stack: error.stack,
      type: error.constructor.name 
    });
  }
}