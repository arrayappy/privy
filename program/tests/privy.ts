import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { Privy } from "../target/types/privy";
import { expect } from "chai";

import { compSymEnc, decompSymDec } from "@privy/sdk/utils/helpers";
import { symmetricExtendKey } from "@privy/sdk/utils/symmetric";
import {
  initializePrivyConfig,
  updatePrivyConfig,
  createUser,
  updateUsername,
  allocateSpace,
  addTokens,
  withdrawBalance,
  insertMessage,
  updateCategory,
  readPrivyUser,
} from "./instructions";
import { getPrivyConfigPDA, getPrivyUserPDA } from "./state";

const provider = anchor.AnchorProvider.local();

anchor.setProvider(provider);
console.log(`Using wallet: ${provider.wallet.publicKey.toString()}`);

const program = anchor.workspace.Privy as Program<Privy>;
console.log("programId", program.programId.toString());

const privyConfigPDA = getPrivyConfigPDA(program);
const privyUserPDA = getPrivyUserPDA(program, provider);

const tokensPerSol = 50;
const newTokensPerSol = 100;

const userData = {
  username: "arrayappy",
  passkey: "secret"
};

let key = "key1";
let iv = Buffer.from("anexampleiv12345"); // 16 bytes for AES-128
let extendedKey = symmetricExtendKey(key, 16);

describe("Privy Config", () => {
  it("Initialize Privy Config", async () => {
    await initializePrivyConfig(program, provider, tokensPerSol, privyConfigPDA);

    const configData = await program.account.privyConfig.fetch(privyConfigPDA);
    expect(configData.tokensPerSol).to.equal(tokensPerSol);
  });

  it("Update Privy Config", async () => {
    await updatePrivyConfig(program, provider, newTokensPerSol, privyConfigPDA);

    const updatedConfigData = await program.account.privyConfig.fetch(privyConfigPDA);
    expect(updatedConfigData.tokensPerSol).to.equal(newTokensPerSol);
  });
});

describe("Privy User", () => {
  it("Create User", async () => {
    const depositLamports = new anchor.BN(1 * anchor.web3.LAMPORTS_PER_SOL);

    const allocatePromises = await allocateSpace(program, provider, privyUserPDA, 10000, 2);

    const categories = [{
      cat_name: "cat1",
      passkey: "cat_secret",
      enabled: true,
      single_msg: false,
    }];
    const encryptedCategories = compSymEnc(categories, extendedKey, iv);

    await createUser(program, provider, userData.username, encryptedCategories, depositLamports, privyUserPDA, privyConfigPDA, allocatePromises);

    const accountData = await program.account.privyUser.fetch(privyUserPDA);
    console.log("accountData", accountData);
    expect(accountData.username).to.equal(userData.username);
    expect(accountData.tokenLimit).to.equal(Math.floor(depositLamports.toNumber() / anchor.web3.LAMPORTS_PER_SOL * newTokensPerSol));
  });

  it("Update Username", async () => {
    const newUsername = "naidu";
    await updateUsername(program, newUsername, privyUserPDA);

    const accountData = await program.account.privyUser.fetch(privyUserPDA);
    expect(accountData.username).to.equal(newUsername);
  });

  it("Add tokens", async () => {
    const depositLamports = new anchor.BN(1 * anchor.web3.LAMPORTS_PER_SOL);

    const allocatePromises = await allocateSpace(program, provider, privyUserPDA, 10000, 2);

    await addTokens(program, provider, depositLamports, privyUserPDA, privyConfigPDA, allocatePromises);

    const accountData = await program.account.privyUser.fetch(privyUserPDA);
    const expectedTokensLength = Math.floor((2 * anchor.web3.LAMPORTS_PER_SOL) / anchor.web3.LAMPORTS_PER_SOL * newTokensPerSol);
    expect(accountData.tokenLimit).to.equal(expectedTokensLength);
  });
});

describe("Privy Admin", () => {
  it("Withdraw Balance", async () => {
    const lamports = new anchor.BN(0.4 * anchor.web3.LAMPORTS_PER_SOL);
    await withdrawBalance(program, provider, lamports, privyConfigPDA);
  });

  it("Insert message into messages vector", async () => {
    const messages = JSON.stringify(["0:hi"]);
    const encryptedMessages = compSymEnc(messages, extendedKey, iv);

    await insertMessage(program, provider, encryptedMessages, privyUserPDA, privyConfigPDA);

    const accountData = await program.account.privyUser.fetch(privyUserPDA);
    console.log(accountData);
    expect(accountData.messages).to.equal(encryptedMessages);
    expect(decompSymDec(accountData.messages, extendedKey, iv)).to.equal(messages);
  });
});

describe("Privy User Categories", () => {
  it("Update Category", async () => {
    const categories = [{
      cat_name: "cat1",
      passkey: "cat1_secret",
      enabled: true,
      single_msg: false,
    }, {
      cat_name: "cat2",
      passkey: "cat2_secret",
      enabled: true,
      single_msg: true,
    }];
    const categoriesStr = JSON.stringify(categories);
    const encryptedCategories = compSymEnc(categoriesStr, extendedKey, iv);

    await updateCategory(program, encryptedCategories, privyUserPDA);

    const accountData = await program.account.privyUser.fetch(privyUserPDA);
    console.log(accountData);
    expect(accountData.categories).to.equal(encryptedCategories);
    expect(decompSymDec(accountData.categories, extendedKey, iv)).to.equal(categoriesStr);
  });
});

describe("Read", () => {
  it("Read Privy User", async () => {
    const accountData = await readPrivyUser(program, privyUserPDA, extendedKey, iv);
    console.log(accountData);
  });
});

// // Encryption & compression to be implemented
// const sleep = async (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
// describe("Load testing for message insertion", function () {
//   it("should insert the same message 10 times and fail on the 11th attempt", async () => {
//     for (let batch = 0; batch < 5; batch++) {
//       const promises = [];
//       for (let i = batch * 25; i < (batch + 1) * 25; i++) {
//         const message = `Should insert the same message 10 times and fail on 11th attempt, should insert the same message 10 times and fail on 11th attempt - ${i}`;
//         promises.push(program.methods.insertMessage(message)
//           .accounts({
//             owner: provider.wallet.publicKey,
//             privyConfig: privyConfigPDA,
//             privyUser: privyUserPDA,
//           })
//           .rpc())
//       }
//       console.log(`Batch ${batch + 1} promises`, promises)
//       await Promise.all(promises)
//       console.log(`p${batch + 1}`)
//       await sleep(60000)
//     }
//     const accountData = await program.account.privyUser.fetch(privyUserPDA);
//     console.log(accountData.messages, accountData.messages.length);
//   })
// });