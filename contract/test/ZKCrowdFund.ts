import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
  
  describe("ZKCrowdFund", function () {

    async function deployZKCrowdFundFixture() {
      const zkVerifyAddress = "0x209f82A06172a8d96CF2c95aD8c42316E80695c1";

      const [owner] = await hre.ethers.getSigners();
  
      const ZKCrowdFund = await hre.ethers.getContractFactory("ZKCrowdFund");
      const zkCrowdFund = await ZKCrowdFund.deploy(zkVerifyAddress);
  
      return { zkCrowdFund, owner };
    }
  
    describe("Deployment", function () {
      it("Should set the right zkverify contract address", async function () {
        const { zkCrowdFund } = await loadFixture(deployZKCrowdFundFixture);
  
        expect(await zkCrowdFund.zkVerify()).to.equal("0x209f82A06172a8d96CF2c95aD8c42316E80695c1");
      });
    });
  
    describe("createCampaign", function () {
        it("It should create campaign successfully", async function () {
            const { zkCrowdFund } = await loadFixture(deployZKCrowdFundFixture);
  
        });
    });

  });
  