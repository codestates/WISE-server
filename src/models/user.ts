import { Schema, model } from 'mongoose';

export interface User {
  email: string,
  name: string,
  signinMethod: string,
  mobile?: string,
  image?: string,
  isAssistant?: boolean,
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
  signinMethod: {
    type: String,
    required: true,
    enum: [
      'password',
      'google',
      'facebook',
    ],
  },
  mobile: {
    type: String,
    trim: true,
    default: '',
  },
  image: {
    type: String,
    default: '',
  },
  isAssistant: {
    type: Boolean,
    required: true,
    default: false,
  },
}, { timestamps: true });

export default model<User>('user', UserSchema);
