// const {zkVerifySession, ZkVerifyEvents} = require("zkverifyjs");
// const dotenv = require("dotenv");


// const fs = require("fs");
// const proof = require("./proof.json"); // Following the Risc Zero tutorial



// dotenv.config();

// const main = async() => {


//     const session = await zkVerifySession.start().Testnet().withAccount(process.env.ZKVERIFY_SEED_PHRASE);
//     const {events, txResults} = await session.verify().risc0().waitForPublishedAttestation()
//     .execute({proofData:{
//         proof: proof.proof,
//         vk: proof.image_id,
//         publicSignals: proof.pub_inputs,
//         version: "V1_2" // Mention the R0 version
//     }});

//     let txHash;
//     let blockHash;
//     events.on(ZkVerifyEvents.IncludedInBlock, (eventData) => {
//         txHash = eventData.txHash;
//         blockHash = eventData.blockHash;
//         console.log('Transaction included in block:', eventData);
//     });

//     let leafDigest; // This is required for session.poe() call
//     events.on(ZkVerifyEvents.Finalized, (eventData) => {
//         leafDigest = eventData.leafDigest;
//         console.log('Transaction finalized:', eventData);
//     });

//     events.on(ZkVerifyEvents.AttestationConfirmed, async(eventData) => {
//         console.log('Attestation Confirmed', eventData);
//         // eventData.id is the attestationId contained within ZkVerifyEvents.AttestationConfirmed
//         // leafDigest is obtained from ZkVerifyEvents.Finalized
//         const proofDetails = await session.poe(eventData.id, leafDigest);
//         fs.writeFileSync("attestation.json", JSON.stringify(proofDetails, null, 2));
//         console.log("attestation id: ", eventData.id)
//         console.log("proofDetails", proofDetails);
//         process.exit(0);
//     });
// };

// main().then().catch(err => console.log(err));

const {zkVerifySession, ZkVerifyEvents} = require("zkverifyjs");
// const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config();
const proof = require("./proof.json");

async function verifyProofWithZkVerify(proof, imageId, pubInputs) {

  const session = await zkVerifySession
    .start()
    .Testnet()
    .withAccount(process.env.ZKVERIFY_SEED_PHRASE);

  let attestationId, leafDigest, blockHash;
  return new Promise(async (resolve, reject) => {
    const { events } = await session
      .verify()
      .risc0()
      .waitForPublishedAttestation()
      .execute({
        proofData: {
          proof: proof,
          vk: imageId,
          publicSignals: pubInputs,
          version: "V1_2",
        },
      });

    events.on(ZkVerifyEvents.IncludedInBlock, (eventData) => {
      console.log("Transaction included in block:", eventData);
      leafDigest = eventData.leafDigest;
      blockHash = eventData.blockHash;
      attestationId = eventData.attestationId;
    });

    events.on(ZkVerifyEvents.Finalized, (eventData) => {
      console.log("Transaction finalized:", eventData);
    });

    events.on(ZkVerifyEvents.AttestationConfirmed, async (eventData) => {
      console.log(
        `attestation ID: ${attestationId} \nleafDigest: ${leafDigest} \nblockHash: ${blockHash}`
      );
      const proofDetails = await session.poe(attestationId, leafDigest);
      console.log("attestation: ", JSON.stringify(proofDetails, null, 2));
      console.log("attestation id: ", eventData.id)
      console.log("proofDetails", proofDetails);
      resolve({
        attestationId: eventData.id,
        proofDetails,
      });
    });

    events.on("error", (error) => {
      reject(error);
    });
  });
}
// Above can take some time

verifyProofWithZkVerify(proof.proof, proof.image_id, proof.pub_inputs).then().catch(err => console.log(err));
