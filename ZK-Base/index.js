// docs:start:imports
import { Barretenberg, UltraHonkBackend } from '@aztec/bb.js';
import { Noir } from '@noir-lang/noir_js';
import initNoirC from '@noir-lang/noirc_abi';
import initACVM from '@noir-lang/acvm_js';
import acvm from '@noir-lang/acvm_js/web/acvm_js_bg.wasm?url';
import noirc from '@noir-lang/noirc_abi/web/noirc_abi_wasm_bg.wasm?url';
import circuit from './target/circuit.json';
import { ethers } from 'ethers';
// Initialize WASM modules
await Promise.all([initACVM(fetch(acvm)), initNoirC(fetch(noirc))]);
// docs:end:imports

// -------------------------------------------------------------------
// On-chain verifier config (Base Sepolia)
// After deploying with: forge script contracts/script/Deploy.s.sol ...
// paste the AgeVerifier contract address below.
// -------------------------------------------------------------------
const AGE_VERIFIER_ADDRESS = import.meta.env.VITE_AGE_VERIFIER_ADDRESS;
const AGE_VERIFIER_ABI = [
  'function verifyAge(bytes calldata proof, bytes32[] calldata publicInputs) external',
];
const BASE_SEPOLIA_RPC = import.meta.env.VITE_BASE_SEPOLIA_RPC;
const PRIVATE_KEY = import.meta.env.VITE_PRIVATE_KEY;
const BASESCAN_TX_URL = 'https://sepolia.basescan.org/tx/';

// docs:start:show_function
const show = (id, content) => {
  const container = document.getElementById(id);
  container.appendChild(document.createTextNode(content));
  container.appendChild(document.createElement('br'));
};

const showLink = (id, text, url) => {
  const container = document.getElementById(id);
  const a = document.createElement('a');
  a.href = url;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  a.textContent = text;
  container.appendChild(a);
  container.appendChild(document.createElement('br'));
};
// docs:end:show_function

document.getElementById('submit').addEventListener('click', async () => {
  try {
    // docs:start:init
    show('logs', 'Creating Noir...');
    const noir = new Noir(circuit);
    show('logs', 'Creating Barretenberg...');
    const barretenbergAPI = await Barretenberg.new();
    show('logs', 'Creating UltraHonkBackend...');
    const backend = new UltraHonkBackend(circuit.bytecode, barretenbergAPI);
    // docs:end:init

    // docs:start:execute
    const age = document.getElementById('age').value;
    show('logs', 'Generating witness... ⏳');
    const { witness } = await noir.execute({ age });
    show('logs', 'Generated witness... ✅');
    // docs:end:execute

    // docs:start:prove
    show('logs', 'Generating proof... ⏳');
    const proof = await backend.generateProof(witness, { verifierTarget: 'evm' });
    show('logs', 'Generated proof... ✅');
    show('results', proof.proof);
    // docs:end:prove

    // docs:start:verify_onchain
    show('logs', 'Sending proof to Base Sepolia... ⏳');
    const provider = new ethers.JsonRpcProvider(BASE_SEPOLIA_RPC);
    const signer = new ethers.Wallet(PRIVATE_KEY, provider);
    const contract = new ethers.Contract(AGE_VERIFIER_ADDRESS, AGE_VERIFIER_ABI, signer);

    const proofBytes = ethers.hexlify(proof.proof);
    const tx = await contract.verifyAge(proofBytes, proof.publicInputs ?? []);
    show('logs', `Tx sent: ${tx.hash} — waiting for confirmation...`);
    const receipt = await tx.wait();
    show('logs', 'On-chain verified! ✅');
    showLink('logs', `View on Basescan: ${receipt.hash}`, BASESCAN_TX_URL + receipt.hash);
    // docs:end:verify_onchain
  } catch (err) {
    show('logs', `Oh 💔 ${err?.message ?? err}`);
  }
});
