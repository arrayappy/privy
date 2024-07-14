import * as anchor from "@coral-xyz/anchor";
import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import { PrivyProgram } from "../idl";
import { getPrivyConfigPda, getPrivyUserPda } from "../pdas";

export async function createUserIx(
  program: PrivyProgram,
  accounts: { user: PublicKey },
  args: { username: string, encryptedCategories: string, depositLamports: anchor.BN },
  postIxs: TransactionInstruction[]
): Promise<TransactionInstruction> {
  const privyUserPDA = getPrivyUserPda(program.programId, accounts.user);
  const privyConfigPDA = getPrivyConfigPda(program.programId);

  return program.methods
    .createUser(args.username, args.encryptedCategories, args.depositLamports)
    .accounts({
      user: accounts.user,
      privyUser: privyUserPDA,
      privyConfig: privyConfigPDA,
    })
    .postInstructions(postIxs)
    .instruction();
}