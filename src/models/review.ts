import { Schema, model, ObjectId } from 'mongoose';

export interface Review {
  content: string,
  customer: ObjectId,
  service: ObjectId,
  starRating: number,
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
  starRating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
}, { timestamps: true });

export default model<Review>('review', ReviewSchema);
