import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import Vehicle from '@/models/Vehicle'

export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    // Update all vehicles with fundingStatus 'Funded' to have status 'Financed'
    const result = await Vehicle.updateMany(
      { fundingStatus: 'Funded' },
      { $set: { status: 'Financed' } }
    )

    return NextResponse.json({
      success: true,
      message: `Updated ${result.modifiedCount} vehicles with fundingStatus 'Funded' to status 'Financed'`,
      modifiedCount: result.modifiedCount
    })
  } catch (error) {
    console.error('Migration error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to migrate vehicle status' },
      { status: 500 }
    )
  }
}