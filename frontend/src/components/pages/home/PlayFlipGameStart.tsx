import styles from "@/css/pages/home/PlayFlipGameStart.module.css";
import Header1 from "src/components/text/Header1";
import ColorClass from "src/types/enums/ColorClass";
import Header2 from "src/components/text/Header2";
import ButtonWithText from "src/components/buttons/ButtonWithText";
import FontClass from "src/types/enums/FontClass";
import ButtonTheme from "src/types/enums/ButtonTheme";
import formatDecimals from "src/utils/number/formatDecimals";
import usePlayFlipGameContext from "src/hooks/usePlayFlipGameContext";
import PlayFlipGameGeneric from "src/components/pages/home/PlayFlipGameGeneric";
// import useSolanaContext from "src/hooks/useSolanaContext";
// import invariant from "tiny-invariant";
// import { useWallet } from "@solana/wallet-adapter-react";
// import combineTransactions from "src/utils/solana/combineTransactions";
// import filterNulls from "src/utils/array/filterNulls";
// import notifyUnexpectedError from "src/utils/toast/notifyUnexpectedError";
// import * as anchor from "@coral-xyz/anchor";
import { BN } from "@coral-xyz/anchor";
import useBreakpoint from "src/hooks/useBreakpoint";
import { PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import useSolanaContext from "src/hooks/useSolanaContext";
// import PrivyClientType from "src/services/solana/PrivyClient";

function AmountButton({ amountInSol }: { amountInSol: number }) {
  const { amountInSol: amountInSolContext, setAmountInSol } =
    usePlayFlipGameContext();

  return (
    <ButtonWithText
      buttonTheme={
        amountInSolContext === amountInSol
          ? ButtonTheme.WinterGreen
          : ButtonTheme.Beige
      }
      className={styles.chooseAmountButton}
      fontClass={FontClass.Header2}
      onClick={() => setAmountInSol(amountInSol)}
      width="100%"
    >
      {formatDecimals(amountInSol, 0)} SOL
    </ButtonWithText>
  );
}

function ChooseAmount() {
  return (
    <div className={styles.chooseAmount}>
      <Header2
        colorClass={ColorClass.Navy}
        textAlign="center"
        textTransform="uppercase"
      >
        Choose how much
      </Header2>
      <div className={styles.chooseAmountButtons}>
        <AmountButton amountInSol={0.05} />
        <AmountButton amountInSol={0.1} />
        <AmountButton amountInSol={0.5} />
        <AmountButton amountInSol={1.0} />
      </div>
    </div>
  );
}

async function requestAirdrop(wallet, connection) {
  console.log("Requesting airdrop...");
  const signature = await connection.requestAirdrop(
    wallet.publicKey,
    2 * LAMPORTS_PER_SOL
  );
  await connection.confirmTransaction(signature, "confirmed");
  console.log(
    `Airdrop requested. View on explorer: https://solana.fm/tx/${signature}?cluster=devnet-alpha`
  );
}

// Function to check wallet balance
async function checkBalance(wallet, connection) {
  const balance = await connection.getBalance(wallet.publicKey);
  console.log(`Wallet balance: ${balance / LAMPORTS_PER_SOL} SOL`);
}

async function read(wallet, connection, privyClient) {
  try {
    const [privyUserPDA, bump] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("privy-user"),
        // new PublicKey("rusQnt24KNvkFkZmHopzrW9J1BNSBHK9tdu34ecY3fr").toBuffer(),
        wallet.publicKey.toBuffer(),
      ],
      privyClient.program.programId
    );
    const accountData = await privyClient.program.account.privyUser.fetch(
      privyUserPDA
    );
    console.log("accountData", accountData);
  } catch (e) {
    console.error(e);
  }
}

async function write(wallet, connection, privyClient) {
  console.log("t0", privyClient.program.programId);
  const [privyUserPDA, bump] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("privy-user"),
      // new PublicKey("rusQnt24KNvkFkZmHopzrW9J1BNSBHK9tdu34ecY3fr").toBuffer(),
      wallet.publicKey.toBuffer(),
    ],
    privyClient.program.programId
  );
  const [privyConfigPDA, _] = PublicKey.findProgramAddressSync(
    [Buffer.from("privy-config")],
    privyClient.program.programId
  );
  const tx1 = await privyClient.program.methods
    .createUser("sunny", "sunny", new BN(1 * LAMPORTS_PER_SOL))
    .accounts({
      user: wallet.publicKey,
      privyUser: privyUserPDA,
      privyConfig: privyConfigPDA,
    })
    .transaction();
  const signature = await wallet.sendTransaction(tx1, connection);
  console.log(
    `View on explorer: https://solana.fm/tx/${signature}?cluster=devnet-alpha`
  );
}

export default function PlayFlipGameStart() {
  const { amountInSol, setStep } = usePlayFlipGameContext();
  const { connection, privyClient } = useSolanaContext();
  console.log("t1", privyClient);
  const wallet = useWallet();
  const { isTabletBreakpoint } = useBreakpoint();

  return (
    <PlayFlipGameGeneric fadeIn rowGap={isTabletBreakpoint ? 36 : 48}>
      <Header1
        colorClass={ColorClass.Navy}
        textAlign="center"
        textTransform="uppercase"
      >
        100 Privy Tokens Per 1 Devnet Sol
      </Header1>
      <ChooseAmount />
      <ButtonWithText
        buttonTheme={ButtonTheme.Yellow}
        disabled={amountInSol == null}
        fontClass={FontClass.Header1}
        onClick={async () => {
          // setStep("sending_transaction");
          // await requestAirdrop(wallet, connection);
          await checkBalance(wallet, connection);
          await write(wallet, connection, privyClient);
          // await read(wallet, connection, privyClient);
        }}
        textTransform="uppercase"
        style={{ width: isTabletBreakpoint ? 270 : 300 }}
        width="100%"
      >
        Add Tokens
      </ButtonWithText>
    </PlayFlipGameGeneric>
  );
}
