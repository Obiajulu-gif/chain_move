import { NextResponse } from 'next/server';
import axios from 'axios';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import Loan from '@/models/Loan';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

// Function to get USD/NGN exchange rate (convert USD to NGN)
async function getUSDToNGNRate(): Promise<number> {
  try {
    // Use exchange rate API to get current rates
    const response = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
    const data = await response.json();

    if (data.rates && data.rates.NGN) {
      return data.rates.NGN; // This gives us how many NGN = 1 USD
    }

    // Fallback to fixed rate if API fails
    throw new Error("Exchange rate API failed");
  } catch (error) {
    console.warn("Failed to fetch live exchange rate, using fallback rate:", error);
    // Fallback rate: approximately 1 USD = 1600 NGN (adjust as needed)
    return 1600;
  }
}

export async function POST(request: Request) {
  try {
    console.log('Down payment API called');
    
    // Get JWT token from cookies
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get('token')?.value;
    
    if (!tokenCookie) {
      console.log('No token found');
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Verify JWT token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(tokenCookie, secret);
    const userId = payload.userId as string;
    console.log('User ID from token:', userId);

    const { loanId, amount, currency = 'USD' } = await request.json();
    console.log('Request data:', { loanId, amount, currency });
    
    const secretKey = process.env.PAYSTACK_SECRET_KEY;

    if (!loanId || !amount) {
      console.log('Missing loanId or amount');
      return NextResponse.json({ message: 'Loan ID and amount are required' }, { status: 400 });
    }

    if (!secretKey) {
      console.log('Paystack secret key not configured');
      return NextResponse.json({ message: 'Payment service not configured' }, { status: 500 });
    }

    await dbConnect();
    console.log('Database connected');

    // Verify the loan exists and belongs to the user
    console.log('Looking for loan with ID:', loanId);
    const loan = await Loan.findById(loanId);
    if (!loan) {
      console.log('Loan not found');
      return NextResponse.json({ message: 'Loan not found' }, { status: 404 });
    }
    console.log('Loan found:', loan._id);

    // Get user details
    const user = await User.findById(userId);
    if (!user) {
      console.log('User not found');
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    console.log('User found:', user.email);

    // Verify the loan belongs to this user
    if (loan.driverId.toString() !== user._id.toString()) {
      console.log('Loan ownership mismatch:', { loanDriverId: loan.driverId.toString(), userId: user._id.toString() });
      return NextResponse.json({ message: 'Unauthorized access to loan' }, { status: 403 });
    }

    // Check if down payment already made
    if (loan.downPaymentMade) {
      console.log('Down payment already made');
      return NextResponse.json({ message: 'Down payment already completed' }, { status: 400 });
    }
    console.log('Loan validation passed, proceeding with currency conversion');

    // Convert USD amount to NGN (always convert since Paystack uses NGN)
    const exchangeRate = await getUSDToNGNRate();
    const amountInNaira = amount * exchangeRate;
    console.log(`Converting $${amount} to ₦${amountInNaira.toLocaleString()} at rate ${exchangeRate}`);

    // Paystack expects the amount in kobo (NGN * 100)
    const amountInKobo = Math.round(amountInNaira * 100);
    console.log('Amount in kobo:', amountInKobo);

    // Initialize transaction with Paystack
    console.log('Calling Paystack API...');
    const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: user.email,
        amount: amountInKobo,
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin}/dashboard/driver/loan-terms?payment=success`,
        metadata: {
          loanId: loanId,
          paymentType: 'down_payment',
          userId: userId,
          originalAmountUSD: amount,
          selectedCurrency: currency,
          exchangeRate: exchangeRate,
          amountNGN: amountInNaira
        }
      })
    });

    console.log('Paystack response status:', paystackResponse.status);
    const paystackData = await paystackResponse.json();
    console.log('Paystack response data:', paystackData);
    
    if (!paystackResponse.ok) {
      console.log('Paystack API error:', paystackData);
      return NextResponse.json({ message: 'Payment initialization failed', error: paystackData }, { status: 500 });
    }
    
    return NextResponse.json({
      success: true,
      data: paystackData.data,
      conversionInfo: {
        originalAmountUSD: amount,
        convertedAmountNGN: amountInNaira,
        exchangeRate: exchangeRate,
        selectedCurrency: currency
      }
    });

  } catch (error) {
    console.error('Down payment API error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
