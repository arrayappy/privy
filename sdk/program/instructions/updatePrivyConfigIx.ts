import { PublicKey, TransactionInstruction, SystemProgram } from "@solana/web3.js";
import { PrivyProgram } from "../idl";
import { getPrivyConfigPda } from "../pdas";

export async function updatePrivyConfigIx(
  program: PrivyProgram,
  accounts: { owner: PublicKey },
  args: { newTokensPerSol: number }
): Promise<TransactionInstruction> {
  const privyConfigPDA = getPrivyConfigPda(program.programId);

  return program.methods
    .updatePrivyConfig(args.newTokensPerSol)
    .accounts({
      owner: accounts.owner,
      privyConfig: privyConfigPDA,
      systemProgram: SystemProgram.programId,
    })
    .instruction();
}