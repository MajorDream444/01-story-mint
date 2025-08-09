import { ethers } from "hardhat";
import * as dotenv from "dotenv";
dotenv.config();

/**
 * ENV:
 * - ROYALTY_ADDRESSES: comma-separated addresses (e.g. "0xA,0xB,0xC")
 * - ROYALTY_SHARES: comma-separated uint shares (e.g. "50,30,20")
 * - ROYALTY_BPS: default royalty in basis points (e.g. "500" for 5%)
 */
function parseCsv(name: string, fallback: string[]) {
  const raw = process.env[name];
  return (raw ? raw.split(",") : fallback).map((s) => s.trim()).filter(Boolean);
}

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", await deployer.getAddress());

  const addrs = parseCsv("ROYALTY_ADDRESSES", [await deployer.getAddress()]);
  const sharesStr = parseCsv("ROYALTY_SHARES", ["100"]);
  const shares = sharesStr.map((s) => Number(s));
  if (addrs.length !== shares.length) throw new Error("ROYALTY_ADDRESSES and ROYALTY_SHARES length mismatch");

  const bps = Number(process.env.ROYALTY_BPS || "500"); // default 5%

  // 1) RoyaltySplitter
  const Splitter = await ethers.getContractFactory("RoyaltySplitter");
  const splitter = await Splitter.deploy(addrs, shares);
  await splitter.waitForDeployment();
  const splitterAddr = await splitter.getAddress();
  console.log("RoyaltySplitter deployed:", splitterAddr);

  // 2) StoryMint
  const StoryMint = await ethers.getContractFactory("StoryMint");
  const story = await StoryMint.deploy();
  await story.waitForDeployment();
  const storyAddr = await story.getAddress();
  console.log("StoryMint deployed:", storyAddr);

  // 3) Set default royalty to splitter
  const tx = await story.setDefaultRoyalty(splitterAddr, bps);
  await tx.wait();
  console.log(`Default royalty set to ${bps} bps → receiver ${splitterAddr}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
