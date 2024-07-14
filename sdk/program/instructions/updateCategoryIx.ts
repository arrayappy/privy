import { PrivyProgram } from "../idl";
import { PublicKey, TransactionInstruction } from "@solana/web3.js";

export async function updateCategoryIx(
  program: PrivyProgram,
  accounts: { privyUser: PublicKey },
  args: { encryptedCategories: string }
): Promise<TransactionInstruction> {
  return program.methods
    .updateCategory(args.encryptedCategories)
    .accounts({
      privyUser: accounts.privyUser,
    })
    .instruction();
}