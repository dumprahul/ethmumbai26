// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "forge-std/Script.sol";
import "../src/HonkVerifier.sol";
import "../src/AgeVerifier.sol";

contract Deploy is Script {
    function run() external {
        vm.startBroadcast();
        HonkVerifier honk = new HonkVerifier();
        AgeVerifier age = new AgeVerifier(address(honk));
        vm.stopBroadcast();

        console.log("HonkVerifier deployed at:", address(honk));
        console.log("AgeVerifier  deployed at:", address(age));
        console.log("---");
        console.log("Copy the AgeVerifier address into index.js AGE_VERIFIER_ADDRESS");
    }
}
