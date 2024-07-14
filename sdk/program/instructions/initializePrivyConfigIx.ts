import { PublicKey, SystemProgram, TransactionInstruction } from "@solana/web3.js";
import { PrivyProgram } from "../idl";
import { getPrivyConfigPda } from "../pdas";

export async function initializePrivyConfigIx(
  program: PrivyProgram,
  accounts: { owner: PublicKey },
  args: { tokensPerSol: number }
): Promise<TransactionInstruction> {
  const privyConfigPDA = getPrivyConfigPda(program.programId);
  return program.methods
    .initializePrivyConfig(args.tokensPerSol)
    .accounts({
      owner: accounts.owner,
      privyConfig: privyConfigPDA,
      systemProgram: SystemProgram.programId,
    })
    .instruction();
}
