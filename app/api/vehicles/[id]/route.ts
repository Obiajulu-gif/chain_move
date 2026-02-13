import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Vehicle from '@/models/Vehicle';
import { IVehicle } from '@/models/Vehicle';

// GET a single vehicle by ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
    await dbConnect();
    try {
        const vehicle = await Vehicle.findById(params.id);
        if (!vehicle) {
            return NextResponse.json({ success: false, message: "Vehicle not found" }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: vehicle });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
    }
}

// PUT to update a vehicle by ID
export async function PUT(request: Request, { params }: { params: { id: string } }) {
    await dbConnect();
    try {
        const body: Partial<IVehicle> = await request.json();
        const updatedVehicle = await Vehicle.findByIdAndUpdate(params.id, body, {
            new: true,
            runValidators: true,
        });
        if (!updatedVehicle) {
            return NextResponse.json({ success: false, message: "Vehicle not found" }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: updatedVehicle });
    } catch (error) {
         if (error instanceof Error && error.name === 'ValidationError') {
            return NextResponse.json({ success: false, message: error.message }, { status: 400 });
        }
        return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
    }
}

// DELETE a vehicle by ID
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    await dbConnect();
    try {
        const deletedVehicle = await Vehicle.findByIdAndDelete(params.id);
        if (!deletedVehicle) {
            return NextResponse.json({ success: false, message: "Vehicle not found" }, { status: 404 });
        }
        return NextResponse.json({ success: true, message: "Vehicle deleted successfully" });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
    }
}