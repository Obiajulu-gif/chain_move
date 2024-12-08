import connectDb from "../../backend/connectDb";
import Proposal from "./model";
import { NextResponse } from "next/server";

// Create a new proposal
export async function POST(request) {
  try {
    console.log("Connecting to the database...");
    await connectDb();
    console.log("Database connected.");

    const { title, description, option1, option2, duration } =
      await request.json();

    if (!title || !description || !option1 || !option2 || !duration) {
      return NextResponse.json(
        {
          error:
            "All fields (title, description, option1, option2, duration) are required",
        },
        { status: 400 }
      );
    }

    console.log("Creating a new proposal...");
    const newProposal = await Proposal.create({
      title,
      description,
      option1: { text: option1 },
      option2: { text: option2 },
      duration,
    });

    console.log("Proposal created successfully.");
    return NextResponse.json(
      { message: "Proposal created", proposal: newProposal },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating proposal:", error);
    return NextResponse.json(
      { error: "Failed to create proposal" },
      { status: 500 }
    );
  }
}

// Update vote counts for a proposal
export async function PATCH(request) {
  try {
    console.log("Connecting to the database...");
    await connectDb();
    console.log("Database connected.");

    const { proposalId, option } = await request.json();

    if (!proposalId || !option) {
      return NextResponse.json(
        { error: "Both proposalId and option are required" },
        { status: 400 }
      );
    }

    console.log(
      `Updating vote count for proposal: ${proposalId}, option: ${option}...`
    );
    const updateField =
      option === "option1"
        ? { "option1.voteCount": 1 }
        : option === "option2"
        ? { "option2.voteCount": 1 }
        : null;

    if (!updateField) {
      return NextResponse.json(
        { error: "Invalid option. Use 'option1' or 'option2'." },
        { status: 400 }
      );
    }

    const updatedProposal = await Proposal.findByIdAndUpdate(
      proposalId,
      { $inc: updateField },
      { new: true } // Return the updated document
    );

    if (!updatedProposal) {
      return NextResponse.json(
        { error: "Proposal with the specified ID not found" },
        { status: 404 }
      );
    }

    console.log("Vote count updated successfully.");
    return NextResponse.json(
      { message: "Vote count updated successfully", proposal: updatedProposal },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating vote count:", error);
    return NextResponse.json(
      { error: "Failed to update vote count" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    console.log("Connecting to the database...");
    await connectDb();
    console.log("Database connected.");

    console.log("Retrieving all proposals sorted by date (latest first)...");
    const proposals = await Proposal.find().sort({ createdAt: -1 }); 

    if (!proposals.length) {
      return NextResponse.json(
        { message: "No proposals found" },
        { status: 404 }
      );
    }

    console.log("Proposals retrieved successfully.");
    return NextResponse.json({ proposals }, { status: 200 });
  } catch (error) {
    console.error("Error retrieving proposals:", error);
    return NextResponse.json(
      { error: "Failed to retrieve proposals" },
      { status: 500 }
    );
  }
}
