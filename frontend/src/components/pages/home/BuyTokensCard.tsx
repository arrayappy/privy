import styles from "@/css/pages/home/PlayFlipGameStart.module.css";
import Header1 from "src/components/text/Header1";
import ColorClass from "src/types/enums/ColorClass";
import Header2 from "src/components/text/Header2";
import ButtonWithText from "src/components/buttons/ButtonWithText";
import FontClass from "src/types/enums/FontClass";
import ButtonTheme from "src/types/enums/ButtonTheme";
import formatDecimals from "src/utils/number/formatDecimals";
import { BN } from "@coral-xyz/anchor";
import useBreakpoint from "src/hooks/useBreakpoint";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import useSolanaContext from "src/hooks/useSolanaContext";
import PlayFlipGameGeneric from "src/components/pages/home/PlayFlipGameGeneric";
import { useState } from "react";

const TOKENS_PER_SOL = 100;

function AmountButton({ amountInSol, onSelect, isSelected }: { 
  amountInSol: number;
  onSelect: (amount: number) => void;
  isSelected: boolean;
}) {
  return (
    <ButtonWithText
      buttonTheme={
        isSelected
          ? ButtonTheme.WinterGreen
          : ButtonTheme.Beige
      }
      className={styles.chooseAmountButton}
      fontClass={FontClass.Header2}
      onClick={() => onSelect(amountInSol)}
      width="100%"
    >
      {formatDecimals(amountInSol, 1)} SOL
    </ButtonWithText>
  );
}

function ChooseAmount({ onSelect, selectedAmount }: {
  onSelect: (amount: number) => void;
  selectedAmount: number | null;
}) {
  const amounts = [0.05, 0.1, 0.5, 1.0];

  return (
    <div className={styles.chooseAmount}>
      <Header2
        colorClass={ColorClass.Navy}
        textAlign="center"
        textTransform="uppercase"
      >
        Choose Amount
      </Header2>
      <div className={styles.chooseAmountButtons}>
        {amounts.map((amount) => (
          <AmountButton 
            key={amount}
            amountInSol={amount}
            onSelect={onSelect}
            isSelected={selectedAmount === amount}
          />
        ))}
      </div>
    </div>
  );
}

export default function BuyTokensCard() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const wallet = useWallet();
  const { connection, privyClient } = useSolanaContext();
  const { isTabletBreakpoint } = useBreakpoint();

  const handleBuyTokens = async () => {
    if (!selectedAmount || !privyClient || !wallet.publicKey) return;

    setIsLoading(true);
    try {
      const lamports = new BN(selectedAmount * LAMPORTS_PER_SOL);
      const privyUserPDA = await privyClient.getPrivyUserPda(wallet.publicKey);
      
      const tx = await privyClient.addTokensTx(
        wallet.publicKey,
        privyUserPDA,
        lamports
      );

      const signature = await wallet.sendTransaction(tx, connection!);
      await connection!.confirmTransaction(signature, "confirmed");
    } catch (error) {
      console.error("Failed to buy tokens:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const tokenAmount = selectedAmount ? TOKENS_PER_SOL * selectedAmount : 0;

  return (
    <PlayFlipGameGeneric fadeIn rowGap={isTabletBreakpoint ? 36 : 48}>
      <Header1
        colorClass={ColorClass.Navy}
        textAlign="center"
        textTransform="uppercase"
      >
        100 Privy Tokens Per 1 Devnet Sol
      </Header1>
      <ChooseAmount onSelect={setSelectedAmount} selectedAmount={selectedAmount} />
      <ButtonWithText
        buttonTheme={ButtonTheme.Yellow}
        disabled={selectedAmount == null || isLoading}
        fontClass={FontClass.Header1}
        onClick={handleBuyTokens}
        textTransform="uppercase"
        style={{ width: isTabletBreakpoint ? "270px" : "310px" }}
      >
        {isLoading ? "Processing..." : `Buy ${tokenAmount} Tokens`}
      </ButtonWithText>
    </PlayFlipGameGeneric>
  );
}