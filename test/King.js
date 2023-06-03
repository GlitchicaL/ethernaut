const { expect } = require("chai");
const { ethers } = require("hardhat");
require("dotenv").config();

describe("Vault", () => {
  const INSTANCE_ADDRESS = "0x2382785BD287836E4Bd563A9BAA600EEC31aD856";
  const AMOUNT = ethers.utils.parseUnits('1', 'ether');

  let deployer, attacker;
  let king, kingAttack;

  beforeEach(async () => {
    // Setup accounts
    [deployer, attacker] = await ethers.getSigners();

    const King = await ethers.getContractFactory("King");
    king = await King.deploy({ value: AMOUNT });

    const KingAttack = await ethers.getContractFactory("KingAttack");
    kingAttack = await KingAttack.deploy(king.address, { value: AMOUNT });
  });

  describe("Reclaiming King", () => {
    it('KingAttack becomes king', async () => {
      deployer = new ethers.Wallet("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", ethers.provider)

      const transactionObj = {
        from: deployer.address,
        to: king.address,
        value: AMOUNT,
        nonce: await deployer.getTransactionCount(),
        gasPrice: await ethers.provider.getGasPrice(),
        gasLimit: 1000000
      };

      const transaction = await deployer.signTransaction(transactionObj);
      await expect(ethers.provider.sendTransaction(transaction)).to.be.reverted;
    });
  });
});
