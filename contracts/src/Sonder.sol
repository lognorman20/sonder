// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract Sonder {
    uint256 public requiredDepositAmount;
    address public owner;
    mapping(address => uint256) public deposits; // Track deposits per user

    constructor(uint256 _requiredDepositAmount) {
        requiredDepositAmount = _requiredDepositAmount;
        owner = msg.sender;
    }

    function depositFee() public payable {
        require(msg.value == requiredDepositAmount, "Incorrect deposit amount");
        deposits[msg.sender] += msg.value; // Track user deposit
    }

    receive() external payable {
        deposits[msg.sender] += msg.value; // Track ETH received
    }

    function withdraw(uint256 amount) public {
        require(msg.sender == owner, "Only the owner can withdraw");
        (bool success, ) = payable(owner).call{value: amount}("");
        require(success, "Owner withdraw failed");
    }

    function contractBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function getUserDeposit(address user) public view returns (uint256) {
        return deposits[user];
    }
}
