// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

// VehicleNFT: Vehicle NFT Management Contract
contract VehicleNFT is Initializable {
    enum VehicleStatus {
        Available,
        Funding,
        Financed
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

    uint256 public vehicleCount;
    mapping(uint256 => Vehicle) public vehicles;

    // Events
    event VehicleListed(
        uint256 indexed vehicleId,
        string metadataURI,
        uint256 price
    );
    event Transfer(
        uint256 indexed vehicleId,
        address indexed from,
        address indexed to
    );
    event Mint(
        uint256 indexed vehicleId,
        address indexed to,
        string metadataURI
    );
    event MetadataUpdate(uint256 indexed vehicleId, string newMetadataURI);

    function __VehicleNFT_init() internal onlyInitializing {
        vehicleCount = 0;
    }

    // Implement mint(): Create new vehicle NFTs
    function mint(
        address to,
        string calldata metadataURI,
        uint256 price
    ) internal returns (uint256) {
        require(price > 0, "Invalid price");
        vehicleCount++;
        vehicles[vehicleCount] = Vehicle({
            id: vehicleCount,
            metadataURI: metadataURI,
            price: price,
            status: VehicleStatus.Available,
            owner: to,
            fundedAmount: 0,
            investorCount: 0
        });

        emit Mint(vehicleCount, to, metadataURI);
        emit VehicleListed(vehicleCount, metadataURI, price);
        return vehicleCount;
    }

    // Implement transfer(): Handle ownership transfers
    function transfer(uint256 vehicleId, address from, address to) internal {
        require(vehicles[vehicleId].owner == from, "Not owner");
        require(to != address(0), "Invalid recipient");

        vehicles[vehicleId].owner = to;
        emit Transfer(vehicleId, from, to);
    }

    // Implement setTokenURI(): Update vehicle metadata
    function setTokenURI(
        uint256 vehicleId,
        string calldata newMetadataURI
    ) internal {
        require(
            vehicleId <= vehicleCount && vehicleId > 0,
            "Vehicle does not exist"
        );
        vehicles[vehicleId].metadataURI = newMetadataURI;
        emit MetadataUpdate(vehicleId, newMetadataURI);
    }

    // Update vehicle status
    function _updateVehicleStatus(
        uint256 vehicleId,
        VehicleStatus newStatus
    ) internal {
        vehicles[vehicleId].status = newStatus;
    }

    // Update funded amount and investor count
    function _updateVehicleFunding(
        uint256 vehicleId,
        uint256 additionalAmount,
        bool isNewInvestor
    ) internal {
        vehicles[vehicleId].fundedAmount += additionalAmount;
        if (isNewInvestor) {
            vehicles[vehicleId].investorCount += 1;
        }
    }

    // Utility function
    function getVehicle(
        uint256 vehicleId
    ) public view returns (Vehicle memory) {
        return vehicles[vehicleId];
    }
}
