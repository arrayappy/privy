import * as anchor from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { PrivyProgram } from "../idl";
import { getPrivyConfigPda } from "../pdas";
import { allocateSpaceIx } from "./allocateSpaceIx";

export async function addTokensIx(
  program: PrivyProgram,
  accounts: { user: PublicKey, privyUser: PublicKey },
  args: { depositLamports: anchor.BN }
) {
  const privyConfigPDA = getPrivyConfigPda(program.programId);
  const allocatePromises = await allocateSpaceIx(program, accounts.user, accounts.privyUser, 10000, 2);

  await program.methods
    .addTokens(args.depositLamports)
    .accounts({
      user: accounts.user,
      privyUser: accounts.privyUser,
      privyConfig: privyConfigPDA,
    })
    .postInstructions(allocatePromises)
    .rpc();
}
