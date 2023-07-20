const hre = require("hardhat")

async function main() {
  const INSTANCE_ADDRESS = "0x81fb5065A47C77B74A9Dc5281a94dFe17509073C";

  // Deploy attack contract
  const ElevatorAttack = await ethers.getContractFactory("ElevatorAttack");
  const elevatorAttack = await ElevatorAttack.deploy(INSTANCE_ADDRESS);
  await elevatorAttack.deployed();

  console.log(`ElevatorAttack contract deployed to ${elevatorAttack.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});