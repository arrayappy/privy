import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from "crypto"; // Import the crypto module
import { compAsymEnc, compSymEnc, decompAsymDec, decompSymDec, getPasswordSalt } from "@privy/sdk/utils/helpers";
import * as asymmetric from "@privy/sdk/utils/asymmetric";
import * as symmetric from "@privy/sdk/utils/symmetric";
import { symmetricExtendKey } from '@privy/sdk/utils/symmetric';

let iv = Buffer.from("anexampleiv12345"); // 16 bytes for AES-128

export default function getDecryptedCategories(req: NextApiRequest, res: NextApiResponse) {
  try {
    const key = req.body.key;
    const categories = req.body.categories;
  
    const extendedKey = symmetricExtendKey(key, 16);
    const decryptedData = decompSymDec(categories, extendedKey, iv);
    
    let parsedData;
    try {
      parsedData = JSON.parse(decryptedData);
    } catch (e) {
      console.error('Error parsing decrypted data:', e);
      parsedData = [];
    }

    res.status(200).json({ decryptedCategories: parsedData });
  } catch (error) {
    console.error('Error in getDecryptedCategories:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      decryptedCategories: [] 
    });
  }
}