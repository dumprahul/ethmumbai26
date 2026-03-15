"use client"

import { useState } from "react"
import TransgateConnect from "@zkpass/transgate-js-sdk"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Twitter } from "lucide-react"
import { generateAgeProof } from "@/lib/age-proof"
import {
  submitAgeProofOnChain,
  submitAgeProofOnChainWithEvmWallet,
} from "@/lib/submit-age-proof"

const APP_ID = "e9779656-3ba1-4f32-b9c9-ee4747e37f20"
const SCHEMA_ID = "f54c1d923b8a4e29a185155923250f7b"

async function verifyFollowBitgo(): Promise<unknown> {
  try {
    const connector = new TransgateConnect(APP_ID)
    const res = await connector.launch(SCHEMA_ID)
    console.log("zkPass Transgate response proofs:", res)
    return res
  } catch (error) {
    console.log("transgate error", error)
    return null
  }
}

export function BitgoEventRequirements({
  useEvmWallet = false,
}: {
  /** If true, submit age proof via EVM wallet (private key); if false, via BitGo API. */
  useEvmWallet?: boolean
}) {
  const [age, setAge] = useState("")
  const [ageVerified, setAgeVerified] = useState(false)
  const [ageProof, setAgeProof] = useState<{ proof: string; publicInputs?: string[] } | null>(null)
  const [ageTxHash, setAgeTxHash] = useState<string | null>(null)
  const [ageTxUrl, setAgeTxUrl] = useState<string | null>(null)
  const [ageLoading, setAgeLoading] = useState(false)
  const [ageError, setAgeError] = useState<string | null>(null)
  const [followVerified, setFollowVerified] = useState(false)
  const [followLoading, setFollowLoading] = useState(false)
  const [followError, setFollowError] = useState<string | null>(null)
  const [proof, setProof] = useState<unknown>(null)

  const handleProveFollow = async () => {
    setFollowLoading(true)
    setFollowError(null)
    setProof(null)
    const res = await verifyFollowBitgo()
    setFollowLoading(false)
    if (res != null) {
      setFollowVerified(true)
      setProof(res)
    } else {
      setFollowError("Verification failed or was cancelled.")
    }
  }

  const proofDisplay =
    proof != null
      ? typeof proof === "object"
        ? JSON.stringify(proof, null, 2)
        : String(proof)
      : ""

  const handleProveAge = async (e: React.FormEvent) => {
    e.preventDefault()
    const num = parseInt(age, 10)
    if (Number.isNaN(num) || num <= 18) {
      setAgeError("Age must be greater than 18 to generate a proof.")
      return
    }
    setAgeLoading(true)
    setAgeError(null)
    setAgeProof(null)
    setAgeTxHash(null)
    setAgeTxUrl(null)
    try {
      const result = await generateAgeProof(num)
      if (!result) {
        setAgeError("Failed to generate proof.")
        return
      }
      setAgeProof({
        proof: Array.from(result.proof)
          .map((b) => b.toString(16).padStart(2, "0"))
          .join(""),
        publicInputs: result.publicInputs,
      })
      const txResult = useEvmWallet
        ? await submitAgeProofOnChainWithEvmWallet(result.proof, result.publicInputs)
        : await submitAgeProofOnChain(result.proof, result.publicInputs)
      setAgeTxHash(txResult.hash)
      setAgeTxUrl(txResult.basescanUrl)
      setAgeVerified(true)
    } catch (err) {
      setAgeError(err instanceof Error ? err.message : "Proof or on-chain submit failed.")
    } finally {
      setAgeLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
      {/* Prove follow on X */}
      <div className="border-2 border-foreground bg-background p-5 flex flex-col gap-4">
        <span className="text-[10px] tracking-[0.2em] uppercase font-mono text-muted-foreground">
          REQUIREMENT 1
        </span>
        <p className="text-sm font-mono font-medium text-foreground">
          Prove that you follow Bitgo on X
        </p>
        <Button
          type="button"
          onClick={handleProveFollow}
          disabled={followLoading || followVerified}
          className="font-mono tracking-widest uppercase border-2 border-foreground rounded-none bg-foreground text-background hover:bg-foreground/90 w-fit disabled:opacity-60"
        >
          <Twitter size={14} className="mr-2 shrink-0" />
          {followLoading
            ? "Verifying..."
            : followVerified
              ? "Following · Verified"
              : "Follow & Prove"}
        </Button>
        {followError && (
          <p className="text-xs font-mono text-destructive">{followError}</p>
        )}
        {followVerified && proof != null && (
          <div className="border-2 border-foreground p-4 flex flex-col gap-2 mt-2">
            <span className="text-[10px] tracking-[0.2em] uppercase font-mono text-muted-foreground">
              Proof (returned from verification)
            </span>
            <pre className="text-[11px] font-mono text-foreground overflow-x-auto overflow-y-auto max-h-48 p-3 bg-muted/50 border border-border whitespace-pre-wrap break-all">
              {proofDisplay}
            </pre>
          </div>
        )}
      </div>

      {/* Enter your age / prove above 18 */}
      <div className="border-2 border-foreground bg-background p-5 flex flex-col gap-4">
        <span className="text-[10px] tracking-[0.2em] uppercase font-mono text-muted-foreground">
          REQUIREMENT 2
        </span>
        <p className="text-sm font-mono font-medium text-foreground">
          Enter your age (Prove that you are above 18)
        </p>
        {ageVerified ? (
          <div className="flex flex-col gap-2">
            <p className="text-xs font-mono text-[#ea580c] uppercase tracking-widest">
              Age verified on-chain (ZK proof submitted)
            </p>
            {ageTxHash && ageTxUrl && (
              <a
                href={ageTxUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono text-[#ea580c] hover:underline"
              >
                View on Basescan: {ageTxHash.slice(0, 10)}…{ageTxHash.slice(-8)}
              </a>
            )}
            {ageProof && (
              <>
                <div className="border-2 border-foreground p-4 flex flex-col gap-2 mt-2">
                  <span className="text-[10px] tracking-[0.2em] uppercase font-mono text-muted-foreground">
                    Exact params sent to verifyAge(bytes proof, bytes32[] publicInputs)
                  </span>
                  <div className="flex flex-col gap-2 text-[11px] font-mono">
                    <div>
                      <span className="text-muted-foreground">proof (bytes):</span>
                      <pre className="mt-1 text-foreground overflow-x-auto overflow-y-auto max-h-40 p-3 bg-muted/50 border border-border whitespace-pre-wrap break-all">
                        {ageProof.proof.startsWith("0x") ? ageProof.proof : `0x${ageProof.proof}`}
                      </pre>
                      <span className="text-muted-foreground">
                        length: {ageProof.proof.startsWith("0x") ? ageProof.proof.length - 2 : ageProof.proof.length} hex chars ({(ageProof.proof.startsWith("0x") ? ageProof.proof.length - 2 : ageProof.proof.length) / 2} bytes)
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">publicInputs (bytes32[]):</span>
                      <pre className="mt-1 text-foreground p-2 bg-muted/50 border border-border">
                        {JSON.stringify(ageProof.publicInputs ?? [], null, 2)}
                      </pre>
                      <span className="text-muted-foreground">
                        length: {(ageProof.publicInputs ?? []).length} items
                      </span>
                    </div>
                  </div>
                </div>
                <div className="border-2 border-foreground p-4 flex flex-col gap-2 mt-2">
                  <span className="text-[10px] tracking-[0.2em] uppercase font-mono text-muted-foreground">
                    ZK proof (Noir · Barretenberg)
                  </span>
                  <pre className="text-[11px] font-mono text-foreground overflow-x-auto overflow-y-auto max-h-48 p-3 bg-muted/50 border border-border whitespace-pre-wrap break-all">
                    {ageProof.proof}
                  </pre>
                  {ageProof.publicInputs?.length ? (
                    <p className="text-[10px] font-mono text-muted-foreground">
                      Public inputs: {ageProof.publicInputs.join(", ")}
                    </p>
                  ) : null}
                </div>
              </>
            )}
          </div>
        ) : (
          <form onSubmit={handleProveAge} className="flex flex-col gap-2">
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                type="number"
                min={19}
                max={120}
                placeholder="Age"
                value={age}
                onChange={(e) => {
                  setAge(e.target.value)
                  setAgeError(null)
                }}
                className="font-mono border-2 border-foreground rounded-none w-24"
                disabled={ageLoading}
              />
              <Button
                type="submit"
                disabled={ageLoading}
                className="font-mono tracking-widest uppercase border-2 border-foreground rounded-none bg-foreground text-background hover:bg-foreground/90 w-fit disabled:opacity-60"
              >
                {ageLoading ? "Proving & submitting on-chain..." : "Prove age"}
              </Button>
            </div>
            {ageError && (
              <p className="text-xs font-mono text-destructive">{ageError}</p>
            )}
          </form>
        )}
      </div>
    </div>
  )
}
