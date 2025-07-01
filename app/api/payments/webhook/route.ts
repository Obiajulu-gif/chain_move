import { NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import Transaction from '@/models/Transaction';

export async function POST(request: Request) {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;

  // A more robust check for the secret key
  if (!secretKey) {
    console.error("PAYSTACK_SECRET_KEY is not set in environment variables.");
    return NextResponse.json({ message: 'Server configuration error' }, { status: 500 });
  }

  const body = await request.text();
  const hash = crypto.createHmac('sha512', secretKey).update(body).digest('hex');
  const signature = request.headers.get('x-paystack-signature');
  
  // 1. Verify the webhook signature
  if (hash !== signature) {
    return NextResponse.json({ message: 'Invalid signature' }, { status: 401 });
  }

  const event = JSON.parse(body);

  // 2. Handle only the 'charge.success' event
  if (event.event === 'charge.success') {
    await dbConnect();
    
    const { amount, customer, reference } = event.data;
    
    try {
      // ★★★ CRITICAL IDEMPOTENCY CHECK ★★★
      // Check if this transaction has already been processed
      const existingTransaction = await Transaction.findOne({ gatewayReference: reference });
      if (existingTransaction) {
        // If it exists, we've already handled it.
        // Respond with 200 OK to prevent Paystack from sending it again.
        return NextResponse.json({ message: 'Webhook already processed' }, { status: 200 });
      }

      const email = customer.email;
      const amountInNaira = amount / 100;

      // 3. Find user and update balance
      const user = await User.findOneAndUpdate(
        { email: email },
        { $inc: { availableBalance: amountInNaira } },
        { new: true } // This ensures the updated document is returned
      );

      // Handle case where user is not found
      if (!user) {
        console.warn(`Webhook Error: User with email ${email} not found for transaction ref: ${reference}.`);
        // Still return 200, as the issue is not with the webhook itself.
        // You can decide to create a user or handle this case as needed.
        return NextResponse.json({ message: 'User not found' }, { status: 200 });
      }

      // 4. Create a new transaction record for bookkeeping
      await Transaction.create({
        userId: user._id,
        userType: 'investor', // Or determine dynamically if needed
        amount: amountInNaira,
        status: 'Completed',
        type: 'deposit',
        method: 'gateway',
        gatewayReference: reference,
        description: 'Wallet funded via Paystack',
      });

    } catch (error) {
      console.error('Webhook processing error:', error);
      // Return a 500 error to signal a problem on your end
      return NextResponse.json({ message: 'Error processing webhook' }, { status: 500 });
    }
  }

  // 5. Acknowledge receipt of the event
  return NextResponse.json({ status: 'success' }, { status: 200 });
}