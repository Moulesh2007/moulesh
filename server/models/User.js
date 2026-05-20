import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String }, // hashed, optional for future OAuth
    avatar: { type: String, default: '' },
    role: {
      type: String,
      enum: ['admin', 'manager', 'client', 'driver', null],
      default: null,
    },
    authProvider: { type: String, default: 'local' },
    lastLogin: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
export default User;
