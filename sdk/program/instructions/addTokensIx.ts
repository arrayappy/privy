import * as anchor from "@coral-xyz/anchor";
import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import { PrivyProgram } from "../idl";
import { getPrivyConfigPda } from "../pdas";

export async function addTokensIx(
  program: PrivyProgram,
  accounts: { user: PublicKey, privyUser: PublicKey },
  args: { depositLamports: anchor.BN },
  postIxs: TransactionInstruction[]
): Promise<TransactionInstruction> {
  const privyConfigPDA = getPrivyConfigPda(program.programId);

  return program.methods
    .addTokens(args.depositLamports)
    .accounts({
      user: accounts.user,
      privyUser: accounts.privyUser,
      privyConfig: privyConfigPDA,
    })
    .postInstructions(postIxs)
    .instruction();
}