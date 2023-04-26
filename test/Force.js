const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Force", () => {
    let deployer;
    let force, forceAttack;

    const AMOUNT = ethers.utils.parseUnits('0.001', 'ether');

    beforeEach(async () => {
        // Setup accounts
        [deployer, attacker] = await ethers.getSigners();

        // Deploy contract
        const Force = await ethers.getContractFactory("Force");
        force = await Force.deploy();
    });

    describe("Force Attack", () => {
        beforeEach(async () => {
            const ForceAttack = await ethers.getContractFactory("ForceAttack");
            forceAttack = await ForceAttack.deploy(force.address, { value: AMOUNT });
        })

        it("Sends Ether", async () => {
            expect(await ethers.provider.getBalance(force.address)).to.equal(AMOUNT);
        });
    });
});
