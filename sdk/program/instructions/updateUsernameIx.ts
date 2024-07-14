import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import { PrivyProgram } from "../idl";

export async function updateUsernameIx(
  program: PrivyProgram,
  accounts: { privyUser: PublicKey },
  args: { newUsername: string }
): Promise<TransactionInstruction> {
  return program.methods
    .updateUsername(args.newUsername)
    .accounts({
      privyUser: accounts.privyUser,
    })
    .instruction();
}