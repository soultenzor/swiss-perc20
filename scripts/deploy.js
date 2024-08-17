const { ethers } = require("hardhat");

async function main() {
  const SoulPERC20 = await ethers.getContractFactory("SoulPERC20");
  const soulPERC20 = await SoulPERC20.deploy();

  // Wait for the transaction to be mined
  await soulPERC20.waitForDeployment();

  console.log(`SoulPERC20 was deployed to ${await soulPERC20.getAddress()}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});