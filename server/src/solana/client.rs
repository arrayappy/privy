use anchor_client::solana_sdk::commitment_config::CommitmentConfig;
use anchor_client::solana_sdk::pubkey::Pubkey;
use anchor_client::solana_sdk::signature::Keypair;
use anchor_client::Client;
use anchor_client::Cluster;
use dotenvy::dotenv;
use std::env;
use std::rc::Rc;
use actix_web::rt::Runtime;

pub fn insert_message_to_pda(
    user_addr: &Pubkey,
    encrypted_msg: String,
) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
    dotenv().ok();
    let keypair_json = env::var("PRIVY_OWNER_KEYPAIR")?;
    let keypair_bytes: Vec<u8> = serde_json::from_str(&keypair_json)?;
    let payer = Keypair::from_bytes(&keypair_bytes)?;

    let client = Client::new_with_options(
        Cluster::Devnet,
        Rc::new(&payer),
        CommitmentConfig::processed(),
    );

    let program_id = privy::ID;
    let program = client.program(program_id)?;

    let (privy_config_pda, _) = Pubkey::find_program_address(&[b"privy-config"], &program_id);

    let (privy_user_pda, _) =
        Pubkey::find_program_address(&[b"privy-user", &user_addr.to_bytes()], &program_id);

    let insert_message_ix = privy::instruction::InsertMessage {
        message: encrypted_msg,
    };

    let insert_message_accounts = privy::accounts::InsertMessage {
        owner: program.payer(),
        privy_user: privy_user_pda,
        privy_config: privy_config_pda,
    };

    let insert_message_payer = &payer;

    let _ = Runtime::new()?.block_on(async {
        program
            .request()
            .args(insert_message_ix)
            .accounts(insert_message_accounts)
            .signer(insert_message_payer)
            .send()
            .await
    })?;

    Ok(())
}

pub fn get_user_pda_account(
    user_addr: &Pubkey,
) -> Result<privy::state::PrivyUser, Box<dyn std::error::Error + Send + Sync>> {
    dotenv().ok();
    let keypair_json = env::var("PRIVY_OWNER_KEYPAIR")?;
    let keypair_bytes: Vec<u8> = serde_json::from_str(&keypair_json)?;
    let payer = Keypair::from_bytes(&keypair_bytes)?;

    let client = Client::new_with_options(
        Cluster::Devnet,
        Rc::new(&payer),
        CommitmentConfig::processed(),
    );

    let program_id = privy::ID;
    let program = client.program(program_id)?;

    let (privy_user_pda, _) =
        Pubkey::find_program_address(&[b"privy-user", &user_addr.to_bytes()], &program_id);
    println!("privy_user_pda: {}", privy_user_pda);


    let privy_user_account: privy::state::PrivyUser = Runtime::new()?
        .block_on(async { program.account(privy_user_pda).await })?;
    println!("privy_user_account: {:?}", privy_user_account);

    Ok(privy_user_account)
}
