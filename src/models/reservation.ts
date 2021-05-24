import { Schema, model, ObjectId } from 'mongoose';

export interface Reservation {
  customer: ObjectId,
  assistant?: ObjectId,
  service: ObjectId,
  pickup: string,
  hospital: string,
  content: string,
  message: string,
  date: Date,
  time: string,
  hours: number,
  totalPayment: number,
  state: string
}

const ReservationSchema = new Schema<Reservation>({
  customer: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  assistant: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  service: {
    type: Schema.Types.ObjectId,
    ref: 'service',
    required: true,
  },
  pickup: {
    type: String,
    required: true,
  },
  hospital: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  hours: {
    type: Number,
    required: true,
  },
  totalPayment: {
    type: Number,
    required: true,
  },
  state: {
    type: String,
    required: true,
    enum: [
      'apply',
      'accept',
      'complete',
    ],
  },
}, { timestamps: true });

export default model<Reservation>('reservation', ReservationSchema);
