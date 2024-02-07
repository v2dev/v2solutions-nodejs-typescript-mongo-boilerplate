import mongoose, { Document } from 'mongoose';

interface User extends Document {
    name?: string;
    email?: string;
    password?: string;
    country?: string;
    mfaSecret?: string;
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
    token?: string;
    isVerified?: boolean;
    qrCodeUrl?: string;
}

const UserSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String },
    password: { type: String },
    country: { type: String },
    mfaSecret: { type: String },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    token: { type: String },
    isVerified: { type: Boolean, default: false },
    qrCodeUrl: { type: String },
  },
  { versionKey: false },
);

export const User = mongoose.model < User > ('users', UserSchema);
