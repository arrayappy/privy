import * as anchor from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { PrivyProgram } from "../idl";

export async function allocateSpaceIx(
  program: PrivyProgram,
  user: PublicKey,
  privyUserPDA: PublicKey,
  space: number,
  count: number
): Promise<anchor.web3.TransactionInstruction[]> {
  const allocatePromises = [];
  for (let i = 0; i < count; i++) {
    const promise = program.methods
      .allocateSpace(space)
      .accounts({
        user: user,
        privyUser: privyUserPDA,
      }).instruction();
    allocatePromises.push(await promise);
  }
  return allocatePromises;
}
