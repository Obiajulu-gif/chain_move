import mongoose, { Document, Schema } from 'mongoose';

export interface IVehicle extends Document {
  name: string;
  type: string;
  year: number;
  price: number;
  roi?: number; // Make optional since it will be set by first investor
  features: string[];
  image?: string;
  status: 'Available' | 'Financed' | 'Reserved' | 'Maintenance';
  specifications: {
    engine: string;
    fuelType: string;
    mileage: string;
    transmission: string;
    color: string;
    vin: string;
  };
  addedDate: Date;
  popularity: number;
  driverId?: Schema.Types.ObjectId;
  fundingStatus: 'Open' | 'Funded' | 'Active';
  totalFundedAmount: number;
  // New fields for dynamic ROI
  investmentTerm?: number; // Term in months set by first investor
  isTermSet: boolean; // Whether the term has been set by first investor
}

const VehicleSchema: Schema = new Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  year: { type: Number, required: true },
  price: { type: Number, required: true },
  roi: { type: Number, required: false }, // Not required initially
  features: { type: [String], default: [] },
  image: { type: String },
  status: {
    type: String,
    enum: ['Available', 'Financed', 'Reserved', 'Maintenance'],
    default: 'Available',
  },
  specifications: {
    engine: { type: String },
    fuelType: { type: String },
    mileage: { type: String },
    transmission: { type: String },
    color: { type: String },
    vin: { type: String, unique: true },
  },
  addedDate: { type: Date, default: Date.now },
  popularity: { type: Number, default: 0 },
  driverId: { type: Schema.Types.ObjectId, ref: 'User', required: false },
  fundingStatus: {
    type: String,
    enum: ['Open', 'Funded', 'Active'],
    default: 'Open',
  },
  totalFundedAmount: { type: Number, default: 0 },
  // New fields
  investmentTerm: { type: Number, required: false },
  isTermSet: { type: Boolean, default: false },
});

export default mongoose.models.Vehicle || mongoose.model<IVehicle>('Vehicle', VehicleSchema);