# Create a polished README.md for the Story Mint repo and save it for download.
readme = """# Story Mint — Week-1 Mini-App (52-in-52)

**Turn memories into on-chain “keepsakes.”**  
Write a short story, (optionally) attach an image, upload metadata to IPFS, and mint an **ERC-721** on **Polygon Amoy** with built-in **ERC-2981 royalties** routed through a **PaymentSplitter**.

---

## ✨ What’s inside
- **Next.js 14 (App Router) + TailwindCSS** UI
- **wagmi + viem** wallet + contract calls
- **Hardhat** + **OpenZeppelin** (ERC-721, ERC-2981)
- **IPFS uploader** via `web3.storage` with **dry-run mode** (works even without a token)
- **RoyaltySplitter** (OpenZeppelin `PaymentSplitter`) for pro-rata royalty withdrawals
- **CI**: GitHub Actions typecheck/build/compile on every push
- **Tests**: Hardhat unit test for mint + royalty math

> Part of the **52-in-52** experiment. North-star: ship weekly, track “Proof of Impact,” keep the stack simple and reusable.

---

## 🚀 Quickstart

### 0) Requirements
- Node **20+**
- A wallet with **test MATIC** on **Polygon Amoy** (chain id `80002`)
- Polygon Amoy **RPC** (Alchemy/Infura/etc.)
- *(Optional)* `web3.storage` API token for real IPFS pinning

### 1) Install
```bash
npm i
