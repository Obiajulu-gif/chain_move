import mongoose, { Document, Schema } from 'mongoose';

export interface ILoan extends Document {
  driverId: Schema.Types.ObjectId;
  vehicleId: Schema.Types.ObjectId;
  requestedAmount: number;
  totalAmountToPayBack: number;
  totalFunded: number;
  fundingProgress: number;
  status: 'Pending' | 'Under Review' | 'Approved' | 'Rejected' | 'Active' | 'Completed';
  loanTerm: number; // in months
  monthlyPayment: number;
  interestRate: number;
  creditScore: number;
  purpose: string;
  riskAssessment: 'Low' | 'Medium' | 'High';
  submittedDate: Date;
  adminNotes?: string;
  investorApprovals: Schema.Types.ObjectId[];
  downPaymentMade: boolean;
}

const LoanSchema: Schema = new Schema({
  driverId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  vehicleId: { type: Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  requestedAmount: { type: Number, required: true },
  totalAmountToPayBack: { type: Number, required: true },
  totalFunded: { type: Number, default: 0 },
  fundingProgress: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['Pending', 'Under Review', 'Approved', 'Rejected', 'Active', 'Completed'],
    default: 'Pending',
  },
  loanTerm: { type: Number, required: true },
  monthlyPayment: { type: Number, required: true },
  interestRate: { type: Number, required: true },
  creditScore: { type: Number },
  purpose: { type: String },
  riskAssessment: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
  },
  submittedDate: { type: Date, default: Date.now },
  adminNotes: { type: String },
  investorApprovals: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  downPaymentMade: { type: Boolean, default: false },
});

// Pre-save middleware to calculate remaining amount
LoanSchema.virtual('remainingAmount').get(function() {
  return this.requestedAmount - this.totalFunded;
});

export default mongoose.models.Loan || mongoose.model<ILoan>('Loan', LoanSchema);