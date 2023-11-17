const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  const transaction = await deployer.sendTransaction({
    data: '0x6080604052602a60001b60005534801561001857600080fd5b50600a806100276000396000f3fe602a60405260206040f3'
  });

  const receipt = await transaction.wait();
  console.log(`Solver contract deployed at ${receipt.contractAddress}\n`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});