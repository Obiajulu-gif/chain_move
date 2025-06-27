// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

// InvestmentPool: Investment Pool Management Contract
contract InvestmentPool is Initializable {
    struct Investor {
        bool registered;
        uint256[] investments; // vehicle IDs
        mapping(uint256 => uint256) amountInvested; // vehicleId => amount
    }

    mapping(address => Investor) public investors;

    // Events
    event InvestorRegistered(address indexed investor);
    event PoolCreated(uint256 indexed vehicleId, uint256 targetAmount);
    event Invested(
        address indexed investor,
        uint256 indexed vehicleId,
        uint256 amount
    );
    event Withdrawn(
        address indexed investor,
        uint256 indexed vehicleId,
        uint256 amount
    );

    function __InvestmentPool_init() internal onlyInitializing {
        // Initialize investment pool specific variables if needed
    }

    // Register investor
    function registerInvestor() public {
        require(!investors[msg.sender].registered, "Already registered");
        investors[msg.sender].registered = true;
        emit InvestorRegistered(msg.sender);
    }

    // Implement createPool(): Initialize new investment opportunities
    function createPool(uint256 vehicleId, uint256 targetAmount) internal {
        emit PoolCreated(vehicleId, targetAmount);
    }

    // Implement invest(): Handle investor contributions
    function invest(
        address investor,
        uint256 vehicleId,
        uint256 amount
    ) internal returns (bool isNewInvestor) {
        require(investors[investor].registered, "Not an investor");
        require(amount > 0, "No funds sent");

        isNewInvestor = investors[investor].amountInvested[vehicleId] == 0;

        if (isNewInvestor) {
            investors[investor].investments.push(vehicleId);
        }

        investors[investor].amountInvested[vehicleId] += amount;
        emit Invested(investor, vehicleId, amount);

        return isNewInvestor;
    }

    // Implement withdraw(): Process investor withdrawals
    function withdraw(
        address investor,
        uint256 vehicleId,
        uint256 amount
    ) internal {
        require(investors[investor].registered, "Not an investor");
        uint256 invested = investors[investor].amountInvested[vehicleId];
        require(invested > 0, "No investment");

        investors[investor].amountInvested[vehicleId] = 0;
        payable(investor).transfer(amount);

        emit Withdrawn(investor, vehicleId, amount);
    }

    // Get investor's investments
    function getInvestorInvestments(
        address investor
    ) public view returns (uint256[] memory) {
        return investors[investor].investments;
    }

    // Get amount invested by investor in specific vehicle
    function getInvestorAmount(
        address investor,
        uint256 vehicleId
    ) public view returns (uint256) {
        return investors[investor].amountInvested[vehicleId];
    }

    // Check if investor is registered
    function isInvestorRegistered(address investor) public view returns (bool) {
        return investors[investor].registered;
    }
}
