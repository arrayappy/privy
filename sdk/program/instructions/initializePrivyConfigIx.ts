import * as anchor from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { PrivyProgram } from "../idl";
import { getPrivyConfigPda } from "../pdas";

export async function initializePrivyConfigIx(
  program: PrivyProgram,
  accounts: { owner: PublicKey },
  args: { tokensPerSol: number }
) {
  const privyConfigPDA = getPrivyConfigPda(program.programId);
  await program.methods
    .initializePrivyConfig(args.tokensPerSol)
    .accounts({
      owner: accounts.owner.toString(),
      privyConfig: privyConfigPDA,
    })
    .rpc();
}
