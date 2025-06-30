import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  const { amount, email } = await request.json();
  const secretKey = process.env.PAYSTACK_SECRET_KEY;

  if (!amount || !email) {
    return NextResponse.json({ message: 'Amount and email are required' }, { status: 400 });
  }

  // Paystack expects the amount in kobo (NGN * 100)
  const amountInKobo = Math.round(parseFloat(amount) * 100);

  try {
    const paystackResponse = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        amount: amountInKobo,
        email: email,
        callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/investor`, // Where to redirect after payment
      },
      {
        headers: {
          Authorization: `Bearer ${secretKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return NextResponse.json(paystackResponse.data);

  } catch (error) {
    console.error('Paystack Initialization Error:', error);
    return NextResponse.json({ message: 'Failed to initialize payment' }, { status: 500 });
  }
}