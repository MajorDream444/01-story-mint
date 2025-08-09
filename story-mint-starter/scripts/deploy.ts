import { ethers } from "hardhat";

async function main() {
  const Factory = await ethers.getContractFactory("StoryMint");
  const contract = await Factory.deploy();
  await contract.waitForDeployment();
  const addr = await contract.getAddress();
  console.log("StoryMint deployed to:", addr);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
