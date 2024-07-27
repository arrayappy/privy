import PlayFlipGameResults from "src/components/pages/home/PlayFlipGameResults";
import PlayFlipGameSendingTransaction from "src/components/pages/home/PlayFlipGameSendingTransaction";
import PlayFlipGameStart from "src/components/pages/home/PlayFlipGameStart";
import { PlayFlipGameContextProvider } from "src/context/PlayFlipGameContext";
import usePlayFlipGameContext from "src/hooks/usePlayFlipGameContext";
import useProcessExistingBet from "src/hooks/useProcessExistingBet";
import assertUnreachable from "src/utils/assertUnreachable";

function InsideContext() {
  const { step } = usePlayFlipGameContext();
  useProcessExistingBet();

  switch (step) {
    case "choose_bet":
      return <PlayFlipGameStart />;
    case "sending_transaction":
      return <PlayFlipGameSendingTransaction />;
    case "results":
      return <PlayFlipGameResults />;
    default:
      return assertUnreachable(step);
  }
}

export default function PlayFlipGame() {
  return (
    <PlayFlipGameContextProvider>
      <InsideContext />
    </PlayFlipGameContextProvider>
  );
}
