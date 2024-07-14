import { PrivyProgram } from "../idl";
import { PublicKey } from "@solana/web3.js";

export async function updateCategoryIx(
  program: PrivyProgram,
  accounts: { privyUser: PublicKey },
  args: { encryptedCategories: Buffer }
) {
  await program.methods
    .updateCategory(args.encryptedCategories)
    .accounts({
      privyUser: accounts.privyUser,
    })
    .rpc();
}
