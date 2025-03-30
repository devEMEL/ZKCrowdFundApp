use risc0_zkvm::guest::env;



fn main() {
    // // Read the input

    // let min_donation_amount: u32 = env::read();
    // let min_donation_amount_constant: u32 = env::read();

    // // Check if donation meets the minimum amount
    // if min_donation_amount < min_donation_amount_constant {
    //     panic!("Donation amount doesn't meet minimum amount")
    // }

    // // Write public output to the journal
    // env::commit(&min_donation_amount);



    // We will get the values for these variables from host program
    let a:u64 = env::read();
    let b:u64 = env::read();

    // To avoid trivial factors like multiplication by 1
    if a == 1 || b == 1 {
        panic!("Trivial factors !!")  // The panic! macro in Rust is used to intentionally crash a program when an unrecoverable error occurs
    }

    // Caculate the product of the two numbers
    let product = a.checked_mul(b).expect("Integer Overflow");

    // Commit back the output to the host to save it as receipt
    env::commit(&product);
}




