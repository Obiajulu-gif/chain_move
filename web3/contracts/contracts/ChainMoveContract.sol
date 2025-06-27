// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

import "./lib/VehicleNFT.sol";
import "./lib/InvestmentPool.sol";
import "./lib/RevenueSharing.sol";
import "./lib/Governance.sol";

// ChainMoveContract: Main contract that inherits all functionality
contract ChainMoveContract is
    Initializable,
    UUPSUpgradeable,
    OwnableUpgradeable,
    VehicleNFT,
    InvestmentPool,
    RevenueSharing,
    Governance
{
    // Storage gap for future upgrades
    uint256[50] private __gap;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize() public initializer {
        __Ownable_init(msg.sender);
        __UUPSUpgradeable_init();
        __VehicleNFT_init();
        __InvestmentPool_init();
        __RevenueSharing_init();
        __Governance_init(msg.sender);
    }

    // Override required by UUPSUpgradeable
    function _authorizeUpgrade(
        address newImplementation
    ) internal override onlyOwner {}

    // --- Vehicle Listing (Admin Only) ---
    function listVehicle(
        string calldata metadataURI,
        uint256 price
    ) external onlyOwner {
        uint256 vehicleId = mint(owner(), metadataURI, price);
        createPool(vehicleId, price);
    }

    // --- Investment (Crowdfunding) ---
    function investInVehicle(uint256 vehicleId) external payable {
        Vehicle memory v = getVehicle(vehicleId);
        require(
            v.status == VehicleStatus.Available ||
                v.status == VehicleStatus.Funding,
            "Not available for funding"
        );
        require(v.fundedAmount + msg.value <= v.price, "Overfunding");

        bool isNewInvestor = invest(msg.sender, vehicleId, msg.value);

        _updateVehicleFunding(vehicleId, msg.value, isNewInvestor);

        if (v.fundedAmount + msg.value == v.price) {
            _updateVehicleStatus(vehicleId, VehicleStatus.Financed);
        } else {
            _updateVehicleStatus(vehicleId, VehicleStatus.Funding);
        }

        // Update voting power based on investment
        updateVotingPower(msg.sender, msg.value);
    }

    // --- Loan Application ---
    function applyForLoan(
        uint256 vehicleId,
        uint256 duration,
        uint256 interestRate
    ) external {
        Vehicle memory v = getVehicle(vehicleId);
        require(v.status == VehicleStatus.Financed, "Vehicle not fully funded");

        ProtocolParameters memory params = getProtocolParameters();
        require(duration <= params.maxLoanDuration, "Duration too long");
        require(
            interestRate >= params.minInterestRate &&
                interestRate <= params.maxInterestRate,
            "Interest rate out of range"
        );

        applyForLoan(msg.sender, vehicleId, v.price, duration, interestRate);
    }

    // --- Loan Activation (Admin) ---
    // function activateLoan(uint256 loanId) external onlyOwner {
    //     activateLoan(loanId);
    // }

    // --- Repayment ---
    function repayLoan(uint256 loanId) external payable {
        Loan memory loan = getLoan(loanId);
        require(loan.status == LoanStatus.Active, "Loan not active");
        require(msg.sender == loan.driver, "Not loan owner");

        recordPayment(loanId, msg.value);
    }

    // --- Withdrawals for Investors ---
    function withdrawInvestment(uint256 vehicleId) external {
        uint256 loanId = getLoanIdForVehicle(vehicleId);
        Loan memory loan = getLoan(loanId);
        require(loan.status == LoanStatus.Repaid, "Loan not repaid");

        uint256 invested = getInvestorAmount(msg.sender, vehicleId);
        require(invested > 0, "No investment");

        // Calculate share of repayment (principal + interest)
        uint256 totalDue = loan.principal +
            ((loan.principal * loan.interestRate) / 100);

        ProtocolParameters memory params = getProtocolParameters();
        (uint256 investorShare, ) = distribute(
            vehicleId,
            totalDue,
            params.platformFeePercent
        );

        Vehicle memory v = getVehicle(vehicleId);
        uint256 payout = (invested * investorShare) / v.price;

        claimEarnings(msg.sender, vehicleId, payout);
        withdraw(msg.sender, vehicleId, payout);
    }

    // --- Vehicle Investors Utility ---
    function getVehicleInvestors(
        uint256 vehicleId
    ) external view returns (address[] memory) {
        Vehicle memory v = getVehicle(vehicleId);
        uint256 investorCount = v.investorCount;
        address[] memory investorAddresses = new address[](investorCount);

        // Note: This is a simplified implementation
        // In a real scenario, you'd need to track investors separately
        return investorAddresses;
    }

    // --- Admin Functions ---
    function adminWithdraw(uint256 amount) external onlyOwner {
        payable(owner()).transfer(amount);
    }

    // Override transfer function to add access control
    function transferVehicle(uint256 vehicleId, address to) external onlyOwner {
        Vehicle memory v = getVehicle(vehicleId);
        transfer(vehicleId, v.owner, to);
    }

    // Update vehicle metadata (admin only)
    function updateVehicleMetadata(
        uint256 vehicleId,
        string calldata newMetadataURI
    ) external onlyOwner {
        setTokenURI(vehicleId, newMetadataURI);
    }

    // Governance functions accessible to users
    function createGovernanceProposal(
        string calldata description
    ) external returns (uint256) {
        ProtocolParameters memory params = getProtocolParameters();
        return createProposal(description, params.votingPeriod);
    }

    function voteOnProposal(uint256 proposalId, bool support) external {
        vote(proposalId, support);
    }

    function executeGovernanceProposal(uint256 proposalId) external onlyOwner {
        executeProposal(proposalId);
    }

    // Emergency functions
    function pause() external onlyOwner {
        // Implementation for pausing contract functionality
    }

    function unpause() external onlyOwner {
        // Implementation for unpausing contract functionality
    }

    // Version information
    function version() external pure returns (string memory) {
        return "1.0.0";
    }

    // Fallback function to accept ETH
    receive() external payable {}

    // Fallback function
    fallback() external payable {}
}
