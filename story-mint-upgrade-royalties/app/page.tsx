'use client'

import { useEffect, useMemo, useState } from 'react'
import { http, createPublicClient } from 'viem'
import { polygonAmoy } from 'viem/chains'
import { useAccount, useConnect, useWriteContract, WagmiProvider } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { config as wagmiConfig } from '../lib/wallet'
import StoryMintAbi from '../abi/StoryMint.json'

const qc = new QueryClient()

function AppInner() {
  const [name, setName] = useState('My Story Memory')
  const [desc, setDesc] = useState('This moment changed everything…')
  const [imageBase64, setImageBase64] = useState<string>('')
  const [tokenUri, setTokenUri] = useState<string>('')
  const [status, setStatus] = useState<string>('')
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}` | undefined

  const { connect } = useConnect()
  const { address, isConnected } = useAccount()
  const { writeContractAsync, isPending } = useWriteContract()

  useEffect(() => {
    // Auto prompt for wallet if not connected
    if (!isConnected) {
      connect({ connector: injected() })
    }
  }, [isConnected, connect])

  const onFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => setImageBase64(reader.result as string)
    reader.readAsDataURL(file)
  }

  const uploadToIPFS = async () => {
    setStatus('Uploading metadata…')
    const res = await fetch('/api/ipfs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description: desc, imageBase64 })
    })
    const json = await res.json()
    setTokenUri(json.tokenUri)
    setStatus(json.dryRun ? 'Dry-run complete (set WEB3_STORAGE_TOKEN for real IPFS)' : 'Pinned to IPFS')
  }

  const mint = async () => {
    if (!contractAddress) {
      setStatus('❗ Set NEXT_PUBLIC_CONTRACT_ADDRESS in .env.local')
      return
    }
    if (!tokenUri) {
      setStatus('Upload metadata first')
      return
    }
    setStatus('Sending mint tx…')
    try {
      const txHash = await writeContractAsync({
        address: contractAddress,
        abi: (StoryMintAbi as any).abi,
        functionName: 'mint',
        args: [tokenUri]
      })
      setStatus(`Minted! Tx: ${txHash}`)
    } catch (e: any) {
      setStatus(`Mint failed: ${e?.shortMessage || e?.message}`)
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Story Mint</h1>
        <div className="text-sm opacity-70">{isConnected ? `Connected: ${address}` : 'Not connected'}</div>
      </header>

      <div className="card space-y-4">
        <div className="grid gap-3">
          <label className="font-medium">Title</label>
          <input value={name} onChange={e=>setName(e.target.value)} className="border rounded px-3 py-2" placeholder="Story title" />
        </div>
        <div className="grid gap-3">
          <label className="font-medium">Short Story</label>
          <textarea value={desc} onChange={e=>setDesc(e.target.value)} rows={5} className="border rounded px-3 py-2" placeholder="Write 1–3 sentences…" />
        </div>
        <div className="grid gap-3">
          <label className="font-medium">Image (optional)</label>
          <input type="file" accept="image/*" onChange={e=>{ const f=e.target.files?.[0]; if(f) onFile(f) }} />
          {imageBase64 && <img src={imageBase64} alt="preview" className="w-full rounded" />}
        </div>

        <div className="flex gap-3">
          <button onClick={uploadToIPFS} className="btn btn-secondary">1) Upload Metadata</button>
          <button onClick={mint} disabled={isPending} className="btn btn-primary">{isPending ? 'Minting…' : '2) Mint'}</button>
        </div>

        <div className="text-sm mt-2">
          <div>Status: {status}</div>
          {tokenUri && (
            <>
              <div className="mt-2 font-mono break-all">TokenURI: {tokenUri}</div>
            </>
          )}
        </div>
      </div>

      <footer className="text-xs opacity-60">Polygon Amoy · ERC‑721 · OpenZeppelin</footer>
    </div>
  )
}

export default function Page() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={qc}>
        <AppInner />
      </QueryClientProvider>
    </WagmiProvider>
  )
}
