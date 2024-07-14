import { Transaction, TransactionInstruction } from "@solana/web3.js";

function ixToTx(ix: TransactionInstruction) {
  const tx = new Transaction();
  tx.add(ix);
  return tx;
}

function ixsToTx(ixs: Array<TransactionInstruction>) {
  const tx = new Transaction();
  ixs.forEach((ix) => tx.add(ix));
  return tx;
}

export {
  ixToTx,
  ixsToTx
}