// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

// Governance: Protocol Governance and Parameter Management Contract
contract Governance is Initializable {
    enum ProposalStatus {
        Pending,
        Active,
        Executed,
        Rejected
    }

    struct Proposal {
        uint256 id;
        string description;
        address proposer;
        uint256 votesFor;
        uint256 votesAgainst;
        uint256 startTime;
        uint256 endTime;
        ProposalStatus status;
        mapping(address => bool) hasVoted;
        mapping(address => bool) vote; // true = for, false = against
    }

    struct ProtocolParameters {
        uint256 platformFeePercent;
        uint256 minInvestmentAmount;
        uint256 maxLoanDuration;
        uint256 minInterestRate;
        uint256 maxInterestRate;
        uint256 votingPeriod;
        uint256 proposalThreshold;
    }

    address public admin;
    uint256 public proposalCount;
    ProtocolParameters public protocolParams;
    mapping(uint256 => Proposal) public proposals;
    mapping(address => uint256) public votingPower; // Based on investment amount

    // Events
    event ProposalCreated(
        uint256 indexed proposalId,
        address indexed proposer,
        string description
    );
    event VoteCast(
        uint256 indexed proposalId,
        address indexed voter,
        bool support,
        uint256 weight
    );
    event ProposalExecuted(uint256 indexed proposalId);
    event ParameterUpdated(string parameter, uint256 newValue);
    event VotingPowerUpdated(address indexed user, uint256 newPower);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not admin");
        _;
    }

    function __Governance_init(address _admin) internal onlyInitializing {
        admin = _admin;
        proposalCount = 0;

        // Initialize default protocol parameters
        protocolParams = ProtocolParameters({
            platformFeePercent: 5, // 5%
            minInvestmentAmount: 0.01 ether,
            maxLoanDuration: 365 days,
            minInterestRate: 1, // 1%
            maxInterestRate: 20, // 20%
            votingPeriod: 7 days,
            proposalThreshold: 1000 // Minimum voting power to create proposal
        });
    }

    // Implement voting mechanisms
    function createProposal(
        string calldata description,
        uint256 votingPeriod
    ) public returns (uint256) {
        require(
            votingPower[msg.sender] >= protocolParams.proposalThreshold,
            "Insufficient voting power"
        );

        proposalCount++;
        Proposal storage newProposal = proposals[proposalCount];
        newProposal.id = proposalCount;
        newProposal.description = description;
        newProposal.proposer = msg.sender;
        newProposal.startTime = block.timestamp;
        newProposal.endTime = block.timestamp + votingPeriod;
        newProposal.status = ProposalStatus.Active;

        emit ProposalCreated(proposalCount, msg.sender, description);
        return proposalCount;
    }

    function vote(uint256 proposalId, bool support) public {
        Proposal storage proposal = proposals[proposalId];
        require(
            proposal.status == ProposalStatus.Active,
            "Proposal not active"
        );
        require(block.timestamp <= proposal.endTime, "Voting period ended");
        require(!proposal.hasVoted[msg.sender], "Already voted");
        require(votingPower[msg.sender] > 0, "No voting power");

        proposal.hasVoted[msg.sender] = true;
        proposal.vote[msg.sender] = support;

        uint256 weight = votingPower[msg.sender];
        if (support) {
            proposal.votesFor += weight;
        } else {
            proposal.votesAgainst += weight;
        }

        emit VoteCast(proposalId, msg.sender, support, weight);
    }

    // Handle proposal creation and execution
    function executeProposal(uint256 proposalId) public onlyAdmin {
        Proposal storage proposal = proposals[proposalId];
        require(
            proposal.status == ProposalStatus.Active,
            "Proposal not active"
        );
        require(block.timestamp > proposal.endTime, "Voting period not ended");
        require(proposal.votesFor > proposal.votesAgainst, "Proposal rejected");

        proposal.status = ProposalStatus.Executed;
        emit ProposalExecuted(proposalId);
    }

    function rejectProposal(uint256 proposalId) public onlyAdmin {
        Proposal storage proposal = proposals[proposalId];
        require(
            proposal.status == ProposalStatus.Active,
            "Proposal not active"
        );

        proposal.status = ProposalStatus.Rejected;
    }

    // Manage protocol parameters
    function updatePlatformFee(uint256 newFeePercent) public onlyAdmin {
        require(newFeePercent <= 20, "Fee too high"); // Max 20%
        protocolParams.platformFeePercent = newFeePercent;
        emit ParameterUpdated("platformFeePercent", newFeePercent);
    }

    function updateMinInvestmentAmount(uint256 newAmount) public onlyAdmin {
        protocolParams.minInvestmentAmount = newAmount;
        emit ParameterUpdated("minInvestmentAmount", newAmount);
    }

    function updateMaxLoanDuration(uint256 newDuration) public onlyAdmin {
        protocolParams.maxLoanDuration = newDuration;
        emit ParameterUpdated("maxLoanDuration", newDuration);
    }

    function updateInterestRateRange(
        uint256 newMinRate,
        uint256 newMaxRate
    ) public onlyAdmin {
        require(newMinRate < newMaxRate, "Invalid range");
        protocolParams.minInterestRate = newMinRate;
        protocolParams.maxInterestRate = newMaxRate;
        emit ParameterUpdated("minInterestRate", newMinRate);
        emit ParameterUpdated("maxInterestRate", newMaxRate);
    }

    function updateVotingPeriod(uint256 newPeriod) public onlyAdmin {
        require(newPeriod >= 1 days && newPeriod <= 30 days, "Invalid period");
        protocolParams.votingPeriod = newPeriod;
        emit ParameterUpdated("votingPeriod", newPeriod);
    }

    function updateProposalThreshold(uint256 newThreshold) public onlyAdmin {
        protocolParams.proposalThreshold = newThreshold;
        emit ParameterUpdated("proposalThreshold", newThreshold);
    }

    // Update voting power (called when user invests)
    function updateVotingPower(address user, uint256 additionalPower) internal {
        votingPower[user] += additionalPower;
        emit VotingPowerUpdated(user, votingPower[user]);
    }

    // View functions
    function getProposal(
        uint256 proposalId
    )
        public
        view
        returns (
            uint256 id,
            string memory description,
            address proposer,
            uint256 votesFor,
            uint256 votesAgainst,
            uint256 startTime,
            uint256 endTime,
            ProposalStatus status
        )
    {
        Proposal storage proposal = proposals[proposalId];
        return (
            proposal.id,
            proposal.description,
            proposal.proposer,
            proposal.votesFor,
            proposal.votesAgainst,
            proposal.startTime,
            proposal.endTime,
            proposal.status
        );
    }

    function hasVoted(
        uint256 proposalId,
        address voter
    ) public view returns (bool) {
        return proposals[proposalId].hasVoted[voter];
    }

    function getVote(
        uint256 proposalId,
        address voter
    ) public view returns (bool) {
        return proposals[proposalId].vote[voter];
    }

    function getProtocolParameters()
        public
        view
        returns (ProtocolParameters memory)
    {
        return protocolParams;
    }
}
