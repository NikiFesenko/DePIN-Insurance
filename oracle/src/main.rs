use reqwest;
use std::time::Duration;
use tokio::time::sleep;
use ethers::prelude::*;
use std::sync::Arc;

abigen!(
    DePINInsurance,
    r#"[
        function triggerPayout(address _user) external
    ]"#,
);

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    println!("🤖 Watcher Bot is booting up...");
    
    let device_api_url = "https://httpbin.org/status/404"; 
    let rpc_url = "http://127.0.0.1:8545"; 
    
    // Account 1 (The Watcher Bot's Keys)
    let private_key = "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d"; 
    let contract_address = "0x5FbDB2315678afecb367f032d93F642f64180aa3".parse::<Address>()?;

    // Account 2 (The Customer who just bought the policy)
    let user_address = "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC".parse::<Address>()?;

    loop {
        println!("🔍 Checking if the DePIN device is online...");
        let response = reqwest::get(device_api_url).await;
        
        match response {
            Ok(res) if res.status().is_success() => {
                println!("✅ Device is ONLINE. Waiting 5 seconds...");
            }
            _ => {
                println!("🚨 DEVICE IS OFFLINE! Connecting to blockchain...");
                
                let provider = Provider::<Http>::try_from(rpc_url)?;
                let wallet = private_key.parse::<LocalWallet>()?.with_chain_id(31337u64); 
                let client = Arc::new(SignerMiddleware::new(provider, wallet));

                println!("🔑 Wallet connected! Triggering payout for user: {:?}", user_address);
                
                let contract = DePINInsurance::new(contract_address, client);
                
                println!("💸 Sending transaction to the Vault...");
                // FIX 1: Using the snake_case name that Rust generated
                let tx = contract.trigger_payout(user_address);
                let pending_tx = tx.send().await?;
                
                println!("⏳ Waiting for network confirmation...");
                // FIX 2: Explicitly telling Rust to expect a TransactionReceipt
                let receipt: Option<TransactionReceipt> = pending_tx.await?;
                
                // Safely unwrapping the receipt using a match statement
                if let Some(r) = receipt {
                    println!("🎉 PAYOUT SUCCESSFUL! 1 ETH sent to user. Transaction Hash: {:?}", r.transaction_hash);
                } else {
                    println!("⚠️ Transaction was not confirmed by the network.");
                }
                
                break; 
            }
        }
        
        sleep(Duration::from_secs(5)).await;
    }

    Ok(())
}