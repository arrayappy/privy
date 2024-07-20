import { AnchorProvider, BN, Program } from "@coral-xyz/anchor";
import {
  Connection,
  PublicKey,
  Transaction,
  VersionedTransaction,
} from "@solana/web3.js";
import { Privy, PrivyIdl } from "./idl";
import { ixToTx } from "./utils";
import {
  addTokensIx,
  allocateSpaceIx,
  createUserIx,
  initializePrivyConfigIx,
  insertMessageIx,
  updateCategoryIx,
  updatePrivyConfigIx,
  updateUsernameIx,
  withdrawBalanceIx
} from "./instructions";
import { getPrivyConfigPda, getPrivyUserPda } from "./pdas";
import { decompAsymDec, decompSymDec } from "../utils/helpers";

type AnchorWallet = {
  publicKey: PublicKey;
  signAllTransactions<T extends Transaction | VersionedTransaction>(
    transactions: Array<T>
  ): Promise<Array<T>>;
  signTransaction<T extends Transaction | VersionedTransaction>(
    transaction: T
  ): Promise<T>;
};

export default class PrivySdk {
  private connection: Connection;

  public program: Program<Privy>;

  private authority: PublicKey;

  constructor({
    authority,
    connection,
    wallet,
  }: {
    authority: PublicKey;
    connection: Connection;
    wallet: AnchorWallet;
  }) {
    this.connection = connection;

    this.authority = authority;

    const provider = new AnchorProvider(connection, wallet, {
      preflightCommitment: "recent",
    });

    this.program = new Program<Privy>(PrivyIdl as any, provider);
  }

  async initializePrivyConfigTx(tokensPerSol: number): Promise<Transaction> {
    const ix = await initializePrivyConfigIx(this.program, {
      owner: this.authority
    }, {
      tokensPerSol
    })
    return ixToTx(ix);
  }

  async updatePrivyConfigTx(newTokensPerSol: number): Promise<Transaction> {
    const ix = await updatePrivyConfigIx(this.program, {
      owner: this.authority
    }, {
      newTokensPerSol
    })
    return ixToTx(ix);
  }

  async createUserTx(
    user: PublicKey,
    username: string,
    encryptedCategories: string,
    depositLamports: BN
  ): Promise<Transaction> {
    const privyUserPDA = getPrivyUserPda(this.program.programId, user);
    const allocateSpaceIxs = await allocateSpaceIx(this.program, user, privyUserPDA, 10000, 2);

    const ix = await createUserIx(
      this.program, 
      { user }, 
      { username, encryptedCategories, depositLamports },
      allocateSpaceIxs
    );
    return ixToTx(ix);
  }

  async updateUsernameTx(privyUser: PublicKey, newUsername: string): Promise<Transaction> {
    const ix = await updateUsernameIx(this.program, { privyUser }, { newUsername });
    return ixToTx(ix);
  }

  async addTokensTx(user: PublicKey, privyUser: PublicKey, depositLamports: BN): Promise<Transaction> {
    const privyUserPDA = getPrivyUserPda(this.program.programId, user);
    const allocateSpaceIxs = await allocateSpaceIx(this.program, user, privyUserPDA, 10000, 2);
    const ix = await addTokensIx(this.program, { user, privyUser }, { depositLamports }, allocateSpaceIxs);

    return ixToTx(ix);
  } 

  async withdrawBalanceTx(owner: PublicKey, lamports: BN): Promise<Transaction> {
    const ix = await withdrawBalanceIx(this.program, { owner }, { lamports });
    return ixToTx(ix);
  }

  async insertMessageTx(owner: PublicKey, privyUser: PublicKey, encryptedMessage: string): Promise<Transaction> {
    const ix = await insertMessageIx(this.program, { owner, privyUser }, { encryptedMessage });
    return ixToTx(ix);
  }

  async updateCategoryTx(privyUser: PublicKey, encryptedCategories: string): Promise<Transaction> {
    const ix = await updateCategoryIx(this.program, { privyUser }, { encryptedCategories });
    return ixToTx(ix);
  }

  async readPrivyUser(privyUser: PublicKey, args: { extendedKey: Buffer, iv: Buffer, privateKeyPem: string }) {
    const accountData = await this.program.account.privyUser.fetch(privyUser);
    accountData.messages =  accountData.messages.map((encryptedMsg) => decompAsymDec(encryptedMsg, args.privateKeyPem));
    accountData.categories = JSON.parse(decompSymDec(accountData.categories, args.extendedKey, args.iv));
    return accountData;
  }

  async getPrivyConfigPda() {
    return getPrivyConfigPda(this.program.programId);
  }

  async getPrivyUserPda(user: PublicKey) {
    return getPrivyUserPda(this.program.programId, user);
  }
}
