// import * as anchor from "@coral-xyz/anchor";
// import { PublicKey } from "@solana/web3.js";
// import { decompSymDec } from "@privy/sdk/utils/helpers";
// import { PrivyProgram } from "../idl";
// import { getPrivyConfigPda, getPrivyUserPda } from "../pdas";

// export async function initializePrivyConfigIx(
//   program: PrivyProgram,
//   accounts: { owner: PublicKey },
//   args: { tokensPerSol: number }
// ) {
//   const privyConfigPDA = getPrivyConfigPda(program.programId);
//   await program.methods
//     .initializePrivyConfig(args.tokensPerSol)
//     .accounts({
//       owner: accounts.owner.toString(),
//       privyConfig: privyConfigPDA,
//     })
//     .rpc();
// }

// export async function updatePrivyConfigIx(
//   program: PrivyProgram,
//   accounts: { owner: PublicKey },
//   args: { newTokensPerSol: number }
// ) {
//   const privyConfigPDA = getPrivyConfigPda(program.programId);
//   await program.methods
//     .updatePrivyConfig(args.newTokensPerSol)
//     .accounts({
//       privyConfig: privyConfigPDA,
//       owner: accounts.owner,
//     })
//     .rpc();
// }

// export async function createUserIx(
//   program: PrivyProgram,
//   accounts: { user: PublicKey },
//   args: { username: string, encryptedCategories: Buffer, depositLamports: anchor.BN }
// ) {
//   const privyUserPDA = getPrivyUserPda(program.programId, accounts.user);
//   const privyConfigPDA = getPrivyConfigPda(program.programId);
//   const allocatePromises = await allocateSpaceIx(program, accounts.user, privyUserPDA, 10000, 2);

//   await program.methods
//     .createUser(args.username, args.encryptedCategories, args.depositLamports)
//     .accounts({
//       user: accounts.user,
//       privyUser: privyUserPDA,
//       privyConfig: privyConfigPDA,
//     })
//     .postInstructions(allocatePromises)
//     .rpc();
// }

// export async function updateUsernameIx(
//   program: PrivyProgram,
//   accounts: { privyUser: PublicKey },
//   args: { newUsername: string }
// ) {
//   await program.methods
//     .updateUsername(args.newUsername)
//     .accounts({
//       privyUser: accounts.privyUser,
//     })
//     .rpc();
// }

// export async function addTokensIx(
//   program: PrivyProgram,
//   accounts: { user: PublicKey, privyUser: PublicKey },
//   args: { depositLamports: anchor.BN }
// ) {
//   const privyConfigPDA = getPrivyConfigPda(program.programId);
//   const allocatePromises = await allocateSpaceIx(program, accounts.user, accounts.privyUser, 10000, 2);

//   await program.methods
//     .addTokens(args.depositLamports)
//     .accounts({
//       user: accounts.user,
//       privyUser: accounts.privyUser,
//       privyConfig: privyConfigPDA,
//     })
//     .postInstructions(allocatePromises)
//     .rpc();
// }

// export async function withdrawBalanceIx(
//   program: PrivyProgram,
//   accounts: { owner: PublicKey },
//   args: { lamports: anchor.BN }
// ) {
//   const privyConfigPDA = getPrivyConfigPda(program.programId);
//   await program.methods
//     .withdrawBalance(args.lamports)
//     .accounts({
//       owner: accounts.owner,
//       privyConfig: privyConfigPDA,
//     })
//     .rpc();
// }

// export async function insertMessageIx(
//   program: PrivyProgram,
//   accounts: { owner: PublicKey, privyUser: PublicKey },
//   args: { encryptedMessages: Buffer }
// ) {
//   const privyConfigPDA = getPrivyConfigPda(program.programId);
//   await program.methods
//     .insertMessage(args.encryptedMessages)
//     .accounts({
//       owner: accounts.owner,
//       privyConfig: privyConfigPDA,
//       privyUser: accounts.privyUser,
//     })
//     .rpc();
// }

// export async function updateCategoryIx(
//   program: PrivyProgram,
//   accounts: { privyUser: PublicKey },
//   args: { encryptedCategories: Buffer }
// ) {
//   await program.methods
//     .updateCategory(args.encryptedCategories)
//     .accounts({
//       privyUser: accounts.privyUser,
//     })
//     .rpc();
// }

// export async function readPrivyUserIx(
//   program: PrivyProgram,
//   accounts: { privyUser: PublicKey },
//   args: { extendedKey: Buffer, iv: Buffer }
// ) {
//   const accountData = await program.account.privyUser.fetch(accounts.privyUser);
//   accountData.messages = JSON.parse(decompSymDec(accountData.messages, args.extendedKey, args.iv));
//   accountData.categories = JSON.parse(decompSymDec(accountData.categories, args.extendedKey, args.iv));
//   return accountData;
// }

// export async function allocateSpaceIx(
//   program: PrivyProgram,
//   user: PublicKey,
//   privyUserPDA: PublicKey,
//   space: number,
//   count: number
// ): Promise<anchor.web3.TransactionInstruction[]> {
//   const allocatePromises = [];
//   for (let i = 0; i < count; i++) {
//     const promise = program.methods
//       .allocateSpace(space)
//       .accounts({
//         user: user,
//         privyUser: privyUserPDA,
//       }).instruction();
//     allocatePromises.push(await promise);
//   }
//   return allocatePromises;
// }
export { initializePrivyConfigIx } from './initializePrivyConfigIx';
export { updatePrivyConfigIx } from './updatePrivyConfigIx';
export { createUserIx } from './createUserIx';
export { updateUsernameIx } from './updateUsernameIx';
export { addTokensIx } from './addTokensIx';
export { withdrawBalanceIx } from './withdrawBalanceIx';
export { insertMessageIx } from './insertMessageIx';
export { updateCategoryIx } from './updateCategoryIx';
export { readPrivyUserIx } from './readPrivyUserIx';
export { allocateSpaceIx } from './allocateSpaceIx';