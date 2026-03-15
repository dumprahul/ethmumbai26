/**
 * Submits the ZK age proof to AgeVerifier.verifyAge on Base Sepolia via BitGo.
 * Same flow as test/send-tbaseeth-contract.js:
 *   TO_ADDRESS = AGE_VERIFIER_ADDRESS, AMOUNT_ETH = "0", CONTRACT_DATA = encode(verifyAge(proof, publicInputs))
 *   wallet.sendMany({ recipients, walletPassphrase, type: 'transfer', data })
 *
 * HonkVerifier expects exactly 0 public inputs (publicInputsSize 16 - PAIRING_POINTS_SIZE 16).
 * Body: { proof: string (hex), publicInputs?: string[] } (publicInputs ignored; we send [])
 * Server env: ACCESS_TOKEN, WALLET_ID, WALLET_PASSPHRASE, AGE_VERIFIER_ADDRESS, [BASE_SEPOLIA_RPC for preflight]
 */

import { ethers } from "ethers"
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { BitGo } = require("bitgo")

const COIN = "tbaseeth"
const BASESCAN_TX_URL = "https://sepolia.basescan.org/tx/"
const DEFAULT_RPC = "https://sepolia.base.org"
const AGE_VERIFIER_ABI = [
  "function verifyAge(bytes calldata proof, bytes32[] calldata publicInputs) external",
]

function strip(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined
  const cleaned = value.replace(/^<|>$/g, "").trim()
  return cleaned.length > 0 ? cleaned : undefined
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const proofHex =
      strip(body?.proof) ?? (body?.proof as string)

    if (!proofHex || (proofHex.startsWith("0x") ? proofHex.length < 10 : proofHex.length < 8)) {
      return Response.json(
        { error: "Missing or invalid proof (hex string)" },
        { status: 400 }
      )
    }

    const proofHexNorm = proofHex.startsWith("0x") ? proofHex : `0x${proofHex}`

    // HonkVerifier for this circuit expects exactly 0 public inputs (see contracts: publicInputsSize 16 - PAIRING_POINTS_SIZE 16)
    const publicInputs: string[] = []

    const accessToken =
      strip(process.env.ACCESS_TOKEN) ?? strip(process.env.BITGO_ACCESS_TOKEN)
    const walletId = strip(process.env.WALLET_ID)
    const walletPassphrase = strip(process.env.WALLET_PASSPHRASE)
    const ageVerifierAddress =
      strip(process.env.AGE_VERIFIER_ADDRESS) ??
      strip(process.env.NEXT_PUBLIC_AGE_VERIFIER_ADDRESS)

    const missing: string[] = []
    if (!accessToken) missing.push("ACCESS_TOKEN or BITGO_ACCESS_TOKEN")
    if (!walletId) missing.push("WALLET_ID")
    if (!walletPassphrase) missing.push("WALLET_PASSPHRASE")
    if (!ageVerifierAddress) missing.push("AGE_VERIFIER_ADDRESS or NEXT_PUBLIC_AGE_VERIFIER_ADDRESS")
    if (missing.length > 0) {
      return Response.json(
        { error: `Missing server env: ${missing.join(", ")}` },
        { status: 500 }
      )
    }

    const env = strip(process.env.ENV) ?? "test"
    const bitgo = new BitGo({ accessToken, env })

    const wallet = await bitgo.coin(COIN).wallets().get({ id: walletId })

    const iface = new ethers.Interface(AGE_VERIFIER_ABI)
    const data = iface.encodeFunctionData("verifyAge", [proofHexNorm, publicInputs])

    // Preflight: simulate call to get revert reason (e.g. ProofLengthWrongWithLogN, Invalid proof)
    const rpc = strip(process.env.BASE_SEPOLIA_RPC) ?? strip(process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC) ?? DEFAULT_RPC
    const provider = new ethers.JsonRpcProvider(rpc)
    const contract = new ethers.Contract(ageVerifierAddress as string, AGE_VERIFIER_ABI, provider)
    try {
      await contract.verifyAge.staticCall(proofHexNorm, publicInputs)
    } catch (simErr: unknown) {
      const msg = simErr instanceof Error ? simErr.message : String(simErr)
      const revertReason = msg.includes("revert") ? msg : `simulation reverted: ${msg}`
      return Response.json(
        {
          error: "Contract would revert. Ensure your circuit and HonkVerifier deployment match (same Noir/BB build).",
          revertReason,
          hint: "Common causes: proof length mismatch, wrong verifier for this circuit, or circuit built with different tooling.",
        },
        { status: 400 }
      )
    }

    const sendParams: {
      recipients: { address: string; amount: string }[]
      walletPassphrase: string
      type: string
      data: string
      gasLimit?: string
    } = {
      recipients: [{ address: ageVerifierAddress as string, amount: "0" }],
      walletPassphrase: walletPassphrase as string,
      type: "transfer",
      data,
    }

    const gasLimit = strip(process.env.GAS_LIMIT)
    if (gasLimit) {
      const parsed = parseInt(gasLimit, 10)
      if (!Number.isNaN(parsed) && parsed > 0) sendParams.gasLimit = String(parsed)
    } else {
      sendParams.gasLimit = "800000"
    }

    const result = await wallet.sendMany(sendParams)

    const txid = result.txid ?? result.txId ?? (result as { hash?: string }).hash
    if (!txid) {
      return Response.json(
        { error: "BitGo did not return a transaction id", result },
        { status: 500 }
      )
    }

    return Response.json({
      hash: txid,
      basescanUrl: BASESCAN_TX_URL + txid,
      status: result.status,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    const status = (err as { status?: number })?.status
    const result = (err as { result?: unknown })?.result
    console.error("[submit-age-proof]", message, result ?? "")
    return Response.json(
      {
        error: message,
        ...(result != null && typeof result === "object" ? { result } : {}),
      },
      { status: status && status >= 400 && status < 600 ? status : 500 }
    )
  }
}
