import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { Privy } from "../target/types/privy";
import { expect } from 'chai';

// const sleep = async (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const crypto = require('crypto');
const zlib = require('zlib');

function extendKey(key, length) {
    return Buffer.from(key.repeat(Math.ceil(length / key.length)).slice(0, length));
}

function compressData(data) {
    return zlib.brotliCompressSync(Buffer.from(data));
}

function decompressData(data) {
    return zlib.brotliDecompressSync(data).toString('utf8');
}

function encrypt(data, key, iv) {
    let cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
    let encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
    return encrypted.toString('base64');
}

function decrypt(encryptedData, key, iv) {
    let decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
    let decrypted = Buffer.concat([decipher.update(Buffer.from(encryptedData, 'base64')), decipher.final()]);
    return decrypted;
}

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

describe("Privy Config", () => {

  it("Initialize Privy Config", async () => {
    await program.methods
      .initializePrivyConfig(tokensPerSol)
      .accounts({
        owner: provider.wallet.publicKey.toString(),
        privyConfig: privyConfigPDA,
        systemProgram: SystemProgram.programId,
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
    
    await program.methods
      .createUser(userData.username, userData.passkey, new anchor.BN(depositLamports))
      .accounts({
        user: provider.wallet.publicKey,
        privyUser: privyUserPDA,
        privyConfig: privyConfigPDA,
        systemProgram: SystemProgram.programId,
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
        systemProgram: SystemProgram.programId,
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
        systemProgram: SystemProgram.programId,
      })
      .rpc()
    // console.log(tx)
    // console.log('x', await program.account.privyConfig.getAccountInfo(privyConfigPDA));
  })

  it("Insert message into messages vector", async () => {
    const catIdx = 0;
    const passkey = "secret";
    const message = "hi";

    let key = "key1";
    let iv = Buffer.from("anexampleiv12345"); // 16 bytes for AES-128

    let extendedKey = extendKey(key, 16);

    let compressedData = compressData(message);
    let encryptedData = encrypt(compressedData, extendedKey, iv);

    await program.methods.insertMessage(catIdx, passkey, encryptedData).accounts({
      owner: provider.wallet.publicKey,
      privyConfig: privyConfigPDA,
      privyUser: privyUserPDA,
      systemProgram: SystemProgram.programId,
    })
    .rpc();

    const accountData = await program.account.privyUser.fetch(privyUserPDA);
    console.log(accountData)
    expect(accountData.messages).to.equal(encryptedData);
  })

});

describe("Privy User Categories", () => {

  it("Create Category", async () => {
    const catName = "General";
    const passkey = "secret_passkey";
    const enabled = true;
    const singleMsg = false;

    await program.methods
      .createCategory(catName, passkey, enabled, singleMsg)
      .accounts({
        privyUser: privyUserPDA,
        systemProgram: SystemProgram.programId,
      })
      .rpc();
    
    const accountData = await program.account.privyUser.fetch(privyUserPDA);
    console.log(accountData)
    const category = accountData.categories[1];
    expect(category.catName).to.equal(catName);
    expect(category.passkey).to.equal(passkey);
    expect(category.enabled).to.equal(enabled);
    expect(category.singleMsg).to.equal(singleMsg);
  });

  it("Update Category", async () => {
    const catIdx = 1;
    const newCatName = "Updated General";
    const newPasskey = "new_secret_passkey";
    const enabled = false;
    const singleMsg = true;

    await program.methods
      .updateCategory(catIdx, newCatName, newPasskey, enabled, singleMsg)
      .accounts({
        privyUser: privyUserPDA,
        systemProgram: SystemProgram.programId,
      })
      .rpc();
    
    const accountData = await program.account.privyUser.fetch(privyUserPDA);
    const category = accountData.categories[1];
    expect(category.catName).to.equal(newCatName);
    expect(category.passkey).to.equal(newPasskey);
    expect(category.enabled).to.equal(enabled);
    expect(category.singleMsg).to.equal(singleMsg);
  });

  it("Delete Category", async () => {
    const catIdx = 1;

    await program.methods
      .deleteCategory(catIdx)
      .accounts({
        privyUser: privyUserPDA,
        systemProgram: SystemProgram.programId,
      })
      .rpc();
    
    const accountData = await program.account.privyUser.fetch(privyUserPDA);
    const category = accountData.categories[1];
    expect(category).to.be.null;
  });
  
});

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