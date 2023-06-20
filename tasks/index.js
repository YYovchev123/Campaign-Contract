const { task } = require("hardhat/config");

task("deploy", "deploy instance of charityPlaftorm").setAction(
  async (taskArgs, hre) => {
    const account = (await hre.ethers.getSigners())[0];
    const CharityPlatform = await hre.ethers.getContractFactory(
      "CharityPlatform",
      account
    );
    const charityPlaftorm = await CharityPlatform.deploy();
    await charityPlaftorm.deployed();
    console.log("charityPlaftorm");
  }
);

task("create", "deploy instance of charity contract").setAction(
  async (taskArgs, hre) => {
    const name = "Test";
    const description = "TestDesc";
    const fundingGoal = 1000;
    const deadline = 1000;

    const account = (await hre.ethers.getSigners())[0];
    const charityPlatform = await hre.ethers.getContractFactory(
      "CharityPlatform",
      account
    );
    const charityPlatformContract = await charityPlatform.deploy();
    const tx = await charityPlatformContract.createCampaign(
      name,
      description,
      fundingGoal,
      deadline
    );
    const receipt = await tx.wait();
    console.log("tx:", tx);
    console.log("receipt: ", receipt);
  }
);
