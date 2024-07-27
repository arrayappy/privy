import SolanaNetwork from "src/types/enums/SolanaNetwork";

export default function getSolanaNetwork(): SolanaNetwork {
  return process.env.NEXT_PUBLIC_SOLANA_NETWORK as SolanaNetwork;
}
