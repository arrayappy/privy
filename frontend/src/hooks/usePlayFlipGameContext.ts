import { useContext } from "react";
import { PlayFlipGameContext } from "src/context/PlayFlipGameContext";

export default function usePlayFlipGameContext() {
  return useContext(PlayFlipGameContext);
}
