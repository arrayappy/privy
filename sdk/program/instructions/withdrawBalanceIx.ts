import * as anchor from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { PrivyProgram } from "../idl";
import { getPrivyConfigPda } from "../pdas";

export async function withdrawBalanceIx(
  program: PrivyProgram,
  accounts: { owner: PublicKey },
  args: { lamports: anchor.BN }
) {
  const privyConfigPDA = getPrivyConfigPda(program.programId);
  await program.methods
    .withdrawBalance(args.lamports)
    .accounts({
      owner: accounts.owner,
      privyConfig: privyConfigPDA,
    })
    .rpc();
}
