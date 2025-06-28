import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Vehicle from '@/models/Vehicle';
import Investment from '@/models/Investment';
import User from '@/models/User'; // To update investor balance

export async function POST(request: Request) {
    await dbConnect();
    const { vehicleId, investorId, amount } = await request.json();

    try {
        const vehicle = await Vehicle.findById(vehicleId);
        const investor = await User.findById(investorId);

        if (!vehicle || !investor) {
            return NextResponse.json({ message: "Vehicle or investor not found" }, { status: 404 });
        }
        if (amount > investor.availableBalance) { // Assuming User model has this field
             return NextResponse.json({ message: "Insufficient funds" }, { status: 400 });
        }

        // --- Core Logic ---
        // 1. Create a new Investment record
        await Investment.create({
            investorId,
            vehicleId,
            amount,
            status: 'Funding'
        });

        // 2. Update the vehicle's funding progress
        vehicle.totalFundedAmount += amount;
        
        // 3. Check if the vehicle is now fully funded
        if (vehicle.totalFundedAmount >= vehicle.price) {
            vehicle.fundingStatus = 'Funded';
            // Here you could also trigger a notification
        }
        
        await vehicle.save();
        
        // 4. Deduct amount from investor's balance (This part needs a field on the User model)
        // investor.availableBalance -= amount;
        // await investor.save();

        return NextResponse.json({ success: true, message: "Investment successful" });

    } catch (error) {
        return NextResponse.json({ message: "Server Error" }, { status: 500 });
    }
}