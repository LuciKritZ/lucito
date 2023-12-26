import { Schema, Document, model, ObjectId, SchemaTypes } from 'mongoose';

export interface FoodItemDocument extends Document {
  name: string;
  description: string;
  category: string;
  foodType: string;
  preparationTime: number;
  price: number;
  rating: number;
  images: [string];
  vendorId: ObjectId;
}

const FoodItemSchema = new Schema(
  {
    vendorId: { type: SchemaTypes.ObjectId, ref: 'Vendor' },
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String },
    foodType: { type: String, required: true },
    preparationTime: { type: Number },
    price: { type: Number, required: true },
    rating: { type: Number },
    images: { type: [String] },
  },
  {
    toJSON: {
      transform(_doc, ret) {
        delete ret.__v;
      },
    },
    timestamps: true,
  }
);

const FoodItem = model<FoodItemDocument>('FoodItem', FoodItemSchema);

export { FoodItem };
