import { Schema, model } from 'mongoose';

export interface User {
  email: string,
  name: string,
  mobile?: string,
  role: string,
  image?: string
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
    trim: true,
    default: '',
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
  image: {
    type: String,
    default: '',
  },
});

export default model<User>('user', UserSchema);
