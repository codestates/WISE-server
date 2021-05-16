import { Schema, model, ObjectId } from 'mongoose';

export interface Service {
  servedBy: ObjectId,
  content: string,
  wage: number,
  availableDays: string[],
  availableTimes: string[],
  greeting: string,
  isDriver: boolean,
  location: string,
}

const ServiceSchema = new Schema<Service>({
  servedBy: {
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
});

export default model<Service>('service', ServiceSchema);
