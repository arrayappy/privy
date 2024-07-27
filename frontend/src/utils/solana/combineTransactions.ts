import { Transaction, TransactionBlockhashCtor } from "@solana/web3.js";

export default function combineTransactions(
  transactions: Array<Transaction>,
  options?: TransactionBlockhashCtor
) {
  const combinedTransaction = new Transaction(options);
  transactions.forEach((transaction) =>
    transaction.instructions.forEach((instruction) => {
      combinedTransaction.add(instruction);
    })
  );
  return combinedTransaction;
}
