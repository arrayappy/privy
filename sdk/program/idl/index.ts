import { Program } from "@coral-xyz/anchor";

import { Privy } from "./privy";
import PrivyIdl from "./privy.json";

export {
  Privy,
  PrivyIdl
};

export type PrivyProgram = Program<Privy>;