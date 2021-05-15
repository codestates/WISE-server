import { Schema, model, ObjectId } from 'mongoose';

export interface Service {
  servedBy: ObjectId,
  content: string,
  wage: number,
  availableDays: string[],
  availableTimes: string[],
  greeting: string,
  isDriver: boolean
}

const ServiceSchema = new Schema<Service>({
  servedBy: {
    type: String,
    required: true,
    unique: true,
  },
  content: {
    type: String,
    trim: true,
  },
  wage: {
    type: Number,
  },
  availableDays: [
    {
      type: String,
    },
  ],
  availableTimes: [
    {
      type: String,
    },
  ],
  greeting: {
    type: String,
    trim: true,
  },
  isDriver: {
    type: Boolean,
  },
});

export default model<Service>('service', ServiceSchema);
