const hre = require("hardhat");

async function main() {
  const INSTANCE_ADDRESS = "0x296Ca8661EfaD221AAd2E874cc2472D40fb28188";
  const CONTRACT_ADDRESS = "0x31174A5334B7c7aBa76f03881927dAA9F1A65e3A";
  const [deployer] = await hre.ethers.getSigners();

  // Fetch contract
  const magicNum = await hre.ethers.getContractAt("MagicNum", INSTANCE_ADDRESS);
  console.log(`MagicNum contract fetched at ${magicNum.address}\n`);

  await (await magicNum.connect(deployer).setSolver(CONTRACT_ADDRESS)).wait();
  console.log(`Solver Set`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});