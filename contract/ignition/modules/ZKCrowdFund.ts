// npx hardhat ignition deploy ./ignition/modules/ZKCrowdFund.ts --network sepolia

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";


const ZKCrowdFundModule = buildModule("ZKCrowdFund", (m) => {

    const zkVerifyAddress = m.getParameter("_zkVerify", "0x209f82A06172a8d96CF2c95aD8c42316E80695c1");


    const ZKCrowdFund = m.contract("ZKCrowdFund", [zkVerifyAddress]);

    return { ZKCrowdFund };
});

export default ZKCrowdFundModule;

// ca sepolia network = 0x234C315B4F9145033D90b747e2152CfF2455C4c2