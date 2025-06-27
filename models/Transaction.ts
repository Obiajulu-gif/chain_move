import mongoose, { Document, Schema } from 'mongoose';

export interface ITransaction extends Document {
  userId: Schema.Types.ObjectId;
  userType: 'driver' | 'investor' | 'admin';
  type: 'investment' | 'loan_disbursement' | 'repayment' | 'deposit' | 'withdrawal' | 'return';
  amount: number;
  description: string;
  status: 'Pending' | 'Completed' | 'Failed';
  timestamp: Date;
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
    enum: ['investment', 'loan_disbursement', 'repayment', 'deposit', 'withdrawal', 'return'],
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
});

export default mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema);