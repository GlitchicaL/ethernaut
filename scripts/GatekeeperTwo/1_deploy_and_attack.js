const hre = require("hardhat");
require("dotenv").config();

async function main() {
  // Fetch account
  const INSTANCE_ADDRESS = "0xB14D72e5E4D237135C262241E2D2e77564390Dd6";

  const gatekeeperTwo = await hre.ethers.getContractAt("GatekeeperTwo", INSTANCE_ADDRESS);
  console.log(`GatekeeperTwo contract fetched at ${gatekeeperTwo.address}\n`);

  // Deploy attack contract
  const GatekeeperTwoAttack = await hre.ethers.getContractFactory("GatekeeperTwoAttack");
  const gatekeeperTwoAttack = await GatekeeperTwoAttack.deploy(INSTANCE_ADDRESS);
  await gatekeeperTwoAttack.deployed();
  console.log(`GatekeeperTwoAttack contract deployed at ${gatekeeperTwoAttack.address}\n`);

  // Fetch current entrant
  const currentEntrant = await gatekeeperTwo.entrant();
  console.log(`Current Entrant: ${currentEntrant}\n`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});