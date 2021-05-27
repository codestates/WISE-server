import { Schema, model, ObjectId } from 'mongoose';

export interface Notification {
  sender: ObjectId,
  recipient: ObjectId,
  subject: ObjectId,
  clientUrl: string,
  content: string,
  isChecked?: boolean,
}

const NotificationSchema = new Schema<Notification>({
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  recipient: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  subject: {
    type: Schema.Types.ObjectId,
  },
  clientUrl: {
    type: String,
  },
  content: {
    type: String,
    required: true,
  },
  isChecked: {
    type: Boolean,
    required: true,
    default: false,
  },
}, { timestamps: true });

export default model<Notification>('notification', NotificationSchema);
