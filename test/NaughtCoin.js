const { expect } = require("chai");
const { ethers } = require("hardhat");
require("dotenv").config();

describe("NaughtCoin", () => {
  let player;
  let naughtCoin, naughtCoinAttack;

  beforeEach(async () => {
    // Setup accounts
    [deployer, player] = await ethers.getSigners();

    const NaughtCoin = await ethers.getContractFactory("NaughtCoin");
    naughtCoin = await NaughtCoin.deploy(player.address);

    const NaughtCoinAttack = await ethers.getContractFactory("NaughtCoinAttack");
    naughtCoinAttack = await NaughtCoinAttack.deploy(naughtCoin.address);
  });

  describe("Token Contract", () => {
    it('Returns a balance of 1,000,000 for the player', async () => {
      expect(await naughtCoin.balanceOf(naughtCoin.address)).to.equal(0);
      expect(await naughtCoin.balanceOf(player.address)).to.equal(await naughtCoin.INITIAL_SUPPLY());
    });

    it('Expects a player transfer to fail', async () => {
      await expect(naughtCoin.transfer(naughtCoinAttack.address, '100')).to.be.reverted;
    });
  });

  describe("Token Contract Attack", () => {
    beforeEach(async () => {
      await (await naughtCoin.connect(player).approve(naughtCoinAttack.address, await naughtCoin.INITIAL_SUPPLY())).wait();
      await (await naughtCoinAttack.connect(player).attackNaughtCoin()).wait();
    });

    it('returns a balance for attacker', async () => {
      expect(await naughtCoin.balanceOf(naughtCoin.address)).to.equal(0);
      expect(await naughtCoin.balanceOf(player.address)).to.equal(0);
      expect(await naughtCoin.balanceOf(naughtCoinAttack.address)).to.equal(await naughtCoin.INITIAL_SUPPLY());
    });
  });
});
