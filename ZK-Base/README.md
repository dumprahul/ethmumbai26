# Noir ZK Age Verifier — Base Sepolia

A browser app that generates a zero-knowledge proof of age (> 18) using [Noir](https://noir-lang.org/) and verifies it on-chain on **Base Sepolia** via a Solidity smart contract.

## Architecture

```
Browser                                Base Sepolia
───────────────────────────            ─────────────────
1. User enters age
2. Noir generates witness
3. Barretenberg generates        ──→   4. AgeVerifier.verifyAge(proof, publicInputs)
   UltraHonk proof (keccak)                └─→ HonkVerifier.verify(proof, publicInputs)
                                            └─→ emits AgeVerified event
```

## Deployed Contracts (Base Sepolia)

| Contract | Address |
|---|---|
| HonkVerifier | `0x907Fd7067f7bF732Aa68BB870399957a7AdfD102` |
| AgeVerifier | `0x907A4E1daeDFf1Ace6E39d55e81dd05Ba06e184f` |

Explorer: https://sepolia.basescan.org/address/0x907A4E1daeDFf1Ace6E39d55e81dd05Ba06e184f

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Yarn](https://yarnpkg.com/) (v1)

The compiled circuit (`target/circuit.json`), verification key (`target/vk/vk`), and Solidity verifier (`contracts/src/HonkVerifier.sol`) are all pre-built and included in the repo. No additional tooling is needed to run the app.

Only needed if you want to modify the circuit or redeploy contracts:
- [Nargo](https://noir-lang.org/docs/getting_started/installation) (v1.0.0-beta.19) — Noir compiler
- [Barretenberg (`bb`)](https://github.com/AztecProtocol/aztec-packages/tree/master/barretenberg) — proof backend
- [Foundry](https://book.getfoundry.sh/getting-started/installation) (`forge`) — Solidity deployment

## Quick Start (Use Existing Deployment)

If you just want to run the app against the already-deployed contracts on Base Sepolia:

### 1. Install dependencies

```bash
yarn install
```

### 2. Set up environment variables

Create a `.env` file in the project root:

```env
VITE_AGE_VERIFIER_ADDRESS=0x907A4E1daeDFf1Ace6E39d55e81dd05Ba06e184f
VITE_PRIVATE_KEY=<your-base-sepolia-private-key>
VITE_BASE_SEPOLIA_RPC=https://sepolia.base.org
```

You need a wallet with some Base Sepolia ETH. Get test ETH from a Base Sepolia faucet (e.g., https://www.alchemy.com/faucets/base-sepolia).

### 3. Run the app

```bash
yarn dev
```

Open http://localhost:5173 in your browser. Enter an age greater than 18 and click **Submit Age**. The app will:

1. Generate a ZK witness from your input
2. Create an UltraHonk proof (with keccak hash for EVM compatibility)
3. Send the proof to the AgeVerifier contract on Base Sepolia
4. Display a Basescan link to the verified transaction

## Full Setup (Modify Circuit / Deploy Your Own Contracts)

Only needed if you change `src/main.nr` or want to deploy fresh contracts. Requires Nargo, Barretenberg (`bb`), and Foundry.

### 1. Install dependencies

```bash
yarn install
```

### 2. Compile the Noir circuit

```bash
nargo compile
```

### 3. Generate the verification key

```bash
bb write_vk -b ./target/circuit.json -o ./target/vk -t evm
```

### 4. Generate the Solidity verifier

```bash
bb write_solidity_verifier -k ./target/vk/vk -o ./contracts/src/HonkVerifier.sol -t evm --optimized
```

### 5. Deploy contracts to Base Sepolia

Create a `.env` file with your private key:

```env
VITE_PRIVATE_KEY=<your-base-sepolia-private-key>
VITE_BASE_SEPOLIA_RPC=https://sepolia.base.org
```

Then deploy:

```bash
source .env
forge script contracts/script/Deploy.s.sol \
  --rpc-url $VITE_BASE_SEPOLIA_RPC \
  --private-key $VITE_PRIVATE_KEY \
  --broadcast
```

Copy the printed `AgeVerifier` address and update `.env`:

```env
VITE_AGE_VERIFIER_ADDRESS=<deployed-age-verifier-address>
```

### 6. Run the app

```bash
yarn dev
```

## Project Structure

```
.
├── src/main.nr                    # Noir circuit: asserts age > 18
├── Nargo.toml                     # Noir project config
├── target/
│   ├── circuit.json               # Compiled circuit (pre-built, committed)
│   └── vk/vk                      # Verification key (pre-built, committed)
├── contracts/
│   ├── src/
│   │   ├── HonkVerifier.sol       # Auto-generated Solidity verifier (bb)
│   │   └── AgeVerifier.sol        # Wrapper contract with verifyAge()
│   ├── script/
│   │   └── Deploy.s.sol           # Foundry deployment script
│   └── lib/forge-std/             # Foundry standard library
├── index.html                     # Frontend UI
├── index.js                       # App logic: proof generation + on-chain verification
├── vite.config.js                 # Vite bundler config with WASM support
├── package.json                   # Node dependencies
├── foundry.toml                   # Foundry config (optimizer enabled)
├── .env                           # Environment variables (not committed)
└── .gitignore
```

## How It Works

### Noir Circuit (`src/main.nr`)

```noir
fn main(age: u8) {
    assert(age > 18);
}
```

The circuit takes a private input `age` and asserts it is greater than 18. The proof proves this assertion holds without revealing the actual age.

### Solidity Contracts

- **HonkVerifier.sol** — Auto-generated by Barretenberg's `bb write_solidity_verifier`. Contains the UltraHonk verification logic (~2400 lines). Optimized with `optimizer_runs = 1` to fit within the 24KB EVM contract size limit.
- **AgeVerifier.sol** — Thin wrapper that calls `HonkVerifier.verify()` and emits an `AgeVerified` event on success.

### Frontend (`index.js`)

1. Initializes Noir WASM modules (ACVM + noirc_abi)
2. Creates a `Noir` instance with the compiled circuit
3. Creates an `UltraHonkBackend` with Barretenberg
4. Executes the circuit to generate a witness
5. Generates a proof with `{ verifierTarget: 'evm' }` (uses keccak hash)
6. Sends the proof to the on-chain AgeVerifier contract using ethers.js
7. Displays the transaction link on Basescan

## Key Dependencies

| Package | Version | Purpose |
|---|---|---|
| `@noir-lang/noir_js` | 1.0.0-beta.19 | Noir circuit execution (witness generation) |
| `@aztec/bb.js` | 4.0.0-nightly.20260120 | Barretenberg backend (proof generation) |
| `ethers` | ^6.13.0 | Ethereum interaction (send tx to Base Sepolia) |
| `vite` | ^7.3.0 | Frontend bundler with WASM support |

## Notes

- The `verifierTarget: 'evm'` flag is critical — it tells Barretenberg to use keccak hashing (compatible with Solidity) instead of the default poseidon2.
- The HonkVerifier contract is ~23.7KB after optimization, just under the 24KB EVM limit (`EIP-170`). The `foundry.toml` uses `optimizer = true` and `optimizer_runs = 1` to minimize contract size.
- The private key in `.env` is used to sign transactions automatically — no MetaMask required.
