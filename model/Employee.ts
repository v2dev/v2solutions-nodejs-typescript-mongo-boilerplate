import mongoose, { Document, Schema } from 'mongoose';

interface Employee extends Document {
    name?: string;
    email?: string;
    dob?: Date;
    designation?: string;
    education?: string;
}

const EmployeeSchema: Schema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String },
    dob: { type: Date },
    designation: { type: String },
    education: { type: String },
  },
  { versionKey: false },
);

export const EmployeeModel =
    mongoose.model < Employee > ('employees', EmployeeSchema);
