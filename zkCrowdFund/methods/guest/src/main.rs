

use risc0_zkvm::guest::env;


fn main() {
    // Read the input

    let min_donation_amount: u32 = env::read();
    let min_donation_amount_constant: u32 = env::read();

    // Check if donation meets the minimum amount
    if min_donation_amount < min_donation_amount_constant {
        panic!("Donation amount doesn't meet minimum amount")
    }

    // Write public output to the journal
    env::commit(&min_donation_amount);
}

