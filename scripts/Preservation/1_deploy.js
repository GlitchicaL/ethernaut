const hre = require("hardhat");
require("dotenv").config();

async function main() {
  // Deploy attack contracts
  const PreservationAttackOne = await ethers.getContractFactory("PreservationAttackOne");
  const preservationAttackOne = await PreservationAttackOne.deploy();
  console.log(`preservationAttackOne contract deployed at ${preservationAttackOne.address}`);

  const PreservationAttackTwo = await ethers.getContractFactory("PreservationAttackTwo");
  const preservationAttackTwo = await PreservationAttackTwo.deploy();
  console.log(`PreservationAttackTwo contract deployed at ${preservationAttackTwo.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});