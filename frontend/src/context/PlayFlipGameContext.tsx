/* eslint-disable react/jsx-no-constructed-context-values */

import { Context, createContext, useState } from "react";
import useRecentPlaysQuery from "src/hooks/queries/useRecentPlaysQuery";
import HeadsOrTails from "src/types/HeadsOrTails";
import { Maybe } from "src/types/UtilityTypes";
import processFlip from "src/utils/api/post/processFlip";
import emptyFunction from "src/utils/emptyFunction";
import emptyFunctionAsync from "src/utils/emptyFunctionAsync";

type Step = "choose_bet" | "sending_transaction" | "results";

export type PlayFlipGameContextData = {
  amountInSol: Maybe<number>;
  didUserWinBet: Maybe<boolean>;
  headsOrTails: Maybe<HeadsOrTails>;
  processExistingAttemptFailed: boolean;
  processTxid: (txid: string) => Promise<void>;
  reset: () => void;
  step: Step;
  setAmountInSol: (val: Maybe<number>) => void;
  setDidUserWinBet: (val: Maybe<boolean>) => void;
  setHeadsOrTails: (val: Maybe<HeadsOrTails>) => void;
  setProcessExistingAttemptFailed: (val: boolean) => void;
  setStep: (val: Step) => void;
};

export const PlayFlipGameContext: Context<PlayFlipGameContextData> =
  createContext<PlayFlipGameContextData>({
    amountInSol: null,
    didUserWinBet: null,
    headsOrTails: null,
    processExistingAttemptFailed: false,
    processTxid: emptyFunctionAsync,
    reset: emptyFunction,
    step: "choose_bet",
    setAmountInSol: emptyFunction,
    setDidUserWinBet: emptyFunction,
    setHeadsOrTails: emptyFunction,
    setProcessExistingAttemptFailed: emptyFunction,
    setStep: emptyFunction,
  });

type ProviderProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: any;
};

export function PlayFlipGameContextProvider(props: ProviderProps): JSX.Element {
  const [amountInSol, setAmountInSol] = useState<Maybe<number>>(null);
  const [didUserWinBet, setDidUserWinBet] = useState<Maybe<boolean>>(null);
  const [headsOrTails, setHeadsOrTails] = useState<Maybe<HeadsOrTails>>(null);
  const [processExistingAttemptFailed, setProcessExistingAttemptFailed] =
    useState<boolean>(false);
  const [step, setStep] = useState<Step>("choose_bet");
  const { refetch } = useRecentPlaysQuery();

  return (
    <PlayFlipGameContext.Provider
      value={{
        amountInSol,
        didUserWinBet,
        headsOrTails,
        processExistingAttemptFailed,
        processTxid: async (txid) => {
          // setStep("processing_transaction");

          const { didUserWinBet: didUserWinBetInner } = await processFlip(txid);
          setDidUserWinBet(didUserWinBetInner);

          refetch();

          setStep("results");
        },
        reset: () => {
          setAmountInSol(null);
          setDidUserWinBet(null);
          setHeadsOrTails(null);
          setStep("choose_bet");
        },
        step,
        setAmountInSol,
        setDidUserWinBet,
        setHeadsOrTails,
        setProcessExistingAttemptFailed,
        setStep,
      }}
    >
      {props.children}
    </PlayFlipGameContext.Provider>
  );
}
