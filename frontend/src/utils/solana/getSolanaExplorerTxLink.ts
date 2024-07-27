import getSolanaNetwork from "src/utils/solana/getSolanaNetwork";

export default function getSolanaExplorerTxLink(txid: string) {
  return `https://explorer.solana.com/tx/${txid}?cluster=${getSolanaNetwork()}`;
}
