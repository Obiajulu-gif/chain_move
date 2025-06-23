// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// ChainMove: Vehicle Financing Smart Contract

contract ChainMove {
    enum VehicleStatus {
        Available,
        Funding,
        Financed
    }
    enum LoanStatus {
        None,
        Pending,
        Active, 
        Repaid,
        Defaulted
    }

    struct Vehicle {
        uint256 id;
        string metadataURI; // IPFS or off-chain metadata
        uint256 price;
        VehicleStatus status;
        address owner; // Platform or dealership
        uint256 fundedAmount;
        uint256 investorCount;
    }

    struct Investor {
        bool registered;
        uint256[] investments; // vehicle IDs
        mapping(uint256 => uint256) amountInvested; // vehicleId => amount
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

    address public admin;
    uint256 public vehicleCount;
    uint256 public loanCount;

    mapping(uint256 => Vehicle) public vehicles;
    mapping(address => Investor) public investors;
    mapping(address => Driver) public drivers;
    mapping(uint256 => Loan) public loans; // loanId => Loan
    mapping(uint256 => uint256) public vehicleToLoan; // vehicleId => loanId

    // Events
    event VehicleListed(
        uint256 indexed vehicleId,
        string metadataURI,
        uint256 price
    );
    event InvestorRegistered(address indexed investor);
    event DriverRegistered(address indexed driver);
    event Invested(
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

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not admin");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    // --- Registration ---
    function registerInvestor() external {
        require(!investors[msg.sender].registered, "Already registered");
        investors[msg.sender].registered = true;
        emit InvestorRegistered(msg.sender);
    }

    function registerDriver() external {
        require(!drivers[msg.sender].registered, "Already registered");
        drivers[msg.sender].registered = true;
        emit DriverRegistered(msg.sender);
    }

    // --- Vehicle Listing ---
    function listVehicle(
        string calldata metadataURI,
        uint256 price
    ) external onlyAdmin {
        require(price > 0, "Invalid price");
        vehicleCount++;
        vehicles[vehicleCount] = Vehicle({
            id: vehicleCount,
            metadataURI: metadataURI,
            price: price,
            status: VehicleStatus.Available,
            owner: admin,
            fundedAmount: 0,
            investorCount: 0
        });
        emit VehicleListed(vehicleCount, metadataURI, price);
    }

    // --- Investment (Crowdfunding) ---
    function investInVehicle(uint256 vehicleId) external payable {
        require(investors[msg.sender].registered, "Not an investor");
        Vehicle storage v = vehicles[vehicleId];
        require(
            v.status == VehicleStatus.Available ||
                v.status == VehicleStatus.Funding,
            "Not available for funding"
        );
        require(msg.value > 0, "No funds sent");
        require(v.fundedAmount + msg.value <= v.price, "Overfunding");

        if (investors[msg.sender].amountInvested[vehicleId] == 0) {
            v.investorCount += 1;
            investors[msg.sender].investments.push(vehicleId);
        }
        investors[msg.sender].amountInvested[vehicleId] += msg.value;
        v.fundedAmount += msg.value;

        if (v.fundedAmount == v.price) {
            v.status = VehicleStatus.Financed;
        } else {
            v.status = VehicleStatus.Funding;
        }

        emit Invested(msg.sender, vehicleId, msg.value);
    }

    // --- Loan Application ---
    function applyForLoan(
        uint256 vehicleId,
        uint256 duration,
        uint256 interestRate
    ) external {
        require(drivers[msg.sender].registered, "Not a driver");
        Vehicle storage v = vehicles[vehicleId];
        require(v.status == VehicleStatus.Financed, "Vehicle not fully funded");
        require(
            vehicleToLoan[vehicleId] == 0,
            "Loan already exists for vehicle"
        );

        loanCount++;
        loans[loanCount] = Loan({
            vehicleId: vehicleId,
            driver: msg.sender,
            principal: v.price,
            repaid: 0,
            startTime: 0,
            duration: duration,
            interestRate: interestRate,
            status: LoanStatus.Pending
        });
        vehicleToLoan[vehicleId] = loanCount;
        drivers[msg.sender].loans.push(vehicleId);

        emit LoanApplied(loanCount, msg.sender, vehicleId);
    }

    // --- Loan Activation (Admin) ---
    function activateLoan(uint256 loanId) external onlyAdmin {
        Loan storage loan = loans[loanId];
        require(loan.status == LoanStatus.Pending, "Loan not pending");
        loan.status = LoanStatus.Active;
        loan.startTime = block.timestamp;

        // Transfer vehicle funds to driver
        payable(loan.driver).transfer(loan.principal);

        emit LoanActivated(loanId);
    }

    // --- Repayment ---
    function repayLoan(uint256 loanId) external payable {
        Loan storage loan = loans[loanId];
        require(loan.status == LoanStatus.Active, "Loan not active");
        require(msg.sender == loan.driver, "Not loan owner");
        require(msg.value > 0, "No repayment sent");

        loan.repaid += msg.value;

        // Calculate total due (principal + interest)
        uint256 totalDue = loan.principal +
            ((loan.principal * loan.interestRate) / 100);

        if (loan.repaid >= totalDue) {
            loan.status = LoanStatus.Repaid;
            emit LoanRepaid(loanId);
        }

        emit Repayment(msg.sender, loanId, msg.value);
    }

    // --- Withdrawals for Investors ---
    function withdrawInvestment(uint256 vehicleId) external {
        require(investors[msg.sender].registered, "Not an investor");
        uint256 loanId = vehicleToLoan[vehicleId];
        Loan storage loan = loans[loanId];
        require(loan.status == LoanStatus.Repaid, "Loan not repaid");

        uint256 invested = investors[msg.sender].amountInvested[vehicleId];
        require(invested > 0, "No investment");

        // Calculate share of repayment (principal + interest)
        uint256 totalDue = loan.principal +
            ((loan.principal * loan.interestRate) / 100);
        uint256 payout = (invested * totalDue) / vehicles[vehicleId].price;

        investors[msg.sender].amountInvested[vehicleId] = 0;
        payable(msg.sender).transfer(payout);
    }

    // --- Utility Functions ---
    function getVehicle(
        uint256 vehicleId
    ) external view returns (Vehicle memory) {
        return vehicles[vehicleId];
    }

    function getLoan(uint256 loanId) external view returns (Loan memory) {
        return loans[loanId];
    }

    function getDriverLoans(
        address driver
    ) external view returns (uint256[] memory) {
        return drivers[driver].loans;
    }

    function getInvestorInvestments(
        address investor
    ) external view returns (uint256[] memory) {
        return investors[investor].investments;
    }

    function getVehicleInvestors(
        uint256 vehicleId
    ) external view returns (address[] memory) {
        uint256 investorCount = vehicles[vehicleId].investorCount;
        address[] memory investorAddresses = new address[](investorCount);
        uint256 index = 0;
        for (uint256 i = 0; i < investorCount; i++) {
            uint256 invId = investors[msg.sender].investments[i];
            if (invId == vehicleId) {
                investorAddresses[index] = msg.sender;
                index++;
            }
        }
        return investorAddresses;
    }

    function getLoanDetails(
        uint256 loanId
    )
        external
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

    // --- Admin Functions ---
    function adminWithdraw(uint256 amount) external onlyAdmin {
        payable(admin).transfer(amount);
    }

    // Fallback function to accept ETH
    receive() external payable {}
}
