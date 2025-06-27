const { ethers, upgrades } = require("hardhat"); // Upgrade function for future use
import { proxyAddress } from "./proxyAddress";

async function upgradeContract() {
  if (!proxyAddress.includes("0x")) {
    return "Pls provide a valid EVM address";
  }
  console.log("Upgrading ChainMoveContract...");

  const ChainMoveContractV2 = await ethers.getContractFactory(
    "ChainMoveContract"
  );

  console.log("Upgrading proxy...");
  const upgraded = await upgrades.upgradeProxy(
    proxyAddress,
    ChainMoveContractV2
  );

  await upgraded.waitForDeployment();

  console.log("Contract upgraded successfully!");

  const newImplementationAddress =
    await upgrades.erc1967.getImplementationAddress(proxyAddress);
  console.log("New implementation address:", newImplementationAddress);

  return upgraded;
}
upgradeContract();
