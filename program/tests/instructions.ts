import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { Privy } from "../target/types/privy";
import { decompSymDec } from "@privy/sdk/utils/helpers";

export async function initializePrivyConfig(
  program: Program<Privy>,
  provider: anchor.AnchorProvider,
  tokensPerSol: number,
  privyConfigPDA: PublicKey
) {
  await program.methods
    .initializePrivyConfig(tokensPerSol)
    .accounts({
      owner: provider.wallet.publicKey.toString(),
      privyConfig: privyConfigPDA,
    })
    .rpc();
}

export async function updatePrivyConfig(
  program: Program<Privy>,
  provider: anchor.AnchorProvider,
  newTokensPerSol: number,
  privyConfigPDA: PublicKey
) {
  await program.methods
    .updatePrivyConfig(newTokensPerSol)
    .accounts({
      privyConfig: privyConfigPDA,
      owner: provider.wallet.publicKey,
    })
    .rpc();
}

export async function createUser(
  program: Program<Privy>,
  provider: anchor.AnchorProvider,
  username: string,
  encryptedCategories: Buffer,
  depositLamports: anchor.BN,
  privyUserPDA: PublicKey,
  privyConfigPDA: PublicKey,
  allocatePromises: anchor.web3.TransactionInstruction[]
) {
  await program.methods
    .createUser(username, encryptedCategories, depositLamports)
    .accounts({
      user: provider.wallet.publicKey,
      privyUser: privyUserPDA,
      privyConfig: privyConfigPDA,
    }).postInstructions(allocatePromises)
    .rpc();
}

export async function updateUsername(
  program: Program<Privy>,
  newUsername: string,
  privyUserPDA: PublicKey
) {
  await program.methods
    .updateUsername(newUsername)
    .accounts({
      privyUser: privyUserPDA,
    })
    .rpc();
}

export async function addTokens(
  program: Program<Privy>,
  provider: anchor.AnchorProvider,
  depositLamports: anchor.BN,
  privyUserPDA: PublicKey,
  privyConfigPDA: PublicKey,
  allocatePromises: anchor.web3.TransactionInstruction[]
) {
  await program.methods
    .addTokens(depositLamports)
    .accounts({
      user: provider.wallet.publicKey,
      privyUser: privyUserPDA,
      privyConfig: privyConfigPDA,
    }).postInstructions(allocatePromises)
    .rpc();
}

export async function withdrawBalance(
  program: Program<Privy>,
  provider: anchor.AnchorProvider,
  lamports: anchor.BN,
  privyConfigPDA: PublicKey
) {
  await program.methods
    .withdrawBalance(lamports)
    .accounts({
      owner: provider.wallet.publicKey,
      privyConfig: privyConfigPDA,
    })
    .rpc();
}

export async function insertMessage(
  program: Program<Privy>,
  provider: anchor.AnchorProvider,
  encryptedMessages: Buffer,
  privyUserPDA: PublicKey,
  privyConfigPDA: PublicKey
) {
  await program.methods.insertMessage(encryptedMessages).accounts({
    owner: provider.wallet.publicKey,
    privyConfig: privyConfigPDA,
    privyUser: privyUserPDA,
  })
  .rpc();
}

export async function updateCategory(
  program: Program<Privy>,
  encryptedCategories: Buffer,
  privyUserPDA: PublicKey
) {
  await program.methods
    .updateCategory(encryptedCategories)
    .accounts({
      privyUser: privyUserPDA,
    })
    .rpc();
}

export async function readPrivyUser(
  program: Program<Privy>,
  privyUserPDA: PublicKey,
  extendedKey: Buffer,
  iv: Buffer
) {
  const accountData = await program.account.privyUser.fetch(privyUserPDA);
  accountData.messages = JSON.parse(decompSymDec(accountData.messages, extendedKey, iv));
  accountData.categories = JSON.parse(decompSymDec(accountData.categories, extendedKey, iv));
  return accountData;
}

export async function allocateSpace(
  program: anchor.Program,
  provider: anchor.AnchorProvider,
  privyUserPDA: PublicKey,
  space: number,
  count: number
): Promise<anchor.web3.TransactionInstruction[]> {
  const allocatePromises = [];
  for (let i = 0; i < count; i++) {
    const promise = program.methods
      .allocateSpace(space)
      .accounts({
        user: provider.wallet.publicKey,
        privyUser: privyUserPDA,
      }).instruction();
    allocatePromises.push(await promise);
  }
  return allocatePromises;
}