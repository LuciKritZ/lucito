import { Schema, Document, model } from 'mongoose';

interface CustomerDocument extends Document {
  email: string;
  password: string;
  salt: string;
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  verified: boolean;
  otp: number;
  otpExpiry: Date;
  lat: number;
  long: number;
}

const CustomerSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    address: {
      type: String,
    },
    phone: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
      required: true,
    },
    otp: {
      type: Number,
      required: true,
    },
    otpExpiry: {
      type: Date,
      required: true,
    },
    lat: { type: Number },
    long: { type: Number },
  },
  {
    toJSON: {
      transform(_doc, ret) {
        delete ret.password;
        delete ret.salt;
        delete ret.__v;
      },
    },
    timestamps: true,
  }
);

const Customer = model<CustomerDocument>('Customer', CustomerSchema);

export { Customer };
