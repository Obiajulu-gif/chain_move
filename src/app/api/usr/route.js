import connectDb from "../../backend/connectDb";
import User from "../../backend/UserModel";
import { NextResponse } from "next/server";

// POST: Register a new user
export async function POST(request) {
  try {
    console.log("Connecting to the database...");
    await connectDb();
    console.log("Database connected.");

    const { fullName, email, password, userType } = await request.json();

    // Check if user already exists
    console.log(`Checking if the user with email ${email} exists...`);
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("User already exists.");
      return NextResponse.json(
        { error: "Email is already registered" },
        { status: 400 }
      );
    }

    // Validate userType
    const validUserTypes = ["admin", "user", "driver", "mixed"];
    if (!validUserTypes.includes(userType)) {
      console.log("Invalid user type provided.");
      return NextResponse.json(
        {
          error: "Invalid user type.",
        },
        { status: 400 }
      );
    }

    // Create new user
    console.log("Creating a new user...");
    const newUser = await User.create({ fullName, email, password, userType });
    console.log("New user created successfully.");

    return NextResponse.json(
      {
        message: "User registered successfully",
        user: {
          id: newUser._id,
          fullName: newUser.fullName,
          email: newUser.email,
          userType: newUser.userType,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error during user registration:", error);
    return NextResponse.json(
      { error: "Failed to register user" },
      { status: 500 }
    );
  }
}

// GET: Retrieve a specific user by email
export async function GET(request) {
  try {
    console.log("Connecting to the database...");
    await connectDb();
    console.log("Database connected.");

    // Extract email from query params
    const url = new URL(request.url);
    const email = url.searchParams.get("email");
    if (!email) {
      console.log("No email provided in query parameters.");
      return NextResponse.json(
        { error: "Email query parameter is required" },
        { status: 400 }
      );
    }

    // Fetch user from database
    console.log(`Retrieving user with email: ${email}...`);
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found.");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("User retrieved successfully.");
    return NextResponse.json(
      {
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          userType: user.userType,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during user retrieval:", error);
    return NextResponse.json(
      { error: "Failed to retrieve user" },
      { status: 500 }
    );
  }
}
