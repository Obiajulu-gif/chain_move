import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Transaction from "@/models/Transaction";

export async function GET(request: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const userType = searchParams.get("userType");
    const includeTypesParam = searchParams.get("includeTypes");

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const filter: any = { userId };
    if (userType) filter.userType = userType;
    if (includeTypesParam) {
      const types = includeTypesParam.split(",").map((t) => t.trim()).filter(Boolean);
      if (types.length > 0) filter.type = { $in: types };
    }

    const transactions = await Transaction.find(filter).sort({ timestamp: -1 });

    return NextResponse.json({ success: true, transactions });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}