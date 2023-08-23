const hre = require("hardhat");
require("dotenv").config();

async function main() {
  // Fetch account
  const INSTANCE_ADDRESS = "0x862B528E001cd58cC8b11d6749150547F17c695F";

  const gatekeeperOne = await hre.ethers.getContractAt("GatekeeperOne", INSTANCE_ADDRESS);
  console.log(`GatekeeperOne contract fetched at ${gatekeeperOne.address}\n`);

  // Deploy attack contract
  const GatekeeperOneAttack = await hre.ethers.getContractFactory("GatekeeperOneAttack");
  const gatekeeperOneAttack = await GatekeeperOneAttack.deploy(INSTANCE_ADDRESS);
  await gatekeeperOneAttack.deployed();
  console.log(`GatekeeperOneAttack contract deployed at ${gatekeeperOneAttack.address}\n`);

  // Fetch current entrant
  const currentEntrant = await gatekeeperOne.entrant();
  console.log(`Current Entrant: ${currentEntrant}\n`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});