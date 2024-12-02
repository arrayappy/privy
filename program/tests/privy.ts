import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { expect } from "chai";

import { compSymEnc, decompSymDec, compAsymEnc, decompAsymDec, getPasswordSalt } from "@privy/sdk/utils/helpers";
import { generateKeypair } from "@privy/sdk/utils/asymmetric";
import { symmetricExtendKey } from "@privy/sdk/utils/symmetric";
import { Privy } from "@privy/sdk/program/";
import PrivySdk from "@privy/sdk/program";

let provider: anchor.AnchorProvider;
let program: anchor.Program<Privy>;

describe("Privy", () => {
  before(async () => {
    try {
      provider = anchor.AnchorProvider.local("https://api.devnet.solana.com");
      anchor.setProvider(provider);
      program = anchor.workspace.Privy as Program<Privy>;
      
      console.log(`Using wallet: ${provider.wallet.publicKey.toString()}`);
      console.log("programId", program.programId.toString());
    } catch (error) {
      console.error("Setup failed:", error);
      throw new Error("Please ensure local validator is running: 'solana-test-validator'");
    }
  });

  const tokensPerSol = 100;
  const newTokensPerSol = 100;
  const userData = {
    username: "arrayappy",
    passkey: "secret"
  };
  
  let key = "key1";
  let iv = Buffer.from("anexampleiv12345"); // 16 bytes for AES-128
  let extendedKey = symmetricExtendKey(key, 16);
  let { publicKeyPem, privateKeyPem } = generateKeypair(key);
  let sdk: PrivySdk;

  beforeEach(() => {
    sdk = new PrivySdk({
      authority: provider.wallet.publicKey,
      connection: provider.connection,
      wallet: provider.wallet,
    });
  });

  describe("Privy Config", () => {
    it("Initialize Privy Config", async () => {
      try {
        const tx = await sdk.initializePrivyConfigTx(tokensPerSol);
        await provider.sendAndConfirm(tx);

        const privyConfigPDA = await sdk.program.account.privyConfig.all();
        const configData = privyConfigPDA[0];
        expect(configData.account.tokensPerSol).to.equal(tokensPerSol);
      } catch (error) {
        console.error("Test failed:", error);
        throw error;
      }
    });

    it("Update Privy Config", async () => {
      try {
        const tx = await sdk.updatePrivyConfigTx(newTokensPerSol);
        await provider.sendAndConfirm(tx);

        const privyConfigPDA = await sdk.program.account.privyConfig.all();
        const updatedConfigData = privyConfigPDA[0];
        expect(updatedConfigData.account.tokensPerSol).to.equal(newTokensPerSol);
      } catch (error) {
        console.error("Test failed:", error);
        throw error;
      }
    });
  });

  describe("Privy User", () => {
    it("Create User", async () => {
      try {
        const depositLamports = new anchor.BN(1 * anchor.web3.LAMPORTS_PER_SOL);
        const categories = [{
          cat_name: "cat1",
          passkey: "cat_secret",
          enabled: true,
          single_msg: false,
        }];
        const categoriesStr = JSON.stringify(categories);
        const encryptedCategories = compSymEnc(categoriesStr, extendedKey, iv);

        const tx = await sdk.createUserTx(
          provider.wallet.publicKey,
          userData.username,
          encryptedCategories,
          depositLamports
        );
        await provider.sendAndConfirm(tx);

        const privyUserPDA = await sdk.program.account.privyUser.all();
        const accountData = privyUserPDA[0];
        expect(accountData.account.username).to.equal(userData.username);
        expect(accountData.account.tokenLimit).to.equal(
          Math.floor(depositLamports.toNumber() / anchor.web3.LAMPORTS_PER_SOL * newTokensPerSol)
        );
      } catch (error) {
        console.error("Test failed:", error);
        throw error;
      }
    });

    it("Update Username", async () => {
      try {
        const newUsername = "naidu";
        const privyUserPDA = await sdk.program.account.privyUser.all();
        const privyUser = privyUserPDA[0].publicKey;

        const tx = await sdk.updateUsernameTx(privyUser, newUsername);
        await provider.sendAndConfirm(tx);

        const updatedAccountData = await sdk.program.account.privyUser.fetch(privyUser);
        expect(updatedAccountData.username).to.equal(newUsername);
      } catch (error) {
        console.error("Test failed:", error);
        throw error;
      }
    });

    it("Add tokens", async () => {
      try {
        const depositLamports = new anchor.BN(1 * anchor.web3.LAMPORTS_PER_SOL);
        const privyUserPDA = await sdk.program.account.privyUser.all();
        const privyUser = privyUserPDA[0].publicKey;

        const tx = await sdk.addTokensTx(provider.wallet.publicKey, privyUser, depositLamports);
        await provider.sendAndConfirm(tx);

        const accountData = await sdk.program.account.privyUser.fetch(privyUser);
        const expectedTokensLength = Math.floor(
          (2 * anchor.web3.LAMPORTS_PER_SOL) / anchor.web3.LAMPORTS_PER_SOL * newTokensPerSol
        );
        expect(accountData.tokenLimit).to.equal(expectedTokensLength);
      } catch (error) {
        console.error("Test failed:", error);
        throw error;
      }
    });
  });

  describe("Privy Admin", () => {
    it("Withdraw Balance", async () => {
      try {
        const lamports = new anchor.BN(0.4 * anchor.web3.LAMPORTS_PER_SOL);
        const tx = await sdk.withdrawBalanceTx(provider.wallet.publicKey, lamports);
        await provider.sendAndConfirm(tx);
      } catch (error) {
        console.error("Test failed:", error);
        throw error;
      }
    });

    it("Insert message into messages vector", async () => {
      try {
        const message = JSON.stringify("0:hi");
        const encryptedMessage = compAsymEnc(message, publicKeyPem);

        const privyUserPDA = await sdk.program.account.privyUser.all();
        const privyUser = privyUserPDA[0].publicKey;

        const tx = await sdk.insertMessageTx(provider.wallet.publicKey, privyUser, encryptedMessage);
        await provider.sendAndConfirm(tx);
        const accountData = await sdk.readPrivyUser(privyUser, { extendedKey, iv, privateKeyPem });

        expect(accountData.messages[0]).to.equal(message);
      } catch (error) {
        console.error("Test failed:", error);
        throw error;
      }
    });
  });

  describe("Privy User Categories", () => {
    it("Update Category", async () => {
      try {
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
        expect(accountData.categories).to.deep.equal(encryptedCategories);
        expect(decompSymDec(accountData.categories, extendedKey, iv)).to.equal(categoriesStr);
      } catch (error) {
        console.error("Test failed:", error);
        throw error;
      }
    });
  });

  describe("Read", () => {
    it("Read Privy User", async () => {
      try {
        const privyUserPDA = await program.account.privyUser.all();
        const privyUser = privyUserPDA[0].publicKey;
        const accountData = await sdk.readPrivyUser(privyUser, { extendedKey, iv, privateKeyPem });
        expect(accountData).to.not.be.undefined;
      } catch (error) {
        console.error("Test failed:", error);
        throw error;
      }
    });
  });
});
