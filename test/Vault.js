const { expect } = require("chai");
const { ethers } = require("hardhat");
require("dotenv").config();

describe("Vault", () => {
  const INSTANCE_ADDRESS = "0x2382785BD287836E4Bd563A9BAA600EEC31aD856";
  const PASSWORD = ethers.utils.hexlify(ethers.utils.toUtf8Bytes("A very strong secret password :)")); // String to Hex

  // You can see the password at:
  // https://goerli.etherscan.io/tx/0x2f3a37b684675459b7ee28a9e3664a3e565c982861d6418e868d24254e5277c5#statechange
  // PASSWORD = "0x412076657279207374726f6e67207365637265742070617373776f7264203a29"

  let attacker;
  let vault;

  beforeEach(async () => {
    // Setup accounts
    [attacker] = await ethers.getSigners();

    vault = await ethers.getContractAt("Vault", INSTANCE_ADDRESS);

    const transaction = await vault.connect(attacker).unlock(PASSWORD);
    await transaction.wait();
  });

  describe("Unlocking the Vault", () => {
    it('Unlocks the contract', async () => {
      const result = await vault.locked();
      expect(result).to.equal(false);
    });
  });
});
