

use serde::{Serialize, Deserialize};
use methods::{
    GUEST_CODE_FOR_ZK_PROOF_ELF, GUEST_CODE_FOR_ZK_PROOF_ID
};
use risc0_zkvm::{default_prover, ExecutorEnv};
use hex;
// use bincode;
use std::fs;

#[derive(Debug, Serialize, Deserialize)]
pub struct ProofOutput{
    pub proof: String,
    pub pub_inputs: String,
    pub image_id: String,
}

fn main() {
    tracing_subscriber::fmt()
        .with_env_filter(tracing_subscriber::filter::EnvFilter::from_default_env())
        .init();

    let min_donation_amount: u32 = 1;
    let min_donation_amount_constant: u32 = 1;


    let env = ExecutorEnv::builder()
        .write(&min_donation_amount)
        .unwrap()
	.write(&min_donation_amount_constant)
	.unwrap()
        .build()
        .unwrap();

    let prover = default_prover();
    let prove_info = prover
        .prove(env, GUEST_CODE_FOR_ZK_PROOF_ELF)
        .unwrap();
    let receipt = prove_info.receipt;

    let _output: u32 = receipt.journal.decode().unwrap();

    receipt
        .verify(GUEST_CODE_FOR_ZK_PROOF_ID)
        .unwrap();


    let mut bin_receipt = Vec::new();
    ciborium::into_writer(&receipt, &mut bin_receipt).unwrap();
    let proof = hex::encode(&bin_receipt);

    fs::write("proof.txt", hex::encode(&bin_receipt)).unwrap();
    let receipt_journal_bytes_array = &receipt.journal.bytes.as_slice();
    let pub_inputs = hex::encode(&receipt_journal_bytes_array);
    
    let image_id_hex = hex::encode(
        GUEST_CODE_FOR_ZK_PROOF_ID
            .into_iter()
            .flat_map(|v| v.to_le_bytes().into_iter())
            .collect::<Vec<_>>(),
    );
    
    let proof_output = ProofOutput{
        proof: "0x".to_owned()+&proof,
        pub_inputs: "0x".to_owned()+&pub_inputs,
        image_id: "0x".to_owned()+&image_id_hex,
    };

    let proof_output_json = serde_json::to_string(&proof_output).unwrap();
    fs::write("proof.json", proof_output_json).unwrap();
    
   

}

// RISC0_DEV_MODE=0 cargo run --release


                                                                                                                         
