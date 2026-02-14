import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
  userId: string; // Can be a user's ObjectId, or a string like 'admin' or 'system_alert'
  title: string;
  message: string;
  type: string;
  priority: 'low' | 'medium' | 'high';
  read: boolean;
  timestamp: Date;
}

const NotificationSchema: Schema = new Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'low',
  },
  read: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);