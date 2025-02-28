// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract Sonder {
    uint256 public requiredDepositAmount;
    address public owner;

    mapping(address => uint256) public deposits; // { staker : deposited $$$}
    mapping(bytes32 => address[]) public agentDepositors; // { agentId : [Stakers] }

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

    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function getUserDeposit(address user) public view returns (uint256) {
        return deposits[user];
    }

    function getAgentDepositors(
        string memory agentId
    ) public view returns (address[] memory) {
        return agentDepositors[keccak256(abi.encodePacked(agentId))];
    }

    function reward(
        string memory agentId,
        int256 score,
        address creator
    ) public {
        bytes32 agentHash = keccak256(abi.encodePacked(agentId));
        address[] memory stakers = agentDepositors[agentHash];

        uint256 contractBalance = address(this).balance;
        require(contractBalance > 0, "No funds available to distribute");

        // Only use 10% of the contract balance for rewards
        uint256 rewardPool = (contractBalance * 10) / 100;
        require(rewardPool > 0, "Insufficient funds for rewards");

        // Calculate creator's reward (2/3 of the reward pool)
        uint256 creatorReward = (rewardPool * 2) / 3;

        // Distribute the creator's reward
        (bool success, ) = payable(creator).call{value: creatorReward}("");
        require(success, "Creator reward failed");

        // Calculate staker's reward pool (1/3 of the reward pool)
        uint256 stakerRewardPool = rewardPool - creatorReward;

        // Distribute rewards to stakers
        for (uint256 i = 0; i < stakers.length; i++) {
            if (stakers[i] == creator) continue; // Skip creator

            uint256 stakerDeposit = deposits[stakers[i]];

            // Normalize score to a value between 0 and 1 (score ranges from -1 to 1)
            uint256 stakerScoreFactor = uint256((score + 1) * 50); // Score is scaled between 0 and 100

            // Calculate staker's reward based on deposit and score
            uint256 stakerReward = (stakerDeposit *
                stakerScoreFactor *
                stakerRewardPool) / (100 * contractBalance);

            if (stakerReward > 0) {
                (success, ) = payable(stakers[i]).call{value: stakerReward}("");
                require(success, "Staker reward failed");
            }
        }
    }
}
