import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { Privy } from "../target/types/privy";
import { expect } from "chai";
import {
  extendKey,
  compressAndEncrypt,
  decompressAndDecrypt
} from "./utils"

const provider = anchor.AnchorProvider.local();
anchor.setProvider(provider);
console.log(`Using wallet: ${provider.wallet.publicKey.toString()}`);

const program = anchor.workspace.Privy as Program<Privy>;
console.log(program.programId.toString());
const [privyConfigPDA, _] = PublicKey.findProgramAddressSync(
  [anchor.utils.bytes.utf8.encode('privy-config')],
  program.programId
);
const userData = {
  username: "arrayappy",
  passkey: "secret"
};

const [privyUserPDA, bump] = PublicKey.findProgramAddressSync(
  [
    anchor.utils.bytes.utf8.encode('privy-user'),
    provider.wallet.publicKey.toBuffer()
  ],
  program.programId
);

console.log('provider', provider.wallet.publicKey)

const tokensPerSol = 50;
const newTokensPerSol = 100;

let key = "key1";
let iv = Buffer.from("anexampleiv12345"); // 16 bytes for AES-128
let extendedKey = extendKey(key, 16);

describe("Privy Config", () => {

  it("Initialize Privy Config", async () => {
    await program.methods
      .initializePrivyConfig(tokensPerSol)
      .accounts({
        owner: provider.wallet.publicKey.toString(),
        privyConfig: privyConfigPDA,
      })
      .rpc();

    const configData = await program.account.privyConfig.fetch(privyConfigPDA);
    expect(configData.tokensPerSol).to.equal(tokensPerSol);
  });

  it("Update Privy Config", async () => {

    await program.methods
      .updatePrivyConfig(newTokensPerSol)
      .accounts({
        privyConfig: privyConfigPDA,
        owner: provider.wallet.publicKey,
      })
      .rpc();


    const updatedConfigData = await program.account.privyConfig.fetch(privyConfigPDA);
    expect(updatedConfigData.tokensPerSol).to.equal(newTokensPerSol);
  });
});
  

describe("Privy User", () => {
  it("Create User", async () => {
    const depositLamports = 1 * anchor.web3.LAMPORTS_PER_SOL;

    const allocatePromises = [];
    for (let i = 0; i < 2; i++) {
      const promise = program.methods
        .allocateSpace(10000)
        .accounts({
          user: provider.wallet.publicKey,
          privyUser: privyUserPDA
        }).instruction()
      allocatePromises.push(await promise);
    }
    
    const categories = [{
      cat_name: "cat1",
      passkey: "cat_secret",
      enabled: true,
      single_msg: false,
    }];
    const encryptedCategories  = compressAndEncrypt(categories, extendedKey, iv);

    await program.methods
      .createUser(userData.username, encryptedCategories, new anchor.BN(depositLamports))
      .accounts({
        user: provider.wallet.publicKey,
        privyUser: privyUserPDA,
        privyConfig: privyConfigPDA,
      }).postInstructions(allocatePromises)
      .rpc();

    const accountData = await program.account.privyUser.fetch(privyUserPDA);
    console.log("accountData", accountData);
    const privyUser = await program.account.privyUser.getAccountInfo(privyUserPDA);
    console.log(privyUser)
    expect(accountData.username).to.equal(userData.username);
    expect(accountData.tokenLimit).to.equal(Math.floor(depositLamports / anchor.web3.LAMPORTS_PER_SOL * newTokensPerSol));
  });

  it("Update Username", async () => {
    const newUsername = "naidu";
    await program.methods
      .updateUsername(newUsername)
      .accounts({
        privyUser: privyUserPDA,
      })
      .rpc();
      const accountData = await program.account.privyUser.fetch(privyUserPDA);
      expect(accountData.username).to.equal(newUsername);
  })

  it("Add tokens", async () => {
    const depositLamports = 1 * anchor.web3.LAMPORTS_PER_SOL;

    const allocatePromises = [];
    for (let i = 0; i < 2; i++) {
      const promise = program.methods
        .allocateSpace(10000)
        .accounts({
          user: provider.wallet.publicKey,
          privyUser: privyUserPDA
        }).instruction()
      allocatePromises.push(await promise);
    }

    await program.methods
      .addTokens(new anchor.BN(depositLamports))
      .accounts({
        user: provider.wallet.publicKey,
        privyUser: privyUserPDA,
        privyConfig: privyConfigPDA,
      }).postInstructions(allocatePromises)
      .rpc();

    const accountData = await program.account.privyUser.fetch(privyUserPDA);
    // console.log("accountData", accountData);
    const expectedTokensLength = Math.floor((2 * anchor.web3.LAMPORTS_PER_SOL) / anchor.web3.LAMPORTS_PER_SOL * newTokensPerSol);
    expect(accountData.tokenLimit).to.equal(expectedTokensLength);
  });

});

describe("Privy Admin", () => {
  it("Withdraw Balance", async () => {
    const lamports = new anchor.BN(0.4 * anchor.web3.LAMPORTS_PER_SOL);
    // console.log('x', await program.account.privyConfig.getAccountInfo(privyConfigPDA))
    const tx = await program.methods
      .withdrawBalance(lamports)
      .accounts({
        owner: provider.wallet.publicKey,
        privyConfig: privyConfigPDA,
      })
      .rpc()
  })

  it("Insert message into messages vector", async () => {
    const passkey = "secret";
    const messages = "0:hi";

    let encryptedMessages = compressAndEncrypt(messages, extendedKey, iv);

    await program.methods.insertMessage(encryptedMessages).accounts({
      owner: provider.wallet.publicKey,
      privyConfig: privyConfigPDA,
      privyUser: privyUserPDA,
    })
    .rpc();

    const accountData = await program.account.privyUser.fetch(privyUserPDA);
    console.log(accountData)
    expect(accountData.messages).to.equal(encryptedMessages);
    expect(decompressAndDecrypt(accountData.messages, extendedKey, iv)).to.equal(messages);
  })

});

describe("Privy User Categories", () => {

  it("Update Category", async () => {
    const categories = [{
      cat_name: "cat1",
      passkey: "cat1_secret",
      enabled: true,
      single_msg: false,
    },{
      cat_name: "cat2",
      passkey: "cat2_secret",
      enabled: true,
      single_msg: true,
    }];
    const categoriesStr = JSON.stringify(categories);
    const encryptedCategories  = compressAndEncrypt(categoriesStr, extendedKey, iv);

    await program.methods
      .updateCategory(encryptedCategories)
      .accounts({
        privyUser: privyUserPDA,
      })
      .rpc();
    
    const accountData = await program.account.privyUser.fetch(privyUserPDA);
    console.log(accountData)
    expect(accountData.categories).to.equal(encryptedCategories);
    expect(decompressAndDecrypt(accountData.categories, extendedKey, iv)).to.equal(categoriesStr);
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