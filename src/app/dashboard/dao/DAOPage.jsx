"use client";
import { parseUnits } from "viem";
import { payRequest } from "@requestnetwork/payment-processor";

import { useState, useEffect } from "react";
import { useWalletClient, useAccount } from "wagmi";
import {
  RequestNetwork,
  Types,
  Utils,
} from "@requestnetwork/request-client.js";
import { Web3SignatureProvider } from "@requestnetwork/web3-signature";
import { FaPlusCircle, FaVoteYea } from "react-icons/fa";
import { motion } from "framer-motion";
import { ethers } from "ethers";

const CreateProposalForm = ({ fetchProposals }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    option1: "",
    option2: "",
  });
  const [statusMessage, setStatusMessage] = useState("");
  const { data: walletClient } = useWalletClient();
  const { address } = useAccount();

  const createProposal = async () => {
    if (formData.title === "") {
      setStatusMessage("Title cannot be empty!");
      return;
    } else if (formData.description === "") {
      setStatusMessage("Description cannot be empty!");
      return;
    } else if (formData.option1 === "") {
      setStatusMessage("Options cannot be empty!");
      return;
    } else if (formData.option2 === "") {
      setStatusMessage("Options cannot be empty!");
      return;
    }
    setStatusMessage("");
    try {
      if (!walletClient || !address) {
        throw new Error("Please connect your wallet.");
      }

      // Step 1: Create a Request
      const signatureProvider = new Web3SignatureProvider(walletClient);
      const requestClient = new RequestNetwork({
        nodeConnectionConfig: {
          baseURL: "https://sepolia.gateway.request.network/",
        },
        signatureProvider,
      });

      const requestCreateParameters = {
        requestInfo: {
          currency: {
            type: Types.RequestLogic.CURRENCY.ETH,
            network: "sepolia",
          },
          expectedAmount: parseUnits("0.001").toString(), // Fee for creating a proposal
          payee: {
            type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
            value: address,
          },
          timestamp: Utils.getCurrentTimestampInSecond(),
        },
        paymentNetwork: {
          id: Types.Extension.PAYMENT_NETWORK_ID.ETH_INPUT_DATA,
          parameters: {
            paymentAddress: address,
          },
        },
        contentData: {
          title: formData.title,
          description: formData.description,
          options: [formData.option1, formData.option2],
        },
        signer: {
          type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
          value: address,
        },
        topics: ["chainmove-dao-v1"],
      };

      const request = await requestClient.createRequest(
        requestCreateParameters
      );
      const requestId = request.requestId;

      setStatusMessage("Request created. Processing payment...");

      // Step 2: Pay for the Request
      const provider = new ethers.providers.Web3Provider(walletClient);
      const signer = provider.getSigner();
      const paymentTx = await payRequest(request.getData(), signer);
      await paymentTx.wait(2);

      setStatusMessage("Payment confirmed. Saving proposal...");

      // Step 3: Save the Proposal to the Database
      const response = await fetch("/api/dao", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          option1: formData.option1,
          option2: formData.option2,
          duration: 60, // Default duration in minutes
          requestId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save proposal to the database.");
      }

      setStatusMessage("Proposal created successfully!");
      setFormData({ title: "", description: "", option1: "", option2: "" });
      fetchProposals();
    } catch (error) {
      console.error("Error creating proposal:", error);
      setStatusMessage(`Error: ${error.message}`);
    }
  };

  return (
    <motion.div
      className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7 }}>
      <h2 className="text-2xl font-semibold text-orange-500 mb-4 flex items-center">
        <FaPlusCircle className="mr-2" /> Create a New Proposal
      </h2>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Proposal Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full p-3 bg-gray-900 text-white rounded-lg border border-gray-700"
          required
        />
        <textarea
          placeholder="Proposal Description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="w-full p-3 bg-gray-900 text-white rounded-lg border border-gray-700"
          required></textarea>
        <input
          type="text"
          placeholder="Option 1"
          value={formData.option1}
          onChange={(e) =>
            setFormData({ ...formData, option1: e.target.value })
          }
          className="w-full p-3 bg-gray-900 text-white rounded-lg border border-gray-700"
          required
        />
        <input
          type="text"
          placeholder="Option 2"
          value={formData.option2}
          onChange={(e) =>
            setFormData({ ...formData, option2: e.target.value })
          }
          className="w-full p-3 bg-gray-900 text-white rounded-lg border border-gray-700"
          required
        />
        <button
          onClick={createProposal}
          className="w-full bg-orange-500 hover:bg-orange-600 p-3 rounded-lg font-semibold">
          Submit Proposal
        </button>
      </div>
      {statusMessage && <p className="text-orange-400 mt-4">{statusMessage}</p>}
    </motion.div>
  );
};

const VoteProposal = ({ proposal, fetchProposals }) => {
  const { data: walletClient } = useWalletClient();
  const { address } = useAccount();
  const [statusMessage, setStatusMessage] = useState("");

  const voteOnOption = async (option) => {
    setStatusMessage("");
    try {
      if (!walletClient || !address) {
        throw new Error("Please connect your wallet.");
      }

      // Step 1: Create a new Request
      const signatureProvider = new Web3SignatureProvider(walletClient);
      const requestClient = new RequestNetwork({
        nodeConnectionConfig: {
          baseURL: "https://sepolia.gateway.request.network/",
        },
        signatureProvider,
      });

      const requestCreateParameters = {
        requestInfo: {
          currency: {
            type: Types.RequestLogic.CURRENCY.ETH,
            network: "sepolia",
          },
          expectedAmount: parseUnits("0.001").toString(), // Fee for voting in a particular proposal
          payee: {
            type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
            value: address,
          },
          timestamp: Utils.getCurrentTimestampInSecond(),
        },
        paymentNetwork: {
          id: Types.Extension.PAYMENT_NETWORK_ID.ETH_INPUT_DATA,
          parameters: {
            paymentAddress: address,
          },
        },
        contentData: {
          title: proposal.title,
          description: proposal.description,
          option,
        },
        signer: {
          type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
          value: address,
        },
        topics: ["chainmove-dao-v1-vote"],
      };

      const request = await requestClient.createRequest(
        requestCreateParameters
      );
      const requestId = request.requestId;

      setStatusMessage("Request created. Processing payment...");

      // Step 2: Pay for the Request
      const provider = new ethers.providers.Web3Provider(walletClient);
      const signer = provider.getSigner();
      const paymentTx = await payRequest(request.getData(), signer);
      await paymentTx.wait(2);

      setStatusMessage("Payment confirmed. Casting vote...");

      // Step 3: Update the vote count in the backend
      const response = await fetch("/api/dao", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ proposalId: proposal._id, option }),
      });

      if (!response.ok) {
        throw new Error("Failed to save vote.");
      }

      setStatusMessage("Vote cast successfully!");
      fetchProposals();
    } catch (error) {
      console.error("Error casting vote:", error);
      setStatusMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg mb-4">
      <h4 className="text-xl font-semibold text-orange-400">
        {proposal.title}
      </h4>
      <p className="text-gray-400 mb-2">{proposal.description}</p>
      <div className="flex space-x-4">
        <button
          onClick={() => voteOnOption("option1")}
          className="flex-1 bg-blue-500 hover:bg-blue-600 p-3 rounded-lg font-semibold">
          {proposal.option1.text} ({proposal.option1.voteCount})
        </button>
        <button
          onClick={() => voteOnOption("option2")}
          className="flex-1 bg-purple-500 hover:bg-purple-600 p-3 rounded-lg font-semibold">
          {proposal.option2.text} ({proposal.option2.voteCount})
        </button>
      </div>
      {statusMessage && <p className="text-green-400 mt-2">{statusMessage}</p>}
    </div>
  );
};

const DAOPage = () => {
  const [proposals, setProposals] = useState([]);

  const fetchProposals = async () => {
    try {
      const response = await fetch("/api/dao");
      if (!response.ok) {
        throw new Error("Failed to fetch proposals.");
      }
      const data = await response.json();
      setProposals(data.proposals);
    } catch (error) {
      console.error("Error fetching proposals:", error);
    }
  };

  useEffect(() => {
    fetchProposals();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <CreateProposalForm fetchProposals={fetchProposals} />
      <div>
        <h3 className="text-2xl font-semibold mb-4">Active Proposals</h3>
        {proposals.map((proposal) => (
          <VoteProposal
            key={proposal._id}
            proposal={proposal}
            fetchProposals={fetchProposals}
          />
        ))}
      </div>
    </div>
  );
};

export default DAOPage;
