const hre = require("hardhat")

async function main() {
    // Deploy attack contract
    const CoinFlipAttack = await ethers.getContractFactory("CoinFlipAttack");
    const coinFlipAttack = await CoinFlipAttack.deploy();
    await coinFlipAttack.deployed();

    console.log(`CoinFlipAttack contract deployed to ${coinFlipAttack.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});