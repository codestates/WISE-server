import { Schema, model } from 'mongoose';

export interface User {
  email: string,
  name: string,
  mobile: string,
  role: string,
  location?: string,
  profileImage?: string
}

const UserSchema = new Schema<User>({
  email: {
    type: String,
    required: true,
    trim: true,
    index: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  mobile: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    required: true,
    trim: true,
    enum: [
      'customer',
      'assistant',
    ],
  },
  location: {
    type: String,
    trim: true,
  },
  profileImage: {
    type: String,
  },
});

export default model<User>('user', UserSchema);
