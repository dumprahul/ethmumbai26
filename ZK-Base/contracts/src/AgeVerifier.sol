// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "./HonkVerifier.sol";

/// @notice Wraps the auto-generated UltraHonk verifier to prove age > 18 on-chain.
///         Age itself is never revealed — the proof is zero-knowledge.
contract AgeVerifier {
    IVerifier public immutable verifier;

    event AgeVerified(address indexed prover);

    constructor(address _verifier) {
        verifier = IVerifier(_verifier);
    }

    /// @param proof    The UltraHonk proof bytes from bb.js
    /// @param publicInputs  Public inputs (empty array — age is private)
    function verifyAge(bytes calldata proof, bytes32[] calldata publicInputs) external {
        require(verifier.verify(proof, publicInputs), "Invalid proof");
        emit AgeVerified(msg.sender);
    }
}
