import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import { PrivyProgram } from "../idl";
import { getPrivyConfigPda } from "../pdas";

export async function insertMessageIx(
  program: PrivyProgram,
  accounts: { owner: PublicKey, privyUser: PublicKey },
  args: { encryptedMessages: string }
): Promise<TransactionInstruction> {
  const privyConfigPDA = getPrivyConfigPda(program.programId);
  return program.methods
    .insertMessage(args.encryptedMessages)
    .accounts({
      owner: accounts.owner,
      privyConfig: privyConfigPDA,
      privyUser: accounts.privyUser,
    })
    .instruction();
}