import * as anchor from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { PrivyProgram } from "../idl";
import { getPrivyConfigPda, getPrivyUserPda } from "../pdas";
import { allocateSpaceIx } from "./allocateSpaceIx";

export async function createUserIx(
  program: PrivyProgram,
  accounts: { user: PublicKey },
  args: { username: string, encryptedCategories: Buffer, depositLamports: anchor.BN }
) {
  const privyUserPDA = getPrivyUserPda(program.programId, accounts.user);
  const privyConfigPDA = getPrivyConfigPda(program.programId);
  const allocatePromises = await allocateSpaceIx(program, accounts.user, privyUserPDA, 10000, 2);

  await program.methods
    .createUser(args.username, args.encryptedCategories, args.depositLamports)
    .accounts({
      user: accounts.user,
      privyUser: privyUserPDA,
      privyConfig: privyConfigPDA,
    })
    .postInstructions(allocatePromises)
    .rpc();
}
