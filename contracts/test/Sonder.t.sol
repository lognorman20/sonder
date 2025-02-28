// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/Sonder.sol";

contract SonderTest is Test {
    Sonder public sonder;
    address public owner;
    address public addr1;
    address public addr2;

    function setUp() public {
        // Deploy the Sonder contract with a required deposit amount of 0.001 ether
        sonder = new Sonder(0.001 ether);

        // Set the owner address (the contract deployer)
        owner = address(this);

        // Set additional test accounts
        addr1 = address(0x123);
        addr2 = address(0x456);

        vm.deal(addr1, 0.01 ether);
        vm.deal(addr2, 0.01 ether);
    }

    function testDepositFee() public {
        uint256 depositAmount = 0.001 ether;

        // Ensure the transaction doesn't revert and use the correct function signature
        vm.prank(addr1); // Set addr1 as the sender
        (bool success, ) = address(sonder).call{value: depositAmount}(
            abi.encodeWithSignature("depositFee(string)", "agent1")
        );
        require(success, "Deposit failed");

        uint256 contractBalance = address(sonder).balance;
        assertEq(
            contractBalance,
            depositAmount,
            "Contract balance should be 0.001 ETH"
        );
    }

    function testDepositIncorrectAmount() public {
        // Try depositing an incorrect amount (not equal to 0.001 ETH)
        uint256 depositAmount = 0.002 ether;

        (bool success, ) = address(sonder).call{value: depositAmount}(
            abi.encodeWithSignature("depositFee(string)", "agent1")
        );
        require(!success, "Deposit failed");

        // Ensure the transaction fails
        assertEq(success, false, "Deposit should fail for incorrect amount");
    }

    function testWithdrawNonOwner() public {
        uint256 depositAmount = 0.001 ether;

        // Send the deposit to the contract
        (bool success, ) = address(sonder).call{value: depositAmount}(
            abi.encodeWithSignature("depositFee(string)", "agent1")
        );
        require(success, "Deposit failed");

        // Check the contract balance before withdrawal
        uint256 contractBalanceBefore = address(sonder).balance;

        // Non-owner tries to withdraw
        vm.prank(addr1); // This sets the sender to be addr1
        (success, ) = address(sonder).call{value: 0.001 ether}(
            abi.encodeWithSignature("withdraw(uint256)", 0.001 ether)
        );

        // Ensure the transaction fails (only the owner can withdraw)
        assertEq(success, false, "Non-owner should not be able to withdraw");

        // Contract balance should remain the same
        uint256 contractBalanceAfter = address(sonder).balance;
        assertEq(
            contractBalanceAfter,
            contractBalanceBefore,
            "Contract balance should remain unchanged"
        );
    }

    function testContractBalance() public {
        uint256 depositAmount = 0.001 ether;

        // Send the deposit to the contract
        (bool success, ) = address(sonder).call{value: depositAmount}(
            abi.encodeWithSignature("depositFee(string)", "agent1")
        );
        require(success, "Deposit failed");

        // Check if the contract balance matches the deposit
        uint256 contractBalance = sonder.contractBalance();
        assertEq(
            contractBalance,
            depositAmount,
            "Contract balance should match the deposit amount"
        );
    }

    // Ensure contract owner address is correctly set
    function testOwnerAddress() public {
        address contractOwner = sonder.owner();
        assertEq(
            contractOwner,
            owner,
            "Owner address should match the deploying address"
        );
    }

    // Test receive function (fallback)
    function testReceive() public {
        uint256 depositAmount = 0.001 ether;

        // Send ETH to the contract's fallback function
        (bool success, ) = address(sonder).call{value: depositAmount}("");
        require(success, "Fallback deposit failed");

        // Check the contract balance after the deposit
        uint256 contractBalance = sonder.contractBalance();
        assertEq(
            contractBalance,
            depositAmount,
            "Contract balance should be updated after receiving ETH"
        );
    }

    // Test contract initialization with different deposit amount
    function testContractInitialization() public {
        uint256 newDepositAmount = 0.002 ether;
        Sonder newSonder = new Sonder(newDepositAmount);

        uint256 currentDepositAmount = newSonder.requiredDepositAmount();
        assertEq(
            currentDepositAmount,
            newDepositAmount,
            "Contract should initialize with correct deposit amount"
        );
    }

    function testDepositFeeTracksUserDeposits() public {
        uint256 depositAmount = sonder.requiredDepositAmount(); // Use the contract's required amount

        // addr1 deposits the required amount
        vm.deal(addr1, depositAmount); // Make sure addr1 has enough ETH
        vm.prank(addr1);
        (bool success, ) = address(sonder).call{value: depositAmount}(
            abi.encodeWithSignature("depositFee(string)", "agent1")
        );
        require(success, "Deposit failed");

        // Check addr1's deposit balance
        uint256 addr1Balance = sonder.getUserDeposit(addr1);
        assertEq(
            addr1Balance,
            depositAmount,
            "addr1 deposit should be recorded"
        );
    }

    function testReceiveEtherTracksUserDeposits() public {
        uint256 depositAmount = 0.002 ether;

        // Make sure addr2 has enough ETH
        vm.deal(addr2, depositAmount);

        // addr2 sends ETH directly to the contract
        vm.prank(addr2);
        (bool success, ) = address(sonder).call{value: depositAmount}("");
        require(success, "Ether transfer failed");

        // Check addr2's deposit balance
        uint256 addr2Balance = sonder.getUserDeposit(addr2);
        assertEq(
            addr2Balance,
            depositAmount,
            "addr2 deposit should be recorded"
        );
    }

    function testRewardWithCreator() public {
        // Setup deposits and staking
        uint256 depositAmount = 0.001 ether;
        vm.deal(addr1, depositAmount);
        vm.prank(addr1);
        sonder.depositFee{value: depositAmount}("agent1");

        vm.deal(addr2, depositAmount);
        vm.prank(addr2);
        sonder.depositFee{value: depositAmount}("agent1");

        // Add extra funds to the contract to ensure rewards can be distributed
        vm.deal(owner, 0.01 ether);
        vm.prank(owner);
        (bool success, ) = address(sonder).call{value: 0.01 ether}("");
        require(success, "Adding funds failed");

        // Record balances before reward
        uint256 creatorBalanceBefore = sonder.getUserDeposit(addr1);

        // Set score and creator address
        int256 score = 1; // High score (best performance)
        address creator = addr1; // addr1 is the creator

        // Call reward function
        vm.prank(owner); // Only owner can call reward
        sonder.reward("agent1", score, creator);

        // Check balances to confirm rewards distribution
        uint256 creatorBalanceAfter = addr1.balance;

        // Ensure creator gets rewards
        assertGt(creatorBalanceAfter, 0, "Creator should receive more rewards");
    }

    function testRewardWithLowScore() public {
        // Setup deposits and staking
        uint256 depositAmount = 0.001 ether;
        vm.deal(addr1, depositAmount);
        vm.prank(addr1);
        sonder.depositFee{value: depositAmount}("agent1");

        vm.deal(addr2, depositAmount);
        vm.prank(addr2);
        sonder.depositFee{value: depositAmount}("agent1");

        // Add extra funds to the contract to ensure rewards can be distributed
        vm.deal(owner, 0.01 ether);
        vm.prank(owner);
        (bool success, ) = address(sonder).call{value: 0.01 ether}("");
        require(success, "Adding funds failed");

        // Record balances before reward
        uint256 creatorBalanceBefore = addr1.balance;

        // Set a low score (-1) and creator address
        int256 score = -1; // Low score
        address creator = addr1; // addr1 is the creator

        // Call reward function
        vm.prank(owner); // Only owner can call reward
        sonder.reward("agent1", score, creator);

        // Check balances to confirm rewards distribution
        uint256 creatorBalanceAfter = addr1.balance;

        // Ensure creator gets rewards
        assertGt(
            creatorBalanceAfter,
            creatorBalanceBefore,
            "Creator should receive more rewards"
        );
    }
}
