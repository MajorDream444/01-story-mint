# Story Mint — Week‑1 Mini‑App

Minimal scaffold to turn a short story + image into an ERC‑721 “memory keepsake” NFT on **Polygon Amoy**.

## What’s inside
- **Next.js (app router)** + Tailwind
- **wagmi + viem** wallet & contract calls
- **Hardhat** + OpenZeppelin ERC‑721
- **/api/ipfs** using `web3.storage` (optional) to pin metadata & images

---
## Quick start

### 0) Requirements
- Node 20+
- A wallet with some test MATIC on Polygon **Amoy** (chain id `80002`)
- An RPC endpoint (e.g., Alchemy/Infura)
- (Optional) web3.storage API token to pin metadata to IPFS

### 1) Install
```bash
npm i
```

### 2) Configure env
Copy `.env.example` to `.env.local` and fill values:
```env
NEXT_PUBLIC_CHAIN_ID=80002
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourDeployedContract

# Server-side only
RPC_URL_AMOY=https://polygon-amoy.g.alchemy.com/v2/YourKey
PRIVATE_KEY=0xYourPrivateKeyForDeploying
WEB3_STORAGE_TOKEN=YourWeb3StorageToken
```

### 3) Compile & deploy the contract
```bash
npm run compile
npm run deploy:contract
```
The script prints the deployed address. Put it in `NEXT_PUBLIC_CONTRACT_ADDRESS`.

### 4) Run the app
```bash
npm run dev
```
Open http://localhost:3000 — connect wallet → add a title, short story & image → **Mint**.

---
## Notes
- If you skip `WEB3_STORAGE_TOKEN`, the app will still work for a **dry-run** (simulates IPFS and shows the metadata JSON). For on-chain minting, set up real IPFS.
- Contract is intentionally simple; extend with royalties/fee split later.
- Keep your `PRIVATE_KEY` secure. Never commit `.env*`.
