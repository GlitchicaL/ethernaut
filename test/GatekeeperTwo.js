const { expect } = require("chai");
const { ethers } = require("hardhat");
require("dotenv").config();

describe("GatekeeperOne", () => {
  const INSTANCE_ADDRESS = "0xB14D72e5E4D237135C262241E2D2e77564390Dd6";

  let attacker;
  let gatekeeperTwo, gatekeeperTwoAttack;

  beforeEach(async () => {
    // Setup accounts
    [deployer, attacker] = await ethers.getSigners();

    gatekeeperTwo = await hre.ethers.getContractAt("GatekeeperTwo", INSTANCE_ADDRESS);

    const GatekeeperTwoAttack = await ethers.getContractFactory("GatekeeperTwoAttack");
    gatekeeperTwoAttack = await GatekeeperTwoAttack.connect(attacker).deploy(gatekeeperTwo.address);
  });

  describe("Attack", () => {
    it('Successfully enters', async () => {
      expect(await gatekeeperTwo.entrant()).to.equal(attacker.address);
    });
  });
});
