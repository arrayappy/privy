import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { expect } from "chai";

import { compSymEnc, decompSymDec } from "@privy/sdk/utils/helpers";
import { symmetricExtendKey } from "@privy/sdk/utils/symmetric";
import { Privy } from "@privy/sdk/program/";
import PrivySdk from "@privy/sdk/program";

const provider = anchor.AnchorProvider.local();
const program = anchor.workspace.Privy as Program<Privy>;

anchor.setProvider(provider);
console.log(`Using wallet: ${provider.wallet.publicKey.toString()}`);

console.log("programId", program.programId.toString());

const tokensPerSol = 50;
const newTokensPerSol = 100;

const userData = {
  username: "arrayappy",
  passkey: "secret"
};

let key = "key1";
let iv = Buffer.from("anexampleiv12345"); // 16 bytes for AES-128
let extendedKey = symmetricExtendKey(key, 16);

const sdk = new PrivySdk({
  authority: provider.wallet.publicKey,
  connection: provider.connection,
  wallet: provider.wallet,
});

describe("Privy Config", () => {
  it("Initialize Privy Config", async () => {
    const tx = await sdk.initializePrivyConfigTx(tokensPerSol);
    await provider.sendAndConfirm(tx);

    const privyConfigPDA = await sdk.program.account.privyConfig.all();
    const configData = privyConfigPDA[0];
    expect(configData.account.tokensPerSol).to.equal(tokensPerSol);
  });

  it("Update Privy Config", async () => {
    const tx = await sdk.updatePrivyConfigTx(newTokensPerSol);
    await provider.sendAndConfirm(tx);

    const privyConfigPDA = await sdk.program.account.privyConfig.all();
    const updatedConfigData = privyConfigPDA[0];
    expect(updatedConfigData.account.tokensPerSol).to.equal(newTokensPerSol);
  });
});

describe("Privy User", () => {
  it("Create User", async () => {
    const depositLamports = new anchor.BN(1 * anchor.web3.LAMPORTS_PER_SOL);
    const categories = [{
      cat_name: "cat1",
      passkey: "cat_secret",
      enabled: true,
      single_msg: false,
    }];
    const categoriesStr = JSON.stringify(categories);
    const encryptedCategories = compSymEnc(categoriesStr, extendedKey, iv);
    try{
      const tx = await sdk.createUserTx(
        provider.wallet.publicKey,
        userData.username,
        encryptedCategories,
        depositLamports
      );
      await provider.sendAndConfirm(tx);
    } catch(e) {
      console.log(e)
    }

    const privyUserPDA = await sdk.program.account.privyUser.all();
    const accountData = privyUserPDA[0];
    console.log("accountData", accountData);
    expect(accountData.account.username).to.equal(userData.username);
    expect(accountData.account.tokenLimit).to.equal(Math.floor(depositLamports.toNumber() / anchor.web3.LAMPORTS_PER_SOL * newTokensPerSol));
  });

  it("Update Username", async () => {
    const newUsername = "naidu";
    const privyUserPDA = await sdk.program.account.privyUser.all();
    const privyUser = privyUserPDA[0].publicKey;
    
    const tx = await sdk.updateUsernameTx(privyUser, newUsername);
    await provider.sendAndConfirm(tx);

    const updatedAccountData = await sdk.program.account.privyUser.fetch(privyUser);
    expect(updatedAccountData.username).to.equal(newUsername);
  });

  it("Add tokens", async () => {
    const depositLamports = new anchor.BN(1 * anchor.web3.LAMPORTS_PER_SOL);
    const privyUserPDA = await sdk.program.account.privyUser.all();
    const privyUser = privyUserPDA[0].publicKey;
    
    const tx = await sdk.addTokensTx(provider.wallet.publicKey, privyUser, depositLamports);
    await provider.sendAndConfirm(tx);

    const accountData = await sdk.program.account.privyUser.fetch(privyUser);
    const expectedTokensLength = Math.floor((2 * anchor.web3.LAMPORTS_PER_SOL) / anchor.web3.LAMPORTS_PER_SOL * newTokensPerSol);
    expect(accountData.tokenLimit).to.equal(expectedTokensLength);
  });
});

describe("Privy Admin", () => {
  it("Withdraw Balance", async () => {
    const lamports = new anchor.BN(0.4 * anchor.web3.LAMPORTS_PER_SOL);
    const tx = await sdk.withdrawBalanceTx(provider.wallet.publicKey, lamports);
    await provider.sendAndConfirm(tx);
  });

  it("Insert message into messages vector", async () => {
    const messages = JSON.stringify(["0:hi"]);
    const encryptedMessages = compSymEnc(messages, extendedKey, iv);
    const privyUserPDA = await sdk.program.account.privyUser.all();
    const privyUser = privyUserPDA[0].publicKey;
    
    const tx = await sdk.insertMessageTx(provider.wallet.publicKey, privyUser, encryptedMessages);
    await provider.sendAndConfirm(tx);

    const accountData = await sdk.program.account.privyUser.fetch(privyUser);
    console.log(accountData);
    expect(accountData.messages).to.deep.equal(encryptedMessages);
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
    const privyUserPDA = await sdk.program.account.privyUser.all();
    const privyUser = privyUserPDA[0].publicKey;
    
    const tx = await sdk.updateCategoryTx(privyUser, encryptedCategories);
    await provider.sendAndConfirm(tx);

    const accountData = await sdk.program.account.privyUser.fetch(privyUser);
    console.log(accountData);
    expect(accountData.categories).to.deep.equal(encryptedCategories);
    expect(decompSymDec(accountData.categories, extendedKey, iv)).to.equal(categoriesStr);
  });
});

describe("Read", () => {
  it("Read Privy User", async () => {
    const privyUserPDA = await program.account.privyUser.all();
    const privyUser = privyUserPDA[0].publicKey;
    const accountData = await sdk.readPrivyUser(privyUser, { extendedKey, iv });
    console.log(accountData);
  });
});
