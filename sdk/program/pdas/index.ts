import { PublicKey } from "@solana/web3.js";
import { PRIVY_CONFIG, PRIVY_USER } from "../constants/PdaConstants";

// Getter function to fetch the PrivyConfig PDA
export function getPrivyConfigPda(programId: PublicKey): PublicKey {
  const [privyConfigPDA] = PublicKey.findProgramAddressSync(
    [Buffer.from(PRIVY_CONFIG, 'utf8')],
    programId
  );
  return privyConfigPDA;
}

// Getter function to fetch the PrivyUser PDA
export function getPrivyUserPda(programId: PublicKey, walletAddress: PublicKey): PublicKey {
  const [privyUserPDA] = PublicKey.findProgramAddressSync(
    [
      Buffer.from(PRIVY_USER),
      walletAddress.toBuffer()
    ],
    programId
  );
  return privyUserPDA;
}
