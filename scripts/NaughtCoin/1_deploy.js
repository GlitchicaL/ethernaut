const hre = require("hardhat");
require("dotenv").config();

async function main() {
  const INSTANCE_ADDRESS = "0xeDDD860E4F5A1597F5Eb4C489D89999678e5e446";

  // Deploy attack contract
  const NaughtCoinAttack = await hre.ethers.getContractFactory("NaughtCoinAttack");
  const naughtCoinAttack = await NaughtCoinAttack.deploy(INSTANCE_ADDRESS);
  await naughtCoinAttack.deployed();

  console.log(`NaughtCoinAttack contract deployed at ${naughtCoinAttack.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});