import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Vehicle from '@/models/Vehicle';
import { IVehicle } from '@/models/Vehicle';

// GET all vehicles
export async function GET() {
    await dbConnect();
    try {
        const vehicles = await Vehicle.find({}).sort({ addedDate: -1 });
        return NextResponse.json({ success: true, data: vehicles });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
    }
}

// POST a new vehicle
export async function POST(request: Request) {
    await dbConnect();
    try {
        const body: IVehicle = await request.json();
        const newVehicle = await Vehicle.create(body);
        return NextResponse.json({ success: true, data: newVehicle }, { status: 201 });
    } catch (error) {
        // Handle potential validation errors
        if (error instanceof Error && error.name === 'ValidationError') {
            return NextResponse.json({ success: false, message: error.message }, { status: 400 });
        }
        return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
    }
}