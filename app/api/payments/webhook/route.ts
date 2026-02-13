import { NextResponse } from "next/server"
import crypto from "crypto"
import dbConnect from "@/lib/dbConnect"
import User from "@/models/User"
import Transaction from "@/models/Transaction"
import Loan from "@/models/Loan"

// Function to get USD/NGN exchange rate
async function getExchangeRate(): Promise<number> {
  try {
    // API for exchange rate
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

  // Verify the webhook signature
  if (hash !== signature) {
    return NextResponse.json({ message: "Invalid signature" }, { status: 401 })
  }

  const event = JSON.parse(body)

  // Handle only the 'charge.success' event
  if (event.event === "charge.success") {
    await dbConnect()

    const { amount, customer, reference, metadata } = event.data

    try {
      //IDEMPOTENCY CHECK
      // Check if this transaction has already been processed
      const existingTransaction = await Transaction.findOne({ gatewayReference: reference })
      if (existingTransaction) {
        // If it exists, we've already handled it.
        // Respond with 200 OK to prevent Paystack from sending it again.
        return NextResponse.json({ message: "Webhook already processed" }, { status: 200 })
      }

      const email = customer.email
      const amountInNaira = amount / 100 // Paystack sends amount in kobo

      //Convert Naira to USD
      const exchangeRate = await getExchangeRate()
      const amountInUSD = amountInNaira * exchangeRate

      console.log(`Converting ₦${amountInNaira.toLocaleString()} to $${amountInUSD.toFixed(2)} at rate ${exchangeRate}`)

      //Find user
      const user = await User.findOne({ email: email })

      // Handle case where user is not found
      if (!user) {
        console.warn(`Webhook Error: User with email ${email} not found for transaction ref: ${reference}.`)
        // Still return 200, as the issue is not with the webhook itself.
        return NextResponse.json({ message: "User not found" }, { status: 200 })
      }

      // Check if this is a down payment transaction
      if (metadata && metadata.paymentType === 'down_payment' && metadata.loanId) {
        // Handle down payment
        const loan = await Loan.findById(metadata.loanId)
        if (loan && !loan.downPaymentMade) {
          // Mark loan as down payment made
          await Loan.findByIdAndUpdate(metadata.loanId, {
            downPaymentMade: true,
            downPaymentAmount: amountInUSD,
            downPaymentDate: new Date()
          })

          // Create transaction record for down payment
          await Transaction.create({
            userId: user._id,
            userType: "driver",
            amount: amountInUSD,
            amountOriginal: amountInNaira,
            currency: "USD",
            originalCurrency: "NGN",
            exchangeRate: exchangeRate,
            status: "Completed",
            type: "down_payment",
            method: "gateway",
            gatewayReference: reference,
            description: `Down payment for Loan #${metadata.loanId} - ₦${amountInNaira.toLocaleString()} converted to $${amountInUSD.toFixed(2)}`,
            relatedId: metadata.loanId
          })

          console.log(`Down payment processed: Loan ${metadata.loanId} marked as paid with $${amountInUSD.toFixed(2)}`)
        }
      } else {
        // Handle regular wallet funding
        await User.findOneAndUpdate(
          { email: email },
          { $inc: { availableBalance: amountInUSD } },
          { new: true }
        )

        //Create a new transaction record for bookkeeping
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
      }

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
