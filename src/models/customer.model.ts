import { Schema, Document, model, SchemaType } from 'mongoose';
import { OrderDocument } from './order.model';
import { OrderItem } from '@/dto';

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
  cart: [OrderItem];
  orders: [OrderDocument];
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
    cart: [
      {
        foodItem: {
          type: Schema.Types.ObjectId,
          ref: 'FoodItem',
          required: true,
        },
        unit: {
          type: Number,
          required: true,
        },
      },
    ],
    orders: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Order',
      },
    ],
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
