// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract Sonder {
    uint256 public requiredDepositAmount;
    address public owner;

    mapping(address => uint256) public deposits; // Track deposits per user
    mapping(bytes32 => address[]) public agentDepositors; // Track depositors per agentId (hashed string)

    constructor(uint256 _requiredDepositAmount) {
        requiredDepositAmount = _requiredDepositAmount;
        owner = msg.sender;
    }

    function depositFee(string memory agentId) public payable {
        require(msg.value == requiredDepositAmount, "Incorrect deposit amount");

        bytes32 agentHash = keccak256(abi.encodePacked(agentId)); // Hash the agentId string
        deposits[msg.sender] += msg.value; // Track user deposit

        // Add user to the agent's list if they haven't deposited before
        if (deposits[msg.sender] == msg.value) {
            agentDepositors[agentHash].push(msg.sender);
        }
    }

    function stakeInAgent(string memory agentId) public payable {
        bytes32 agentHash = keccak256(abi.encodePacked(agentId)); // Hash the agentId string
        deposits[msg.sender] += msg.value; // Track user deposit

        // Add user to the agent's list if they haven't deposited before
        if (deposits[msg.sender] == msg.value) {
            agentDepositors[agentHash].push(msg.sender);
        }
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

    function getAgentDepositors(string memory agentId) public view returns (address[] memory) {
        return agentDepositors[keccak256(abi.encodePacked(agentId))];
    }
}
