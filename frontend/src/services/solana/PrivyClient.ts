import { AnchorProvider, Program } from "@coral-xyz/anchor";
import {
  Connection,
  PublicKey,
  Transaction,
  VersionedTransaction,
  // TransactionInstruction,
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

// function ixToTx(ix: TransactionInstruction) {
//   const tx = new Transaction();
//   tx.add(ix);
//   return tx;
// }

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
}
