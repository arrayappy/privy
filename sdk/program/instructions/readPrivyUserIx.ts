import * as anchor from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { PrivyProgram } from "../idl";
import { decompSymDec } from "../../utils/helpers";

export async function readPrivyUserIx(
  program: PrivyProgram,
  accounts: { privyUser: PublicKey },
  args: { extendedKey: Buffer, iv: Buffer }
) {
  const accountData = await program.account.privyUser.fetch(accounts.privyUser);
  accountData.messages = JSON.parse(decompSymDec(accountData.messages, args.extendedKey, args.iv));
  accountData.categories = JSON.parse(decompSymDec(accountData.categories, args.extendedKey, args.iv));
  return accountData;
}
