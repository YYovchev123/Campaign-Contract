// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract Campaign {
    uint256 public id;
    string public name;
    string public description;
    uint256 public fundingGoal;
    uint256 public deadline;
    uint256 public balance;
    address public owner;

    mapping(address => uint256) public donators;

    event Donation(address donator, uint256 amount);
    event Refund(address refunder, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "'Not owner");
        _;
    }

    modifier isSuccessful() {
        require(balance == fundingGoal, "Funding goal not reached");
        _;
    }

    modifier isNotSuccessful() {
        require(balance != fundingGoal, "Funding goal is reached");
        _;
    }

    constructor(uint256 _id, string memory _name, string memory _description, uint256 _fundingGoal, uint256 _deadline) {
        id = _id;
        name = _name;
        description = _description;
        fundingGoal = _fundingGoal;
        deadline = _deadline;
        owner = msg.sender;
    }

    function donate() external payable {
        require(msg.value > 0, "Cannot donate 0");
        require(balance + msg.value <= fundingGoal, "Funding goal already reached");

        emit Donation(msg.sender, msg.value);

        balance += msg.value;
        donators[msg.sender] += msg.value; 
    }

    function collectFunds(address to) public onlyOwner isSuccessful {
        uint256 _balance = balance;
        require(to != address(0), "Wrong address");
        balance = 0;
        (bool success, ) = payable(to).call{value: _balance}("");
        require(success);
    }

    function refund() public isNotSuccessful {
        uint256 amount = donators[msg.sender];
        require(amount < 0, "Nothing to refund");
        require(balance > 0, "Not enough balance");
        emit Refund(msg.sender, amount);
        donators[msg.sender] = 0;
        balance -= amount;
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success);
    }
}