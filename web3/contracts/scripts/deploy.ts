// Deployment script for ChainMoveContract with OpenZeppelin Upgradeable Proxy
const { ethers, upgrades } = require("hardhat");
import { writeFileSync, existsSync } from "fs";
import path from "path";

async function main() {
  console.log("Deploying ChainMoveContract with upgradeable proxy...");

  // Get the contract factory
  const ChainMoveContract = await ethers.getContractFactory(
    "ChainMoveContract"
  );

  // Deploy the contract using OpenZeppelin upgrades plugin
  console.log("Deploying proxy and implementation...");
  const chainMoveContract = await upgrades.deployProxy(
    ChainMoveContract,
    [], // initialize() takes no parameters
    {
      initializer: "initialize",
      kind: "uups", // Use UUPS proxy pattern
    }
  );

  await chainMoveContract.waitForDeployment();

  const proxyAddress = await chainMoveContract.getAddress();
  console.log("ChainMoveContract deployed to:", proxyAddress);

  // Get implementation address
  const implementationAddress = await upgrades.erc1967.getImplementationAddress(
    proxyAddress
  );
  console.log("Implementation deployed to:", implementationAddress);

  // Get admin address
  const adminAddress = await upgrades.erc1967.getAdminAddress(proxyAddress);
  console.log("ProxyAdmin deployed to:", adminAddress);

  // Verify deployment
  console.log("\nVerifying deployment...");
  const version = await chainMoveContract.version();
  console.log("Contract version:", version);

  const owner = await chainMoveContract.owner();
  console.log("Contract owner:", owner);

  console.log("\nDeployment completed successfully!");

  try {
    const file_content = `export const proxyAddress = "${proxyAddress}" as const;\n`;

    const filePath = path.resolve(__dirname, "proxyAddress.ts");
    console.log(`Writing to file: ${filePath}`);

    writeFileSync(filePath, file_content, "utf-8");

    if (existsSync(filePath)) {
      console.log("✅ File written successfully.");
    } else {
      console.error("❌ File was not created.");
    }
  } catch (err) {
    console.error("❌ Error writing file:", err);
  }
  return {
    proxy: proxyAddress,
    implementation: implementationAddress,
    admin: adminAddress,
  };
}
// Execute deployment
// if (require.main === module) {
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
// }

// module.exports = { main, upgradeContract };
