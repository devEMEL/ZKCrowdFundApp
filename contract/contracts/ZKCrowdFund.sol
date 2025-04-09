
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

interface IZkVerifyAttestation {

    function verifyProofAttestation(
        uint256 _attestationId,
        bytes32 _leaf,
        bytes32[] calldata _merklePath,
        uint256 _leafCount,
        uint256 _index) external returns (bool);
}

contract ZKCrowdFund {
    

    // zkVerify contract
    IZkVerifyAttestation public immutable zkVerify;  // sepolia =  0x209f82A06172a8d96CF2c95aD8c42316E80695c1


    struct Campaign {
        string name;
        string description;
        uint256 minAmount;
        uint256 totalDonated;
        uint256 attestationId;
        address creator;
        bool exists;
    }

    mapping(uint256 => Campaign) public campaigns;
    uint256 public campaignCount;

    event CampaignCreated(uint256 indexed index, string name, address creator);
    event DonationReceived(uint256 indexed index, address donor, uint256 amount);

    constructor(address _zkVerify) {
        zkVerify = IZkVerifyAttestation(_zkVerify);

    }

    function createCampaign(
        string calldata name,
        string calldata description,
        uint256 minAmount,
        uint256 attestationId
    ) external {
        campaigns[campaignCount] = Campaign({
            name: name,
            description: description,
            minAmount: minAmount,
            totalDonated: 0,
            attestationId: attestationId,
            creator: msg.sender,
            exists: true
        });

        emit CampaignCreated(campaignCount, name, msg.sender);
        campaignCount++;
    } 

    function donateToCampaign(
        uint256 index,
        uint256 amount,
        bytes32 leaf,
        bytes32[] calldata _merklePath,
        uint256 _leafCount,
        uint256 _leafIndex
    ) external payable {
        Campaign storage c = campaigns[index];
        require(c.exists, "Campaign does not exist");
        require(amount >= c.minAmount, "Below minimum amount");
        require(msg.value >= amount, "Incorrect ETH sent");

        // verify attestation

        require(zkVerify.verifyProofAttestation(
            c.attestationId,
            leaf,
            _merklePath,
            _leafCount,
            _leafIndex
        ), "Invalid proof");

        // send funds to creator
        (bool success, ) = c.creator.call{value: amount}("");
        require(success, "Transfer to creator failed");

        c.totalDonated += amount;

        emit DonationReceived(index, msg.sender, amount);
    }


}
