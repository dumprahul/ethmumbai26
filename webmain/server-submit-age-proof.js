/**
 * Standalone server for submitting ZK age proof via BitGo.
 * Run from webmain: bun run server:age-proof  (or: node server-submit-age-proof.js)
 * Loads .env.local or .env. Set NEXT_PUBLIC_SUBMIT_AGE_PROOF_API=http://localhost:3001 so the app calls this server.
 *
 * This keeps the BitGo SDK out of Next.js so the app compiles in seconds.
 */

const http = require("http")
const fs = require("fs")
const path = require("path")

function loadEnv() {
  const dir = __dirname
  for (const file of [".env.local", ".env"]) {
    const p = path.join(dir, file)
    if (!fs.existsSync(p)) continue
    const content = fs.readFileSync(p, "utf8")
    for (const line of content.split("\n")) {
      const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/)
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "").trim()
    }
    break
  }
}
loadEnv()

const COIN = "tbaseeth"
const BASESCAN_TX_URL = "https://sepolia.basescan.org/tx/"
const AGE_VERIFIER_ABI = [
  "function verifyAge(bytes calldata proof, bytes32[] calldata publicInputs) external",
]
const PORT = Number(process.env.PORT) || 3001

function strip(value) {
  if (typeof value !== "string") return undefined
  const cleaned = value.replace(/^<|>$/g, "").trim()
  return cleaned.length > 0 ? cleaned : undefined
}

async function handleSubmit(body) {
  const { BitGo } = require("bitgo")
  const { ethers } = require("ethers")

  const proofHex = strip(body?.proof) ?? body?.proof
  const publicInputs = Array.isArray(body?.publicInputs) ? body.publicInputs : []

  if (!proofHex || (proofHex.startsWith("0x") ? proofHex.length < 10 : proofHex.length < 8)) {
    return { status: 400, json: { error: "Missing or invalid proof (hex string)" } }
  }

  const proofHexNorm = proofHex.startsWith("0x") ? proofHex : `0x${proofHex}`

  const accessToken = strip(process.env.ACCESS_TOKEN) ?? strip(process.env.BITGO_ACCESS_TOKEN)
  const walletId = strip(process.env.WALLET_ID)
  const walletPassphrase = strip(process.env.WALLET_PASSPHRASE)
  const ageVerifierAddress =
    strip(process.env.AGE_VERIFIER_ADDRESS) ?? strip(process.env.NEXT_PUBLIC_AGE_VERIFIER_ADDRESS)

  const missing = []
  if (!accessToken) missing.push("ACCESS_TOKEN or BITGO_ACCESS_TOKEN")
  if (!walletId) missing.push("WALLET_ID")
  if (!walletPassphrase) missing.push("WALLET_PASSPHRASE")
  if (!ageVerifierAddress) missing.push("AGE_VERIFIER_ADDRESS or NEXT_PUBLIC_AGE_VERIFIER_ADDRESS")
  if (missing.length > 0) {
    return { status: 500, json: { error: `Missing env: ${missing.join(", ")}` } }
  }

  const env = strip(process.env.ENV) ?? "test"
  const bitgo = new BitGo({ accessToken, env })
  const wallet = await bitgo.coin(COIN).wallets().get({ id: walletId })

  const iface = new ethers.Interface(AGE_VERIFIER_ABI)
  const data = iface.encodeFunctionData("verifyAge", [proofHexNorm, publicInputs])

  const sendParams = {
    recipients: [{ address: ageVerifierAddress, amount: "0" }],
    walletPassphrase,
    type: "transfer",
    data,
  }
  const gasLimit = strip(process.env.GAS_LIMIT)
  if (gasLimit && /^\d+$/.test(gasLimit)) sendParams.gasLimit = gasLimit

  const result = await wallet.sendMany(sendParams)
  const txid = result.txid ?? result.txId ?? result.hash
  if (!txid) {
    return { status: 500, json: { error: "BitGo did not return a transaction id", result } }
  }

  return {
    status: 200,
    json: { hash: txid, basescanUrl: BASESCAN_TX_URL + txid, status: result.status },
  }
}

const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type")

  if (req.method === "OPTIONS") {
    res.writeHead(204)
    res.end()
    return
  }

  if (req.method !== "POST" || req.url !== "/api/submit-age-proof") {
    res.writeHead(404, { "Content-Type": "application/json" })
    res.end(JSON.stringify({ error: "Not found" }))
    return
  }

  let body = ""
  for await (const chunk of req) body += chunk
  const parsed = (() => {
    try {
      return JSON.parse(body)
    } catch {
      return {}
    }
  })()

  try {
    const { status, json } = await handleSubmit(parsed)
    res.writeHead(status, { "Content-Type": "application/json" })
    res.end(JSON.stringify(json))
  } catch (err) {
    const message = err?.message ?? String(err)
    const status = err?.status >= 400 && err?.status < 600 ? err.status : 500
    res.writeHead(status, { "Content-Type": "application/json" })
    res.end(JSON.stringify({ error: message, ...(err?.result && { result: err.result }) }))
  }
})

server.listen(PORT, () => {
  console.log(`[submit-age-proof] BitGo server http://localhost:${PORT}/api/submit-age-proof`)
})
