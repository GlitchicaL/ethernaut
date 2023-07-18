const { expect } = require("chai");
const { ethers } = require("hardhat");
require("dotenv").config();

describe("Reentrance", () => {
  let deployer, attacker;
  let reentrance, reentranceAttack;

  beforeEach(async () => {
    // Setup accounts
    [deployer, user, attacker] = await ethers.getSigners();

    const Reentrance = await ethers.getContractFactory("Reentrance");
    reentrance = await Reentrance.deploy();

    const transaction = await reentrance.connect(user).donate(user.address, { value: ethers.utils.parseUnits("0.001", "ether") })
    await transaction.wait()

    const ReentranceAttack = await ethers.getContractFactory("ReentranceAttack");
    reentranceAttack = await ReentranceAttack.deploy(reentrance.address, ethers.utils.parseUnits("0.001", "ether"));
  });

  describe("Reentrance Attack", () => {
    beforeEach(async () => {
      const transaction = await reentranceAttack.connect(attacker).donateFunds({ value: ethers.utils.parseUnits("0.001", "ether") });
      await transaction.wait();
    })

    it('Withdraws all ETH', async () => {
      const transaction = await reentranceAttack.connect(attacker).withdrawFunds();
      await transaction.wait();

      expect(await ethers.provider.getBalance(reentrance.address)).to.equal(0);
    });
  });
});
