// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

// RevenueSharing: Revenue Distribution and Sharing Contract
contract RevenueSharing is Initializable {
    enum LoanStatus {
        None,
        Pending,
        Active,
        Repaid,
        Defaulted
    }

    struct Driver {
        bool registered;
        uint256[] loans; // vehicle IDs
    }

    struct Loan {
        uint256 vehicleId;
        address driver;
        uint256 principal;
        uint256 repaid;
        uint256 startTime;
        uint256 duration; // seconds
        uint256 interestRate; // e.g., 5 = 5%
        LoanStatus status;
    }

    uint256 public loanCount;
    mapping(address => Driver) public drivers;
    mapping(uint256 => Loan) public loans; // loanId => Loan
    mapping(uint256 => uint256) public vehicleToLoan; // vehicleId => loanId

    // Events
    event DriverRegistered(address indexed driver);
    event PaymentRecorded(
        uint256 indexed loanId,
        address indexed driver,
        uint256 amount
    );
    event RevenueDistributed(
        uint256 indexed vehicleId,
        uint256 totalAmount,
        uint256 investorShare,
        uint256 platformShare
    );
    event EarningsClaimed(
        address indexed investor,
        uint256 indexed vehicleId,
        uint256 amount
    );
    event LoanApplied(
        uint256 indexed loanId,
        address indexed driver,
        uint256 vehicleId
    );
    event LoanActivated(uint256 indexed loanId);
    event Repayment(
        address indexed driver,
        uint256 indexed loanId,
        uint256 amount
    );
    event LoanRepaid(uint256 indexed loanId);

    function __RevenueSharing_init() internal onlyInitializing {
        loanCount = 0;
    }

    // Register driver
    function registerDriver() public {
        require(!drivers[msg.sender].registered, "Already registered");
        drivers[msg.sender].registered = true;
        emit DriverRegistered(msg.sender);
    }

    // Apply for loan
    function applyForLoan(
        address driver,
        uint256 vehicleId,
        uint256 vehiclePrice,
        uint256 duration,
        uint256 interestRate
    ) internal returns (uint256) {
        require(drivers[driver].registered, "Not a driver");
        require(
            vehicleToLoan[vehicleId] == 0,
            "Loan already exists for vehicle"
        );

        loanCount++;
        loans[loanCount] = Loan({
            vehicleId: vehicleId,
            driver: driver,
            principal: vehiclePrice,
            repaid: 0,
            startTime: 0,
            duration: duration,
            interestRate: interestRate,
            status: LoanStatus.Pending
        });
        vehicleToLoan[vehicleId] = loanCount;
        drivers[driver].loans.push(vehicleId);

        emit LoanApplied(loanCount, driver, vehicleId);
        return loanCount;
    }

    // Activate loan
    function activateLoan(uint256 loanId) public {
        Loan storage loan = loans[loanId];
        require(loan.status == LoanStatus.Pending, "Loan not pending");
        loan.status = LoanStatus.Active;
        loan.startTime = block.timestamp;

        // Transfer vehicle funds to driver
        payable(loan.driver).transfer(loan.principal);

        emit LoanActivated(loanId);
    }

    // Implement recordPayment(): Track revenue from vehicles
    function recordPayment(uint256 loanId, uint256 amount) internal {
        Loan storage loan = loans[loanId];
        require(loan.status == LoanStatus.Active, "Loan not active");
        require(amount > 0, "No repayment sent");

        loan.repaid += amount;

        // Calculate total due (principal + interest)
        uint256 totalDue = loan.principal +
            ((loan.principal * loan.interestRate) / 100);

        if (loan.repaid >= totalDue) {
            loan.status = LoanStatus.Repaid;
            emit LoanRepaid(loanId);
        }

        emit PaymentRecorded(loanId, loan.driver, amount);
        emit Repayment(loan.driver, loanId, amount);
    }

    // Implement distribute(): Allocate revenue to investors
    function distribute(
        uint256 vehicleId,
        uint256 totalRevenue,
        uint256 platformFeePercent
    ) internal returns (uint256 investorShare, uint256 platformShare) {
        platformShare = (totalRevenue * platformFeePercent) / 100;
        investorShare = totalRevenue - platformShare;

        emit RevenueDistributed(
            vehicleId,
            totalRevenue,
            investorShare,
            platformShare
        );
        return (investorShare, platformShare);
    }

    // Implement claimEarnings(): Allow investors to claim returns
    function claimEarnings(
        address investor,
        uint256 vehicleId,
        uint256 amount
    ) internal {
        emit EarningsClaimed(investor, vehicleId, amount);
    }

    // Get loan details
    function getLoan(uint256 loanId) public view returns (Loan memory) {
        return loans[loanId];
    }

    // Get driver loans
    function getDriverLoans(
        address driver
    ) public view returns (uint256[] memory) {
        return drivers[driver].loans;
    }

    // Get loan details (expanded)
    function getLoanDetails(
        uint256 loanId
    )
        public
        view
        returns (
            uint256 vehicleId,
            address driver,
            uint256 principal,
            uint256 repaid,
            uint256 startTime,
            uint256 duration,
            uint256 interestRate,
            LoanStatus status
        )
    {
        Loan memory loan = loans[loanId];
        return (
            loan.vehicleId,
            loan.driver,
            loan.principal,
            loan.repaid,
            loan.startTime,
            loan.duration,
            loan.interestRate,
            loan.status
        );
    }

    // Check if driver is registered
    function isDriverRegistered(address driver) public view returns (bool) {
        return drivers[driver].registered;
    }

    // Get loan ID for vehicle
    function getLoanIdForVehicle(
        uint256 vehicleId
    ) public view returns (uint256) {
        return vehicleToLoan[vehicleId];
    }
}
