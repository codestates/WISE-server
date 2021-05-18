import { Schema, model, ObjectId } from 'mongoose';

export interface Service {
  assistant: ObjectId,
  content: string,
  wage: number,
  availableDays: string[],
  availableTimes: string[],
  greeting: string,
  isDriver: boolean,
  location: string,
  images: string[],
  isTrained: boolean,
  trainingCert: string[],
  isAuthorized: boolean,
  orgAuth: string[],
}

const ServiceSchema = new Schema<Service>({
  assistant: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    unique: true,
  },
  content: {
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
  availableTimes: [
    {
      type: String,
      required: true,
    },
  ],
  greeting: {
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
});

export default model<Service>('service', ServiceSchema);
