import { AnchorProvider, Program, BN } from "@coral-xyz/anchor";
import {
  Connection,
  PublicKey,
  Transaction,
  VersionedTransaction,
  TransactionInstruction,
} from "@solana/web3.js";
import { Privy, IDL } from "src/services/solana/idl";

type AnchorWallet = {
  publicKey: PublicKey;
  signAllTransactions<T extends Transaction | VersionedTransaction>(
    transactions: Array<T>
  ): Promise<Array<T>>;
  signTransaction<T extends Transaction | VersionedTransaction>(
    transaction: T
  ): Promise<T>;
};

function ixToTx(ix: TransactionInstruction) {
  const tx = new Transaction();
  tx.add(ix);
  return tx;
}

export default class PrivyClient {
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
    this.program = new Program<Privy>(IDL as any, provider);
  }

  async getPrivyUserPda(user: PublicKey): Promise<PublicKey> {
    const [pda] = PublicKey.findProgramAddressSync(
      [Buffer.from("privy-user"), user.toBuffer()],
      this.program.programId
    );
    return pda;
  }

  async createUserTx(
    user: PublicKey,
    username: string,
    encryptedCategories: string,
    depositLamports: BN
  ): Promise<Transaction> {
    const privyUserPDA = await this.getPrivyUserPda(user);
    const [privyConfigPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("privy-config")],
      this.program.programId
    );

    const tx = await this.program.methods
      .createUser(username, encryptedCategories, depositLamports)
      .accounts({
        user,
        privyUser: privyUserPDA,
        privyConfig: privyConfigPDA,
      })
      .transaction();

    return tx;
  }

  async addTokensTx(
    user: PublicKey,
    privyUser: PublicKey,
    depositLamports: BN
  ): Promise<Transaction> {
    const [privyConfigPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("privy-config")],
      this.program.programId
    );

    const tx = await this.program.methods
      .addTokens(depositLamports)
      .accounts({
        user,
        privyUser,
        privyConfig: privyConfigPDA,
      })
      .transaction();

    return tx;
  }
}
