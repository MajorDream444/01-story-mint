# Story Mint — Week‑1 Mini‑App (52‑in‑52)

**Turn memories into on‑chain “keepsakes.”**  
Write a short story, (optionally) attach an image, upload metadata to IPFS, and mint an **ERC‑721** on **Polygon Amoy** with built‑in **ERC‑2981 royalties** routed through a **PaymentSplitter**.

---

## ✨ What’s inside
- **Next.js 14 (App Router) + TailwindCSS** UI
- **wagmi + viem** wallet + contract calls
- **Hardhat** + **OpenZeppelin** (ERC‑721, ERC‑2981)
- **IPFS uploader** via `web3.storage` with **dry‑run mode** (works even without a token)
- **RoyaltySplitter** (OpenZeppelin `PaymentSplitter`) for pro‑rata royalty withdrawals
- **CI**: GitHub Actions typecheck/build/compile on every push
- **Tests**: Hardhat unit test for mint + royalty math

> Part of the **52‑in‑52** experiment. North-star: ship weekly, track “Proof of Impact,” keep the stack simple and reusable.

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
```

### 2) Configure environment
Copy `.env.example` → `.env.local` and fill values:
```ini
NEXT_PUBLIC_CHAIN_ID=80002
NEXT_PUBLIC_CONTRACT_ADDRESS=            # fill after deploy

# Hardhat / RPC
RPC_URL_AMOY=                            # e.g. https://polygon-amoy.g.alchemy.com/v2/KEY
PRIVATE_KEY=0x...                        # test-only deployer key

# IPFS (optional)
WEB3_STORAGE_TOKEN=...

# Royalties (optional but recommended)
ROYALTY_ADDRESSES=0xAddr1,0xAddr2
ROYALTY_SHARES=70,30
ROYALTY_BPS=500                          # 500 = 5%
```

### 3) Compile & deploy contracts (Amoy)
```bash
npm run compile
npm run deploy:contract
```
The script prints **StoryMint** address. Put it into `NEXT_PUBLIC_CONTRACT_ADDRESS` in `.env.local`.

### 4) Run the app
```bash
npm run dev
```
Open **http://localhost:3000** → connect wallet → **Upload Metadata** → **Mint**.

---

## 🧱 Architecture

```
Next.js (App Router)
 ├─ /app
 │   ├─ page.tsx         # UI: title, story, image → IPFS → mint
 │   └─ api/ipfs/        # POST: uploads image+metadata to IPFS (or dry-run)
 ├─ /lib/wallet.ts       # wagmi config (Polygon Amoy)
 ├─ /abi/StoryMint.json  # minimal ABI (mint)
 └─ globals.css          # Tailwind styles

Hardhat
 ├─ contracts/
 │   ├─ StoryMint.sol        # ERC-721 + ERC-2981
 │   └─ RoyaltySplitter.sol  # PaymentSplitter receiver
 ├─ scripts/deploy.ts        # Deploys Splitter + StoryMint; sets default royalty
 └─ test/StoryMint.ts        # Unit test for mint + royalty math
```

**Mint flow**
1. User writes **title + short story** and (optionally) selects an **image**.  
2. Click **Upload Metadata** → `/api/ipfs` pins JSON (and image) to IPFS.  
   - No `WEB3_STORAGE_TOKEN`? App returns a **data: URL** tokenURI (dry‑run).  
3. Click **Mint** → calls `StoryMint.mint(tokenURI)` on Polygon Amoy.  
4. Footer shows an **explorer link** when `NEXT_PUBLIC_CONTRACT_ADDRESS` is set.

---

## 💸 Royalties (ERC‑2981) + Splitter

- **Default royalty** is set during deploy via `ROYALTY_BPS` (e.g., `500 = 5%`).  
- Royalty receiver is the **RoyaltySplitter**, which holds funds until payees call `release(...)`.
- Configure payees via env:
  - `ROYALTY_ADDRESSES=0xA,0xB,0xC`
  - `ROYALTY_SHARES=60,30,10` (must match address count; integers sum to any total)

> Most marketplaces that support **ERC‑2981** will route secondary-sale royalties to the **receiver** on-chain.

---

## 🧪 Scripts & tests

**Common commands**
```bash
npm run dev             # local Next server
npm run build           # Next build
npm run compile         # Hardhat compile
npm run deploy:contract # Deploys Splitter + StoryMint; sets default royalty
npm run test            # Hardhat tests
```

**Unit tests** live in `test/StoryMint.ts` and cover:
- Mint with a data-URL tokenURI
- Setting default royalty and verifying `royaltyInfo` math

---

## 🔁 CI

A basic **GitHub Actions** workflow is included at `.github/workflows/ci.yml`:
- Checks out repo
- Sets up Node 20
- Installs deps
- Typechecks + builds Next
- Compiles contracts

> For deploy pipelines, add repo **Secrets** under *Settings → Secrets and variables → Actions*:
> `RPC_URL_AMOY`, `PRIVATE_KEY`, `WEB3_STORAGE_TOKEN` (and any others you need).

---

## ☁️ Deploy (Vercel)

A minimal `vercel.json` is included. Typical steps:
1. Push to GitHub (Vercel auto‑detects Next.js).  
2. In Vercel Project Settings → **Environment Variables** set:
   - `NEXT_PUBLIC_CHAIN_ID=80002`
   - `NEXT_PUBLIC_CONTRACT_ADDRESS=<StoryMint address>`
   - (optional) `WEB3_STORAGE_TOKEN` (if running the IPFS route server-side)

> The `/api/ipfs` route runs on the server (Vercel function). Without a token, the app returns **dry‑run** tokenURIs so you can still test the UX.

---

## 🗂️ Directory structure
```
.
├─ app/
│  ├─ api/ipfs/route.ts
│  ├─ page.tsx
│  └─ globals.css
├─ abi/StoryMint.json
├─ contracts/
│  ├─ StoryMint.sol
│  └─ RoyaltySplitter.sol
├─ scripts/deploy.ts
├─ test/StoryMint.ts
├─ hardhat.config.ts
├─ tailwind.config.ts
├─ vercel.json
└─ README.md
```

---

## 🛠️ Troubleshooting

- **“Set NEXT_PUBLIC_CONTRACT_ADDRESS”** in footer  
  You haven’t populated the env var yet. Deploy contracts and paste address.

- **`insufficient funds for gas` on mint**  
  Add **test MATIC** on Amoy.

- **`missing web3.storage token`**  
  The app is in **dry‑run** mode. You can still mint with a `data:` tokenURI, but IPFS pinning requires `WEB3_STORAGE_TOKEN`.

- **Royalty arrays length mismatch**  
  Ensure `ROYALTY_ADDRESSES.length === ROYALTY_SHARES.length`.

- **CI failing on typecheck**  
  Run `npx tsc --noEmit` locally to see the exact type errors.

---

## 🧭 Roadmap (next commits)
- Image generation + voice‑note summarizer endpoint
- Playwright **E2E mint** (green “Eval or it didn’t happen” badge)
- On‑chain “story hash” registry for content integrity
- Creator/athlete revenue router presets (team‑ready templates)
- One‑click PR to **Week‑1 Mini‑App – Story Mint**

---

## 🔒 Security & Notes
- Never commit private keys. Use `.env.local` and repo **Secrets** only.
- This repository is for **testnet** usage by default (Polygon **Amoy**).
- Contracts are minimal; audit before mainnet.

---

## 📄 License
MIT (or your preference). Contributors retain their copyrights.
