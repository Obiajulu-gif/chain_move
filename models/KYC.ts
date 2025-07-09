import mongoose, { Document, Schema } from 'mongoose';

export interface IKYC extends Document {
  driverId: Schema.Types.ObjectId;
  fullName: string;
  phoneNumber: string;
  address: string;
  dateOfBirth: Date;
  bvn: string; // Bank Verification Number
  driversLicenseNumber: string;
  status: 'Not Submitted' | 'Pending' | 'Approved' | 'Rejected';
  documents: {
    identityDocumentUrl: string; // e.g., NIN, Passport
    driversLicenseUrl: string;
    proofOfAddressUrl: string; // e.g., Utility Bill
  };
  rejectionReason?: string;
  submittedAt?: Date;
  reviewedAt?: Date;
}

const KYCSchema: Schema = new Schema({
  driverId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  fullName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  address: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  bvn: { type: String, required: true, unique: true },
  driversLicenseNumber: { type: String, required: true, unique: true },
  status: {
    type: String,
    enum: ['Not Submitted', 'Pending', 'Approved', 'Rejected'],
    default: 'Not Submitted',
  },
  documents: {
    identityDocumentUrl: { type: String },
    driversLicenseUrl: { type: String },
    proofOfAddressUrl: { type: String },
  },
  rejectionReason: { type: String },
  submittedAt: { type: Date },
  reviewedAt: { type: Date },
}, { timestamps: true });

export default mongoose.models.KYC || mongoose.model<IKYC>('KYC', KYCSchema);
