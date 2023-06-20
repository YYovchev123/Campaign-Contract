require("@nomicfoundation/hardhat-toolbox");
require("./tasks");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    hardhat: {},
    sepolia: {
      url: `https://sepolia.infura.io/v3/fb81ff63ff0a41f191d1c3d5b4a2058f`,
      accounts: [
        "2b0a0ad3ad74930da8dda26e38185b2938781c2d9cd25de51a8e71d521b74f8a",
      ],
    },
  },
};
