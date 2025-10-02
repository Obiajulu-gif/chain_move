import mongoose, { Document, Schema } from 'mongoose';

export interface IInvestment extends Document {
  investorId: Schema.Types.ObjectId;
  loanId: Schema.Types.ObjectId;
  vehicleId: Schema.Types.ObjectId;
  amount: number;
  expectedROI: number;
  monthlyReturn: number;
  status: 'Active' | 'Completed' | 'Overdue';
  startDate: Date;
  endDate: Date;
  paymentsReceived: number;
  totalPayments: number;
  nextPaymentDate: Date;
  totalReturns: number;
  investmentTerm: number; // Add term field
}

const InvestmentSchema: Schema = new Schema({
  investorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  loanId: { type: Schema.Types.ObjectId, ref: 'Loan', required: false },
  vehicleId: { type: Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  amount: { type: Number, required: true },
  expectedROI: { type: Number, required: true },
  monthlyReturn: { type: Number, required: true },
  status: {
    type: String,
    enum: ['Active', 'Completed', 'Overdue'],
    default: 'Active',
  },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date, required: true },
  paymentsReceived: { type: Number, default: 0 },
  totalPayments: { type: Number, required: true },
  nextPaymentDate: { type: Date, required: true },
  totalReturns: { type: Number, default: 0 },
  investmentTerm: { type: Number, required: true }, // Add this field
});

export default mongoose.models.Investment || mongoose.model<IInvestment>('Investment', InvestmentSchema);