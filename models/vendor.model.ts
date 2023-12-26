import { Schema, Document, SchemaTypes, model } from 'mongoose';

interface VendorDocument extends Document {
  name: string;
  ownerName: string;
  foodType: [string];
  pinCode: string;
  address: string;
  phone: string;
  email: string;
  password: string;
  salt: string;
  serviceAvailable: boolean;
  coverImages: [string];
  rating: number;
  foodItems: any;
}

const VendorSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    ownerName: {
      type: String,
      required: true,
    },
    foodType: {
      type: [String],
    },
    pinCode: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    phone: {
      type: String,
      required: true,
    },
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
    serviceAvailable: {
      type: Boolean,
    },
    coverImages: {
      type: [String],
    },
    rating: {
      type: Number,
    },
    foodItems: [
      {
        type: SchemaTypes.ObjectId,
        ref: 'FoodItem',
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

const Vendor = model<VendorDocument>('Vendor', VendorSchema);

export { Vendor };
