import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import Vehicle from '@/models/Vehicle';
import Loan from '@/models/Loan';
import Transaction from '@/models/Transaction';
import Notification from '@/models/Notification';
import Investment from '@/models/Investment';

export async function GET() {
    await dbConnect();

    try {
        // --- User Stats ---
        const totalUsers = await User.countDocuments();
        const totalDrivers = await User.countDocuments({ role: 'driver' });
        const totalInvestors = await User.countDocuments({ role: 'investor' });

        // --- Loan Stats ---
        // Count both 'Active' and 'Approved' as active loans
        const activeLoans = await Loan.countDocuments({ status: { $in: ['Active', 'Approved'] } });
        // Include both 'Pending' and 'Under Review' in pending loans
        const pendingLoans = await Loan.countDocuments({ status: { $in: ['Pending', 'Under Review'] } });
        const completedLoans = await Loan.countDocuments({ status: 'Completed' });
        const totalLoans = await Loan.countDocuments();
        const successRate = totalLoans > 0 ? (completedLoans / totalLoans) * 100 : 0;
        
        // --- Financial Stats (using Aggregation Pipeline) ---
        const investmentAggregation = await Investment.aggregate([
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        const totalFundsInvested = investmentAggregation.length > 0 ? investmentAggregation[0].total : 0;
        
        // financial calculations
        const totalFundsAvailable = 0; // on this later
        const platformRevenue = totalFundsInvested * 0.05; // Assuming a 5% platform fee for simplicity

        // --- Vehicle Stats ---
        const vehicleUtilization = {
            available: await Vehicle.countDocuments({ status: 'Available' }),
            financed: await Vehicle.countDocuments({ status: 'Financed' }),
            reserved: await Vehicle.countDocuments({ status: 'Reserved' }),
            maintenance: await Vehicle.countDocuments({ status: 'Maintenance' }),
        };
        const totalVehicles = Object.values(vehicleUtilization).reduce((a, b) => a + b, 0);

        const averageROIAggregation = await Vehicle.aggregate([
            { $group: { _id: null, avgROI: { $avg: "$roi" } } }
        ]);
        const averageROI = averageROIAggregation.length > 0 ? averageROIAggregation[0].avgROI : 0;
        
        // --- Recent Activity / Notifications ---
        const recentActivity = await Notification.find({
            $or: [{ userId: 'admin' }, { type: 'system_alert' }]
        }).sort({ timestamp: -1 }).limit(5);

        // --- Consolidate all stats ---
        const stats = {
            totalUsers,
            totalDrivers,
            totalInvestors,
            activeLoans,
            pendingLoans,
            totalFundsInvested,
            totalFundsAvailable,
            platformRevenue,
            successRate: Number(successRate.toFixed(1)),
            systemUptime: "99.9%", 
            averageROI,
            vehicleUtilization,
            totalVehicles,
            recentActivity
        };

        return NextResponse.json(stats);

    } catch (error) {
        console.error("Failed to fetch admin dashboard stats:", error);
        return NextResponse.json(
            { message: "Internal Server Error: Could not fetch dashboard statistics." },
            { status: 500 }
        );
    }
}