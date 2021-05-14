import { Schema, model } from 'mongoose';

export interface User {
  email: string,
  name: string,
  role: string,
  mobile: string,
  profileImage: string
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
  role: {
    type: String,
    required: true,
    trim: true,
    enum: [
      'customer',
      'assistant',
    ],
  },
  mobile: {
    type: String,
    required: true,
    trim: true,
  },
  profileImage: {
    type: String,
  },
});

const User = model<User>('user', UserSchema);

export default User;
