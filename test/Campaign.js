const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("Lock", function () {
  async function deployOneYearLockFixture() {
    const id = 1;
    const name = "Test";
    const description = "TestDesc";
    const fundingGoal = 1000;
    const deadline = 1000;
    const balance = 0;
    const forDonation = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";

    const [owner, otherAccount] = await ethers.getSigners();

    const Campaign = await ethers.getContractFactory("Campaign");
    const campaign = await Campaign.deploy(
      id,
      name,
      description,
      fundingGoal,
      deadline
    );

    return {
      campaign,
      owner,
      otherAccount,
      name,
      description,
      fundingGoal,
      deadline,
      balance,
      forDonation,
    };
  }

  describe("Deployment", function () {
    it("Should set the right name", async function () {
      const { campaign, name } = await loadFixture(deployOneYearLockFixture);

      expect(await campaign.name()).to.equal(name);
    });

    it("Should set the right description", async function () {
      const { campaign, description } = await loadFixture(
        deployOneYearLockFixture
      );

      expect(await campaign.description()).to.equal(description);
    });

    it("Should set the right fundingGoal", async function () {
      const { campaign, fundingGoal } = await loadFixture(
        deployOneYearLockFixture
      );

      expect(await campaign.fundingGoal()).to.equal(fundingGoal);
    });

    it("Should set the right deadline", async function () {
      const { campaign, deadline } = await loadFixture(
        deployOneYearLockFixture
      );

      expect(await campaign.deadline()).to.equal(deadline);
    });
  });

  describe("Donation", function () {
    it("Should revert if there is no donation", async function () {
      const { campaign } = await loadFixture(deployOneYearLockFixture);

      await expect(campaign.donate({ value: 0 })).to.be.revertedWith(
        "Cannot donate 0"
      );
    });
    it("Should revert if there is no donation", async function () {
      const { campaign } = await loadFixture(deployOneYearLockFixture);

      await expect(campaign.donate({ value: 1000000 })).to.be.revertedWith(
        "Funding goal already reached"
      );
    });
    it("Should add the donation to the balance", async function () {
      const { campaign } = await loadFixture(deployOneYearLockFixture);
      await expect(campaign.donate({ value: 100 })).to.changeEtherBalance(
        campaign,
        100
      );
    });
  });
  describe("Collect Funds", function () {
    it("Should revert if address is invalid", async function () {
      const { campaign } = await loadFixture(deployOneYearLockFixture);
      await campaign.donate({ value: 1000 });
      await expect(
        campaign.collectFunds(ethers.constants.AddressZero)
      ).to.be.revertedWith("Wrong address");
    });
    it("Should transfer the balance to the provided address", async function () {
      const { campaign, forDonation } = await loadFixture(
        deployOneYearLockFixture
      );
      await campaign.donate({ value: 1000 });

      await expect(campaign.collectFunds(forDonation))
        .to.changeEtherBalance(campaign, -1000)
        .and.to.changeEtherBalance(forDonation, 1000);
    });
  });
});
