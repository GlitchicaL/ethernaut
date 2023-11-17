const hre = require("hardhat");

async function main() {
  const CONTRACT_ADDRESS = "0x31174A5334B7c7aBa76f03881927dAA9F1A65e3A";

  // Fetch contract
  const solver = await hre.ethers.getContractAt("ISolver", CONTRACT_ADDRESS);
  console.log(`Solver contract fetched at ${solver.address}\n`);

  const storage = await hre.ethers.provider.getStorageAt(solver.address, 0);
  console.log(`Storage at 0x00: ${storage}\n`)

  const number = await solver.whatIsTheMeaningOfLife();
  console.log(`Number: ${number}\n`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});