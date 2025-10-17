import mongoose, { Document, Schema } from 'mongoose';

export interface ITransaction extends Document {
  userId: Schema.Types.ObjectId;
  userType: 'driver' | 'investor' | 'admin';
  type: 'investment' | 'loan_disbursement' | 'repayment' | 'deposit' | 'withdrawal' | 'return' | 'down_payment';
  amount: number;
  description: string;
  status: 'Pending' | 'Completed' | 'Failed';
  timestamp: Date;
  method?: 'wallet' | 'gateway';
  originalCurrency?: string;
  currency?: string;
  amountOriginal?: number;
  exchangeRate?: number;
  gatewayReference?: string;
  relatedId?: string;
}

const TransactionSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  userType: {
    type: String,
    enum: ['driver', 'investor', 'admin'],
    required: true,
  },
  type: {
    type: String,
    enum: ['investment', 'loan_disbursement', 'repayment', 'deposit', 'withdrawal', 'return', 'down_payment'],
    required: true,
  },
  amount: { type: Number, required: true },
  description: { type: String },
  status: {
    type: String,
    enum: ['Pending', 'Completed', 'Failed'],
    default: 'Completed',
  },
  timestamp: { type: Date, default: Date.now },
  method: { type: String },
  originalCurrency: { type: String },
  currency: { type: String },
  amountOriginal: { type: Number },
  exchangeRate: { type: Number },
  gatewayReference: { type: String },
  relatedId: { type: String },
});

export default mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema);