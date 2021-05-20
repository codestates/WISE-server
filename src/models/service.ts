import { Schema, model, ObjectId } from 'mongoose';

export interface Service {
  assistant: ObjectId,
  description: string,
  wage: number,
  availableDays: string[],
  greetings: string,
  isDriver: boolean,
  location: string,
  images: string[],
  isTrained: boolean,
  trainingCert: string[],
  isAuthorized: boolean,
  orgAuth: string[],
  starRating: number
}

const ServiceSchema = new Schema<Service>({
  assistant: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    unique: true,
  },
  description: {
    type: String,
    trim: true,
    required: true,
  },
  wage: {
    type: Number,
    required: true,
  },
  availableDays: [
    {
      type: String,
      required: true,
    },
  ],
  greetings: {
    type: String,
    trim: true,
    required: true,
  },
  isDriver: {
    type: Boolean,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  images: [
    {
      type: String,
      required: true,
    },
  ],
  isTrained: {
    type: Boolean,
    required: true,
  },
  trainingCert: [
    {
      type: String,
      required: true,
    },
  ],
  isAuthorized: {
    type: Boolean,
    required: true,
  },
  orgAuth: [
    {
      type: String,
      required: true,
    },
  ],
  starRating: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
    max: 5,
  },
}, { timestamps: true });

export default model<Service>('service', ServiceSchema);
