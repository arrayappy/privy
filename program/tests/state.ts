import * as anchor from "@coral-xyz/anchor";
import { Program, AnchorProvider } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { Privy } from "../target/types/privy";

// Getter function to fetch the PrivyConfig PDA
export function getPrivyConfigPDA(program: Program<Privy>): PublicKey {
  const [privyConfigPDA] = PublicKey.findProgramAddressSync(
    [anchor.utils.bytes.utf8.encode('privy-config')],
    program.programId
  );
  return privyConfigPDA;
}

// Getter function to fetch the PrivyUser PDA
export function getPrivyUserPDA(program: Program<Privy>, provider: AnchorProvider): PublicKey {
  const [privyUserPDA] = PublicKey.findProgramAddressSync(
    [
      anchor.utils.bytes.utf8.encode('privy-user'),
      provider.wallet.publicKey.toBuffer()
    ],
    program.programId
  );
  return privyUserPDA;
}
