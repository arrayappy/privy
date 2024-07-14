import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { expect } from "chai";

import { compSymEnc, decompSymDec } from "@privy/sdk/utils/helpers";
import { symmetricExtendKey } from "@privy/sdk/utils/symmetric";
import { Privy } from "@privy/sdk/program/";
import {
  initializePrivyConfigIx,
  updatePrivyConfigIx,
  createUserIx,
  updateUsernameIx,
  addTokensIx,
  withdrawBalanceIx,
  insertMessageIx,
  updateCategoryIx,
  readPrivyUserIx,
} from "@privy/sdk/program";

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

describe("Privy Config", () => {
  it("Initialize Privy Config", async () => {
    await initializePrivyConfigIx(program, { owner: provider.wallet.publicKey }, { tokensPerSol });

    const privyConfigPDA = await program.account.privyConfig.all();
    const configData = privyConfigPDA[0];
    expect(configData.account.tokensPerSol).to.equal(tokensPerSol);
  });

  it("Update Privy Config", async () => {
    await updatePrivyConfigIx(program, { owner: provider.wallet.publicKey }, { newTokensPerSol });

    const privyConfigPDA = await program.account.privyConfig.all();
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
    const encryptedCategories = compSymEnc(categories, extendedKey, iv);

    await createUserIx(program, { user: provider.wallet.publicKey }, { username: userData.username, encryptedCategories, depositLamports });

    const privyUserPDA = await program.account.privyUser.all();
    const accountData = privyUserPDA[0];
    console.log("accountData", accountData);
    expect(accountData.account.username).to.equal(userData.username);
    expect(accountData.account.tokenLimit).to.equal(Math.floor(depositLamports.toNumber() / anchor.web3.LAMPORTS_PER_SOL * newTokensPerSol));
  });

  it("Update Username", async () => {
    const newUsername = "naidu";
    const privyUserPDA = await program.account.privyUser.all();
    const privyUser = privyUserPDA[0].publicKey;
    await updateUsernameIx(program, { privyUser }, { newUsername });

    const updatedAccountData = await program.account.privyUser.fetch(privyUser);
    expect(updatedAccountData.username).to.equal(newUsername);
  });

  it("Add tokens", async () => {
    const depositLamports = new anchor.BN(1 * anchor.web3.LAMPORTS_PER_SOL);
    const privyUserPDA = await program.account.privyUser.all();
    const privyUser = privyUserPDA[0].publicKey;

    await addTokensIx(program, { user: provider.wallet.publicKey, privyUser }, { depositLamports });

    const accountData = await program.account.privyUser.fetch(privyUser);
    const expectedTokensLength = Math.floor((2 * anchor.web3.LAMPORTS_PER_SOL) / anchor.web3.LAMPORTS_PER_SOL * newTokensPerSol);
    expect(accountData.tokenLimit).to.equal(expectedTokensLength);
  });
});

describe("Privy Admin", () => {
  it("Withdraw Balance", async () => {
    const lamports = new anchor.BN(0.4 * anchor.web3.LAMPORTS_PER_SOL);
    await withdrawBalanceIx(program, { owner: provider.wallet.publicKey }, { lamports });
  });

  it("Insert message into messages vector", async () => {
    const messages = JSON.stringify(["0:hi"]);
    const encryptedMessages = compSymEnc(messages, extendedKey, iv);

    const privyUserPDA = await program.account.privyUser.all();
    const privyUser = privyUserPDA[0].publicKey;
    await insertMessageIx(program, { owner: provider.wallet.publicKey, privyUser }, { encryptedMessages });

    const accountData = await program.account.privyUser.fetch(privyUser);
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

    const privyUserPDA = await program.account.privyUser.all();
    const privyUser = privyUserPDA[0].publicKey;
    await updateCategoryIx(program, { privyUser }, { encryptedCategories });

    const accountData = await program.account.privyUser.fetch(privyUser);
    console.log(accountData);
    expect(accountData.categories).to.equal(encryptedCategories);
    expect(decompSymDec(accountData.categories, extendedKey, iv)).to.equal(categoriesStr);
  });
});

describe("Read", () => {
  it("Read Privy User", async () => {
    const privyUserPDA = await program.account.privyUser.all();
    const privyUser = privyUserPDA[0].publicKey;
    const accountData = await readPrivyUserIx(program, { privyUser }, { extendedKey, iv });
    console.log(accountData);
  });
});
