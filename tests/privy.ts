import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { Privy } from "../target/types/privy";
import { expect } from 'chai';
import { off } from "process";

describe("privy", () => {

  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)

  const program = anchor.workspace.Privy as Program<Privy>;

  // const privy = anchor.web3.Keypair.generate();

  const user1 = {
    username: "arrayappy",
    passkey: "secret"
  }

  const [privyUserPDA, _] = PublicKey.findProgramAddressSync(
    [
      anchor.utils.bytes.utf8.encode('privy-user'),
      provider.wallet.publicKey.toBuffer()
    ],
    program.programId
  );

  it("Create user 1", async () => {

    await program.methods
      .createUser(user1.username, user1.passkey)
      .accounts({
        user: provider.wallet.publicKey,
        privyUser: privyUserPDA,
      })
      .rpc()

      const accountData = await program.account.privyUser.fetch(privyUserPDA)
      console.log(accountData);
      expect((accountData.username)).to.equal(user1.username);
  });
  

  it("Change username", async() => {
    const changedUsername = "arrayappy2";
    await program.methods
      .changeUsername(changedUsername)
      .accounts({
        user: provider.wallet.publicKey,
        privyUser: privyUserPDA
      })
      .rpc()

      const accountData = await program.account.privyUser.fetch(privyUserPDA)
      console.log(accountData);
      expect((accountData.username)).to.equal(changedUsername);
  });

  
});
