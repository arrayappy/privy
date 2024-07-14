import * as anchor from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { PrivyProgram } from "../idl";
import { getPrivyConfigPda } from "../pdas";

export async function insertMessageIx(
  program: PrivyProgram,
  accounts: { owner: PublicKey, privyUser: PublicKey },
  args: { encryptedMessages: Buffer }
) {
  const privyConfigPDA = getPrivyConfigPda(program.programId);
  await program.methods
    .insertMessage(args.encryptedMessages)
    .accounts({
      owner: accounts.owner,
      privyConfig: privyConfigPDA,
      privyUser: accounts.privyUser,
    })
    .rpc();
}
