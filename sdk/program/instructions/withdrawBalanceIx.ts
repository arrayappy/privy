import * as anchor from "@coral-xyz/anchor";
import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import { PrivyProgram } from "../idl";
import { getPrivyConfigPda } from "../pdas";

export async function withdrawBalanceIx(
  program: PrivyProgram,
  accounts: { owner: PublicKey },
  args: { lamports: anchor.BN }
): Promise<TransactionInstruction> {
  const privyConfigPDA = getPrivyConfigPda(program.programId);
  return program.methods
    .withdrawBalance(args.lamports)
    .accounts({
      owner: accounts.owner,
      privyConfig: privyConfigPDA,
    })
    .instruction();
}