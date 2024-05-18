import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { Privy } from "../target/types/privy";
import { expect } from 'chai';

describe("privy", () => {
  // Initialize the provider and set it as the default provider
  const provider = anchor.AnchorProvider.local();
  anchor.setProvider(provider);

  // Define the program instance
  const program = anchor.workspace.Privy as Program<Privy>;
  console.log(program.programId.toString())
  // Define the PDA for the privy config account
  const [privyConfigPDA, _] = PublicKey.findProgramAddressSync(
    [anchor.utils.bytes.utf8.encode('privy-config'), provider.wallet.publicKey.toBuffer()],
    program.programId
  );
  console.log('privyConfigPDA', privyConfigPDA.toString())
  // Define user data for the tests
  const userData = {
    username: "arrayappy",
    passkey: "secret"
  };

  // Define the PDA for the privy user account
  const [privyUserPDA, bump] = PublicKey.findProgramAddressSync(
    [
      anchor.utils.bytes.utf8.encode('privy-user'),
      provider.wallet.publicKey.toBuffer()
    ],
    program.programId
  );


  it("Initialize Privy Config", async () => {
    const tokensPerSol = 10;
    await program.methods
      .initializePrivyConfig(tokensPerSol)
      .accounts({
        privyConfig: privyConfigPDA,
        owner: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    // Fetch and verify the privy config account data
    const configData = await program.account.privyConfig.fetch(privyConfigPDA);
    console.log(configData);
    expect(configData.tokensPerSol).to.equal(tokensPerSol);
  });

  // it("Update Privy Config", async () => {
  //   const newTokensPerSol = 20;

  //   await program.methods
  //     .updatePrivyConfig(newTokensPerSol)
  //     .accounts({
  //       privyConfig: privyConfigPDA,
  //       owner: provider.wallet.publicKey,
  //     })
  //     .rpc();

  //   // Fetch and verify the updated privy config account data
  //   const updatedConfigData = await program.account.privyConfig.fetch(privyConfigPDA);
  //   console.log(updatedConfigData);
  //   expect(updatedConfigData.tokensPerSol).to.equal(newTokensPerSol);
  // });

  it("Create User", async () => {
    const depositLamports = 1 * anchor.web3.LAMPORTS_PER_SOL; // 1 SOL

    const tx = await program.methods
        .createUser(userData.username, userData.passkey, new anchor.BN(depositLamports))
        .accounts({
            user: provider.wallet.publicKey,
            privyUser: privyUserPDA,
            privyConfig: privyConfigPDA,
            systemProgram: SystemProgram.programId,
        })
        .rpc();

    console.log('tx', tx)
    const accountData = await program.account.privyUser.fetch(privyUserPDA);
    console.log("accountData", accountData);
    expect(accountData.username).to.equal(userData.username);
    expect(accountData.tokenLimit).to.equal(Math.floor(depositLamports / anchor.web3.LAMPORTS_PER_SOL * 10)); // Ensure tokens length is as expected
});


  it("Add tokens", async () => {
    const additionalLamports = 1 * anchor.web3.LAMPORTS_PER_SOL; // 1 SOL

    await program.methods
      .addTokens(new anchor.BN(additionalLamports))
      .accounts({
        user: provider.wallet.publicKey,
        privyUser: privyUserPDA,
        privyConfig: privyConfigPDA,
      })
      .rpc();

    // Fetch and verify the privy user account data after adding tokens
    const accountData = await program.account.privyUser.fetch(privyUserPDA);
    console.log(accountData);
    const expectedTokensLength = Math.floor((2 * anchor.web3.LAMPORTS_PER_SOL) / anchor.web3.LAMPORTS_PER_SOL * 10); // Initial deposit + additional SOL
    expect(accountData.tokenLimit).to.equal(expectedTokensLength); // Ensure the vector length is as expected
  });

});