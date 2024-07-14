import * as anchor from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { PrivyProgram } from "../idl";
import { getPrivyConfigPda } from "../pdas";

export async function updatePrivyConfigIx(
  program: PrivyProgram,
  accounts: { owner: PublicKey },
  args: { newTokensPerSol: number }
) {
  const privyConfigPDA = getPrivyConfigPda(program.programId);
  await program.methods
    .updatePrivyConfig(args.newTokensPerSol)
    .accounts({
      privyConfig: privyConfigPDA,
      owner: accounts.owner,
    })
    .rpc();
}
