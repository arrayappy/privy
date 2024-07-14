import { PrivyProgram } from "../idl";
import { PublicKey } from "@solana/web3.js";

export async function updateUsernameIx(
  program: PrivyProgram,
  accounts: { privyUser: PublicKey },
  args: { newUsername: string }
) {
  await program.methods
    .updateUsername(args.newUsername)
    .accounts({
      privyUser: accounts.privyUser,
    })
    .rpc();
}
