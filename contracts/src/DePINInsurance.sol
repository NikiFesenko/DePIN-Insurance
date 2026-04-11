// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract DePINInsurance {
    address public owner;
    address public watcherBot; // The Rust bot that checks if devices are online

    uint256 public constant PAYOUT_AMOUNT = 1 ether; 
    uint256 public constant PREMIUM_COST = 0.05 ether; 

    struct Policy {
        bool isActive;
        string deviceId; 
    }

    mapping(address => Policy) public policies;

    modifier onlyWatcherBot() {
        require(msg.sender == watcherBot, "Only the Rust watcher bot can call this!");
        _;
    }

    constructor(address _watcherBot) {
        owner = msg.sender;
        watcherBot = _watcherBot;
    }

    // 1. Users pay 0.05 ETH to insure their device
    function buyInsurance(string memory _deviceId) external payable {
        require(msg.value == PREMIUM_COST, "Must pay exactly 0.05 ETH");
        require(!policies[msg.sender].isActive, "You already have insurance");

        policies[msg.sender] = Policy({
            isActive: true,
            deviceId: _deviceId
        });
    }
    
    // Allows anyone to supply liquidity to the vault pool
    function supplyLiquidity() external payable {
        require(msg.value > 0, "Must supply ETH");
    }

    // 2. The Rust bot triggers this if the device breaks
    function triggerPayout(address _user) external onlyWatcherBot {
        require(policies[_user].isActive, "User does not have active insurance");
        
        // Turn off the policy so they can't get paid twice
        policies[_user].isActive = false;

        // Send the 1 ETH payout to the user
        (bool success, ) = _user.call{value: PAYOUT_AMOUNT}("");
        require(success, "Payout failed");
    }

    // Allow the vault to hold money
    receive() external payable {}
}