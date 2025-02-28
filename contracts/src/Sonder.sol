// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract Sonder {
    uint256 public requiredDepositAmount;
    address public owner;

    // Constructor to set the required deposit amount and the owner
    constructor(uint256 _requiredDepositAmount) {
        requiredDepositAmount = _requiredDepositAmount;
        owner = msg.sender;  // Set the owner to be the account deploying the contract
    }

    // Function to receive a deposit fee from anyone with the required amount
    function depositFee() public payable {
        require(msg.value == requiredDepositAmount, "Incorrect deposit amount");
        // The ether is now held in the contract
    }

    // Fallback function to receive ether from users willingly
    receive() external payable {
        // Funds sent to the contract stay here
    }

    // Function to withdraw ether from the contract (only the owner can withdraw)
    function withdraw(uint256 amount) public {
        require(msg.sender == owner, "Only the owner can withdraw");
        payable(msg.sender).transfer(amount);
    }

    // Function to check the contract's balance
    function contractBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
