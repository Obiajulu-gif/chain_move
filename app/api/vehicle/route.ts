import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Vehicle from '@/models/Vehicle';
import User from '@/models/User';

export async function POST(request: Request) {
  await dbConnect();
  try {
    const body = await request.json();
    console.log("body", body)

    // Basic validation
    if (
      !body.name ||
      !body.type ||
      !body.year ||
      !body.price ||
      !body.roi ||
      !body.specifications ||
      !body.specifications.vin ||
      !(body.driverWalletAddress || body.driverEmail)
    ) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Find the driver by wallet address or email
    const driverQuery: any = {};
    if (body.driverWalletAddress) driverQuery.walletaddress = body.driverWalletAddress;
    if (body.driverEmail) driverQuery.email = body.driverEmail;

    const driver = await User.findOne(driverQuery).select('_id');
    if (!driver) {
      return NextResponse.json({ message: "Driver not found" }, { status: 404 });
    }

    // Create and save the new vehicle
    const vehicle = new Vehicle({
      name: body.name,
      type: body.type,
      year: body.year,
      price: body.price,
      roi: body.roi,
      features: body.features || [],
      image: body.image,
      status: body.status || 'Available',
      specifications: body.specifications,
      addedDate: body.addedDate,
      popularity: body.popularity,
      driverId: driver._id,
    });

    await vehicle.save();

    return NextResponse.json({ message: "Vehicle added successfully", vehicle }, { status: 201 });
  } catch (error: any) {
    // Handle duplicate VIN error
    if (error.code === 11000 && error.keyPattern && error.keyPattern['specifications.vin']) {
      return NextResponse.json({ message: "A vehicle with this VIN already exists" }, { status: 409 });
    }
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}