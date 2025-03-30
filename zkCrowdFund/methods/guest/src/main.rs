

use risc0_zkvm::guest::env;


fn main() {
    // Read the input

    let min_donation_amount: u32 = env::read();
    let min_donation_amount_constant: u32 = env::read();
    
    // Check if donation meets the minimum amount
    let result = min_donation_amount >= min_donation_amount_constant;

    // Write public output to the journal
    env::commit(&result);
}

