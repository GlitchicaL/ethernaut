const { expect } = require("chai");
const { ethers } = require("hardhat");
require("dotenv").config();

describe("Elevator", () => {
  let deployer, attacker;
  let elevator, elevatorAttack;

  beforeEach(async () => {
    // Setup accounts
    [deployer, attacker] = await ethers.getSigners();

    const Elevator = await ethers.getContractFactory("Elevator");
    elevator = await Elevator.connect(deployer).deploy();

    const ElevatorAttack = await ethers.getContractFactory("ElevatorAttack");
    elevatorAttack = await ElevatorAttack.connect(attacker).deploy(elevator.address);
  });

  describe("Elevator Attack", () => {
    beforeEach(async () => {
      const transaction = await elevatorAttack.connect(attacker).callGoTo();
      await transaction.wait();
    })

    it('Reaches the top', async () => {
      expect(await elevator.top()).to.equal(true)
    });
  });
});
