import { NextResponse } from "next/server"
import crypto from "crypto"
import dbConnect from "@/lib/dbConnect"
import User from "@/models/User"
import Transaction from "@/models/Transaction"

// Function to get USD/NGN exchange rate
async function getExchangeRate(): Promise<number> {
  try {
    // Option 1: Use a free exchange rate API
    const response = await fetch("https://api.exchangerate-api.com/v4/latest/NGN")
    const data = await response.json()

    if (data.rates && data.rates.USD) {
      return data.rates.USD // This gives us how many USD = 1 NGN
    }

    // Fallback to fixed rate if API fails
    throw new Error("Exchange rate API failed")
  } catch (error) {
    console.warn("Failed to fetch live exchange rate, using fallback rate:", error)
    // Fallback rate: approximately 1 USD = 1600 NGN (adjust as needed)
    return 1 / 1600 // This means 1 NGN = 0.000625 USD
  }
}

export async function POST(request: Request) {
  const secretKey = process.env.PAYSTACK_SECRET_KEY

  // A more robust check for the secret key
  if (!secretKey) {
    console.error("PAYSTACK_SECRET_KEY is not set in environment variables.")
    return NextResponse.json({ message: "Server configuration error" }, { status: 500 })
  }

  const body = await request.text()
  const hash = crypto.createHmac("sha512", secretKey).update(body).digest("hex")
  const signature = request.headers.get("x-paystack-signature")

  // 1. Verify the webhook signature
  if (hash !== signature) {
    return NextResponse.json({ message: "Invalid signature" }, { status: 401 })
  }

  const event = JSON.parse(body)

  // 2. Handle only the 'charge.success' event
  if (event.event === "charge.success") {
    await dbConnect()

    const { amount, customer, reference } = event.data

    try {
      // ★★★ CRITICAL IDEMPOTENCY CHECK ★★★
      // Check if this transaction has already been processed
      const existingTransaction = await Transaction.findOne({ gatewayReference: reference })
      if (existingTransaction) {
        // If it exists, we've already handled it.
        // Respond with 200 OK to prevent Paystack from sending it again.
        return NextResponse.json({ message: "Webhook already processed" }, { status: 200 })
      }

      const email = customer.email
      const amountInNaira = amount / 100 // Paystack sends amount in kobo

      // 3. Convert Naira to USD
      const exchangeRate = await getExchangeRate()
      const amountInUSD = amountInNaira * exchangeRate

      console.log(`Converting ₦${amountInNaira.toLocaleString()} to $${amountInUSD.toFixed(2)} at rate ${exchangeRate}`)

      // 4. Find user and update balance with USD amount
      const user = await User.findOneAndUpdate(
        { email: email },
        { $inc: { availableBalance: amountInUSD } },
        { new: true }, // This ensures the updated document is returned
      )

      // Handle case where user is not found
      if (!user) {
        console.warn(`Webhook Error: User with email ${email} not found for transaction ref: ${reference}.`)
        // Still return 200, as the issue is not with the webhook itself.
        return NextResponse.json({ message: "User not found" }, { status: 200 })
      }

      // 5. Create a new transaction record for bookkeeping
      await Transaction.create({
        userId: user._id,
        userType: "investor", // Or determine dynamically if needed
        amount: amountInUSD, // Store USD amount
        amountOriginal: amountInNaira, // Store original Naira amount for reference
        currency: "USD",
        originalCurrency: "NGN",
        exchangeRate: exchangeRate,
        status: "Completed",
        type: "deposit",
        method: "gateway",
        gatewayReference: reference,
        description: `Wallet funded via Paystack - ₦${amountInNaira.toLocaleString()} converted to $${amountInUSD.toFixed(2)}`,
      })

      console.log(
        `Successfully processed payment: User ${user.email} funded with $${amountInUSD.toFixed(2)} (₦${amountInNaira.toLocaleString()})`,
      )
    } catch (error) {
      console.error("Webhook processing error:", error)
      // Return a 500 error to signal a problem on your end
      return NextResponse.json({ message: "Error processing webhook" }, { status: 500 })
    }
  }

  // 6. Acknowledge receipt of the event
  return NextResponse.json({ status: "success" }, { status: 200 })
}
