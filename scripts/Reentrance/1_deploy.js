const hre = require("hardhat")

async function main() {
    const INSTANCE_ADDRESS = "0x806f3E0Ee2633EdbeC4b83606dE38a6B3139bd3E";
    const AMOUNT = ethers.utils.parseUnits('0.001', 'ether');

    // Deploy attack contract
    const ReentranceAttack = await ethers.getContractFactory("ReentranceAttack");
    const reentranceAttack = await ReentranceAttack.deploy(INSTANCE_ADDRESS, AMOUNT);
    await reentranceAttack.deployed();

    console.log(`ReentranceAttack contract deployed to ${reentranceAttack.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});