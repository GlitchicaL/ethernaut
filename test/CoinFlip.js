const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CoinFlip Attack", () => {
    let deployer;
    let coinFlip, coinFlipAttack;

    const INSTANCE = "0xEEde9879cC30aD881aA3bEfE4b80544AD4d98D0e";

    beforeEach(async () => {
        // Setup accounts
        [deployer] = await ethers.getSigners();

        // Fetch instance contract
        coinFlip = await hre.ethers.getContractAt("CoinFlip", INSTANCE);

        // Deploy attack contract
        const CoinFlipAttack = await ethers.getContractFactory("CoinFlipAttack")
        coinFlipAttack = await CoinFlipAttack.deploy()
    })

    it("Successfully guesses", async () => {
        const BLOCK_NUMBER = await ethers.provider.getBlockNumber()
        console.log(`Current Block Number: ${BLOCK_NUMBER.toString()}`)

        const WINS_BEFORE = await coinFlip.consecutiveWins();

        const transaction = await coinFlipAttack.connect(deployer).attackFlip();
        await transaction.wait();

        const WINS_AFTER = await coinFlip.consecutiveWins();
        expect(WINS_AFTER).to.equal(Number(WINS_BEFORE) + 1);
    })
})
