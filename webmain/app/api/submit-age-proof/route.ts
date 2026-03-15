/**
 * Submits the ZK age proof to AgeVerifier.verifyAge on Base Sepolia via BitGo.
 * Same flow as test/send-tbaseeth-contract.js:
 *   TO_ADDRESS = AGE_VERIFIER_ADDRESS, AMOUNT_ETH = "0", CONTRACT_DATA = encode(verifyAge(proof, publicInputs))
 *   wallet.sendMany({ recipients, walletPassphrase, type: 'transfer', data })
 *
 * Body: { proof: string (hex), publicInputs?: string[] }
 * Returns: { hash, basescanUrl } or error.
 * Server env: ACCESS_TOKEN, WALLET_ID, WALLET_PASSPHRASE, AGE_VERIFIER_ADDRESS
 */

import { ethers } from "ethers"
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { BitGo } = require("bitgo")

const COIN = "tbaseeth"
const BASESCAN_TX_URL = "https://sepolia.basescan.org/tx/"
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
    const publicInputs = Array.isArray(body?.publicInputs) ? body.publicInputs : []

    if (!proofHex || (proofHex.startsWith("0x") ? proofHex.length < 10 : proofHex.length < 8)) {
      return Response.json(
        { error: "Missing or invalid proof (hex string)" },
        { status: 400 }
      )
    }

    const proofHexNorm = proofHex.startsWith("0x") ? proofHex : `0x${proofHex}`

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

    const sendParams: {
      recipients: { address: string; amount: string }[]
      walletPassphrase: string
      type: string
      data: string
      gasLimit?: string
    } = {
      recipients: [{ address: ageVerifierAddress, amount: "0" }],
      walletPassphrase: walletPassphrase!,
      type: "transfer",
      data,
    }

    const gasLimit = strip(process.env.GAS_LIMIT)
    if (gasLimit) {
      const parsed = parseInt(gasLimit, 10)
      if (!Number.isNaN(parsed) && parsed > 0) sendParams.gasLimit = String(parsed)
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
        ...(result && { result }),
      },
      { status: status && status >= 400 && status < 600 ? status : 500 }
    )
  }
}
