import { Schema, model, ObjectId } from 'mongoose';

export interface Review {
  content: string,
  customer: ObjectId,
  service: ObjectId,
}

const ReviewSchema = new Schema<Review>({
  content: {
    type: String,
    required: true,
    trim: true,
  },
  customer: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  service: {
    type: Schema.Types.ObjectId,
    ref: 'service',
    required: true,
  },
}, { timestamps: true });

export default model<Review>('review', ReviewSchema);
