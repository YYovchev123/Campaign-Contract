const hre = require("hardhat");

async function main() {
  const CharityPlatform = await hre.ethers.getContractFactory(
    "CharityPlatform"
  );
  const charityPlatform = await CharityPlatform.deploy();

  await charityPlatform.deployed();

  console.log(`CharityPlatform deployed to ${charityPlatform.address}`);
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
