use std::{env, rc::Rc};
use anchor_client::{
    solana_sdk::{
        commitment_config::CommitmentConfig, 
        pubkey::Pubkey,
        signature::Keypair
    }, Client, Cluster
};
use dotenvy::dotenv;

pub async fn insert_message_anchor(user_addr: &Pubkey) -> Result<(), Box<dyn std::error::Error>> {
    dotenv().ok();
    let keypair_json = env::var("PRIVY_OWNER_KEYPAIR")?;
    let keypair_bytes: Vec<u8> = serde_json::from_str(&keypair_json)?;
    let payer = Keypair::from_bytes(&keypair_bytes)?;
    
    let client = Client::new_with_options(
        Cluster::Localnet,
        Rc::new(&payer),
        CommitmentConfig::processed()
    );

    let program_id = privy::ID;
    let program = client.program(program_id)?;

    let (privy_config_pda, _) = Pubkey::find_program_address(
        &[b"privy-config"],
        &program_id,
    );

    let (privy_user_pda, _) = Pubkey::find_program_address(
        &[
            b"privy-user",
            &user_addr.to_bytes(),
        ],
        &program_id,
    );

    let insert_message_ix = privy::instruction::InsertMessage { 
        message: "Hi".to_string() 
    };

    let insert_message_accounts = privy::accounts::InsertMessage {
        owner: program.payer(), // diff between program.payer vs payer.pubkey
        privy_user: privy_user_pda,
        privy_config: privy_config_pda,
    };

    let insert_message_payer = &payer;


    let tx = program
        .request()
        .args(insert_message_ix)
        .accounts(insert_message_accounts)
        .signer(insert_message_payer)
        .send().await;


    let signature = tx.map_err(|err| {
        println!("{:?}", err);
    });
     println!("Transaction signature {:?}", signature);

    let privy_user_account: privy::PrivyUser = program.account(privy_user_pda).await?;

    println!("Privy User Messages {:?}", privy_user_account.messages);

    Ok(())
}
