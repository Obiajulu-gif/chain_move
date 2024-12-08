"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaInfoCircle, FaPlusCircle, FaVoteYea } from "react-icons/fa";

const DAOPage = () => {
  const [proposals, setProposals] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    option1: "",
    option2: "",
    duration: "",
  });
  const [statusMessage, setStatusMessage] = useState("");

  // Fetch active proposals
  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const response = await fetch("/api/dao");
        if (!response.ok) {
          throw new Error("Failed to fetch proposals");
        }
        const data = await response.json();
        setProposals(data.proposals);
      } catch (error) {
        console.error("Error fetching proposals:", error);
      }
    };

    fetchProposals();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const createProposal = async () => {
    setStatusMessage("");
    try {
      const response = await fetch("/api/dao", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create proposal");
      }

      const newProposal = await response.json();
      setProposals((prev) => [...prev, newProposal.proposal]);
      setFormData({
        title: "",
        description: "",
        option1: "",
        option2: "",
        duration: "",
      });
      setShowModal(false);
      setStatusMessage("Proposal created successfully!");
    } catch (error) {
      console.error("Error creating proposal:", error);
      setStatusMessage("Error: Failed to create proposal.");
    }
  };

  const voteOnOption = async (proposalId, option) => {
    try {
      const response = await fetch("/api/dao", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ proposalId, option }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to cast vote");
      }

      const updatedProposal = await response.json();
      setProposals((prev) =>
        prev.map((proposal) =>
          proposal._id === updatedProposal.proposal._id
            ? updatedProposal.proposal
            : proposal
        )
      );
      setStatusMessage("Vote cast successfully!");
    } catch (error) {
      console.error("Error voting on option:", error);
      setStatusMessage("Error: Failed to cast vote.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <motion.div
        className="text-center mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}>
        <h1 className="text-4xl font-bold text-orange-500">ChainMove DAO</h1>
        <p className="text-gray-300 mt-2">
          Participate in community governance and shape the future of ChainMove.
        </p>
      </motion.div>

      {/* Proposal Creation Section */}
      <motion.div
        className="bg-gray-800 p-6 rounded-lg shadow-lg flex items-center justify-between mb-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}>
        <div className="flex items-center space-x-4">
          <FaPlusCircle className="text-3xl text-orange-500" />
          <h2 className="text-2xl font-semibold">Create a New Proposal</h2>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg text-white font-medium transition duration-300">
          Create Proposal
        </button>
      </motion.div>

      {/* Proposal Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-1/2">
            <h3 className="text-2xl font-bold mb-4 text-orange-500">
              New Proposal
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                name="title"
                placeholder="Proposal Title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full p-3 rounded-lg bg-gray-900 text-white border border-gray-700"
              />
              <textarea
                name="description"
                placeholder="Proposal Description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full p-3 rounded-lg bg-gray-900 text-white border border-gray-700"
              />
              <input
                type="text"
                name="option1"
                placeholder="Option 1"
                value={formData.option1}
                onChange={handleInputChange}
                className="w-full p-3 rounded-lg bg-gray-900 text-white border border-gray-700"
              />
              <input
                type="text"
                name="option2"
                placeholder="Option 2"
                value={formData.option2}
                onChange={handleInputChange}
                className="w-full p-3 rounded-lg bg-gray-900 text-white border border-gray-700"
              />
              <input
                type="number"
                name="duration"
                placeholder="Duration (in minutes)"
                value={formData.duration}
                onChange={handleInputChange}
                className="w-full p-3 rounded-lg bg-gray-900 text-white border border-gray-700"
              />
            </div>
            {statusMessage && (
              <p className="text-center mt-4 text-orange-400">
                {statusMessage}
              </p>
            )}
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-white">
                Cancel
              </button>
              <button
                onClick={createProposal}
                className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg text-white">
                Submit Proposal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Proposals Section */}
      <div className="mb-8">
        <h3 className="text-2xl font-semibold mb-4">Active Proposals</h3>
        {proposals.map((proposal) => {
          const now = new Date();
          const createdAt = new Date(proposal.createdAt); // Assuming createdAt is stored in ISO format
          const endTime = new Date(
            createdAt.getTime() + proposal.duration * 60000
          ); // Duration in minutes
          const isExpired = now > endTime;

          return (
            <motion.div
              key={proposal._id}
              className="bg-gray-800 p-4 rounded-lg shadow-lg mb-4 hover:shadow-xl transition-shadow duration-300"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}>
              <div className="flex flex-col space-y-2">
                <h4 className="text-xl font-semibold text-orange-400">
                  {proposal.title}
                </h4>
                <p className="text-gray-400">{proposal.description}</p>
                <p className="text-sm text-gray-500">
                  Duration:{" "}
                  {isExpired
                    ? "Expired"
                    : `Ends at ${endTime.toLocaleTimeString()}`}
                </p>
                <div className="flex space-x-4 mt-2">
                  <button
                    onClick={() => voteOnOption(proposal._id, "option1")}
                    className={`flex-1 px-4 py-2 rounded-lg text-white font-medium transition duration-300 ${
                      isExpired
                        ? "bg-gray-600 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600"
                    }`}
                    disabled={isExpired}>
                    {proposal.option1.text} ({proposal.option1.voteCount})
                  </button>
                  <button
                    onClick={() => voteOnOption(proposal._id, "option2")}
                    className={`flex-1 px-4 py-2 rounded-lg text-white font-medium transition duration-300 ${
                      isExpired
                        ? "bg-gray-600 cursor-not-allowed"
                        : "bg-purple-500 hover:bg-purple-600"
                    }`}
                    disabled={isExpired}>
                    {proposal.option2.text} ({proposal.option2.voteCount})
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default DAOPage;
