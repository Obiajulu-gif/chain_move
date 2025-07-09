import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import KYC from '@/models/KYC';
import User from '@/models/User';
import { IKYC } from '@/models/KYC';

export async function POST(request: Request) {
  await dbConnect();

  try {
    const body: Partial<IKYC> = await request.json();
    const { driverId, fullName, phoneNumber, address, dateOfBirth, bvn, driversLicenseNumber, documents } = body;

    if (!driverId || !fullName || !phoneNumber || !address || !dateOfBirth || !bvn || !driversLicenseNumber || !documents) {
      return NextResponse.json({ message: 'All fields are required.' }, { status: 400 });
    }

    // Check if a KYC record already exists for this driver
    const existingKYC = await KYC.findOne({ driverId });
    if (existingKYC) {
        // Update the existing record instead of creating a new one
        existingKYC.fullName = fullName;
        existingKYC.phoneNumber = phoneNumber;
        existingKYC.address = address;
        existingKYC.dateOfBirth = dateOfBirth;
        existingKYC.bvn = bvn;
        existingKYC.driversLicenseNumber = driversLicenseNumber;
        existingKYC.documents = documents;
        existingKYC.status = 'Pending'; // Set to pending for re-review
        existingKYC.submittedAt = new Date();
        await existingKYC.save();

        return NextResponse.json({ success: true, message: 'KYC information updated successfully. It is now pending review.' });
    }
    
    // Create new KYC record
    await KYC.create({
      driverId,
      fullName,
      phoneNumber,
      address,
      dateOfBirth,
      bvn,
      driversLicenseNumber,
      documents,
      status: 'Pending',
      submittedAt: new Date(),
    });

    // Update the driver's main status
    await User.findByIdAndUpdate(driverId, { kycStatus: 'Pending' });

    return NextResponse.json({ success: true, message: 'KYC information submitted successfully. It is now pending review.' }, { status: 201 });

  } catch (error) {
    const message = error instanceof Error ? error.message : "An unknown error occurred.";
    console.error("KYC Submission Error:", message);
    return NextResponse.json({ message: 'Server Error: Could not submit KYC information.' }, { status: 500 });
  }
}
