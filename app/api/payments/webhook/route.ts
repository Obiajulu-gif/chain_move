import { NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import Transaction from '@/models/Transaction';

export async function POST(request: Request) {
  const secretKey = process.env.PAYSTACK_SECRET_KEY!;
  const body = await request.text();
  const hash = crypto.createHmac('sha512', secretKey).update(body).digest('hex');
  const signature = request.headers.get('x-paystack-signature');
  
  // 1. Verify the webhook signature for security
  if (hash !== signature) {
    return NextResponse.json({ message: 'Invalid signature' }, { status: 401 });
  }

  const event = JSON.parse(body);

  // 2. Check if it's a successful charge event
  if (event.event === 'charge.success') {
    await dbConnect();
    
    const { amount, customer, reference } = event.data;
    const email = customer.email;
    const amountInNaira = amount / 100;

    try {
      // 3. Update the user's available balance
      const user = await User.findOneAndUpdate(
        { email: email },
        { $inc: { availableBalance: amountInNaira } },
        { new: true }
      );

      if (user) {
        // 4. Create a transaction record for bookkeeping
        await Transaction.create({
          userId: user._id,
          userType: 'investor',
          amount: amountInNaira,
          status: 'completed',
          type: 'deposit',
          method: 'gateway',
          gatewayReference: reference,
          description: 'Wallet funded via Paystack',
        });
      }
    } catch (error) {
      console.error('Webhook processing error:', error);
      return NextResponse.json({ message: 'Error processing webhook' }, { status: 500 });
    }
  }

  // 5. Acknowledge receipt of the event
  return NextResponse.json({ status: 'success' }, { status: 200 });
}